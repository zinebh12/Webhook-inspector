import type { authRequest } from '../../types/express';
import type { Response, NextFunction } from 'express';
import request from 'supertest';
import { describe, it, expect, jest } from '@jest/globals';
import { db } from '../../prisma/db';
import app from '../../server/app';

//mock middleware
jest.mock('../../middleware/authMiddleware', () => ({
  authMiddleware: (req: authRequest, res: Response, next: NextFunction) => {
    req.userId = 'user-1';
    next();
  },
}));

//mock db
jest.mock('../../prisma/db', () => ({
  db: {
    orm: {
      public: {
        WebhookEndpoint: {
          create: jest.fn(),
        },
      },
    },
  },
}));

const mockCreate = db.orm.public.WebhookEndpoint.create as jest.MockedFunction<
  typeof db.orm.public.WebhookEndpoint.create
>;

describe('POST /endpoint', () => {
  it('resolves when a new endpoint is created', async () => {
    const mockEndpoint = {
      name: 'new-endpoint',
      slug: 'a-slug',
      userId: 'user-1',
    };
    mockCreate.mockResolvedValue(
      mockEndpoint as unknown as Awaited<ReturnType<typeof db.orm.public.WebhookEndpoint.create>>,
    );
    const response = await request(app)
      .post('/api/webhook/endpoints')
      .send({ name: 'new-endpoint', userId: 'user-1' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.endpoint).toEqual(mockEndpoint);

    expect(db.orm.public.WebhookEndpoint.create).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: 'new-endpoint', userId: 'user-1', slug: expect.any(String) }),
    );
  });

  it('checks for missing and invalid fields', async () => {
    const response = await request(app)
      .post('/api/webhook/endpoints')
      .send({ userId: 'user-1' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBe('Validation failed');

    expect(db.orm.public.WebhookEndpoint.create).not.toHaveBeenCalled();
  });
  it('confirms webhook url is formatted in the response', async () => {
    const mockEndpoint = {
      id: 'endpoint-1',
      name: 'new-endpoint',
      slug: 'new-endpoint-abc123', // whatever your generator actually produces, or mock it
      userId: 'user-1',
    };

    mockCreate.mockResolvedValue(
      mockEndpoint as unknown as Awaited<ReturnType<typeof db.orm.public.WebhookEndpoint.create>>,
    );

    const response = await request(app)
      .post('/api/webhook/endpoints')
      .send({ name: 'new-endpoint', userId: 'user-1' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.fullUrl).toMatch(/^http:\/\/.+\/hooks\/.+/);
    expect(response.body.endpoint.userId).toBe('user-1');
  });
});
