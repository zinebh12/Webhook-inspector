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
          where: jest.fn(),
        },
      },
    },
  },
}));

const mockCreate = jest.spyOn(db.orm.public.WebhookEndpoint, 'create');

const mockGet = jest.spyOn(db.orm.public.WebhookEndpoint, 'where');

describe('POST /endpoint', () => {
  it('resolves 201 when a new endpoint is created', async () => {
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

  it('checks for missing and invalid fields, returns 400', async () => {
    const response = await request(app)
      .post('/api/webhook/endpoints')
      .send({ userId: 'user-1' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toBe('Validation failed');

    expect(db.orm.public.WebhookEndpoint.create).not.toHaveBeenCalled();
  });
  it('confirms webhook url is formatted in the response, returns 201', async () => {
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
  it('returns 500 if db call fails', async () => {
    mockCreate.mockRejectedValue(new Error('Error creating new Endpoint'));
    mockGet.mockReturnValue({
      all: jest
        .fn<() => Promise<typeof undefined>>()
        .mockRejectedValue(new Error('Error fetching Endpoints')),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .post('/api/webhook/endpoints')
      .send({ name: 'new-endpoint', userId: 'user-1' })
      .expect(500);

    expect(response.body.error).toBe('Error creating new Endpoint');
  });
});

describe('GET /endpoint', () => {
  it('return 200 rows when found', async () => {
    const mockEndpointRow = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: '7d9e2f14-3a5b-4c8e-9f21-6b0a1d3c5e77',
      name: 'Stripe test endpoint',
      slug: 'a1b2c3d4e5',
      isActive: true,
      createdAt: new Date('2026-09-20T10:00:00.000Z'),
    };

    mockGet.mockReturnValue({
      all: jest
        .fn<() => Promise<(typeof mockEndpointRow)[]>>()
        .mockResolvedValue([mockEndpointRow]),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app).get('/api/webhook/endpoints').expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        userId: '7d9e2f14-3a5b-4c8e-9f21-6b0a1d3c5e77',
      }),
    ]);
  });

  it('confirms empty rows return, returns 200', async () => {
    mockGet.mockReturnValue({
      all: jest.fn<() => Promise<[]>>().mockResolvedValue([]),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app).get('/api/webhook/endpoints').expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  it('returns 500 if db call fails', async () => {
    mockGet.mockReturnValue({
      all: jest
        .fn<() => Promise<typeof undefined>>()
        .mockRejectedValue(new Error('Error fetching Endpoints')),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app).get('/api/webhook/endpoints').expect(500);

    expect(response.body.error).toBe('Error fetching Endpoints');
  });
});

describe('GET /endpoint/:id', () => {
  it('returns existing endpoint', async () => {
    const mockEndpointRow = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: '7d9e2f14-3a5b-4c8e-9f21-6b0a1d3c5e77',
      name: 'Stripe test endpoint',
      slug: 'a1b2c3d4e5',
      isActive: true,
      createdAt: new Date('2026-09-20T10:00:00.000Z'),
    };

    mockGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof mockEndpointRow>>().mockResolvedValue(mockEndpointRow),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .get('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        ...mockEndpointRow,
        createdAt: '2026-09-20T10:00:00.000Z',
      }),
    );
  });
  it('returns 400 if id is malformed', async () => {
    const response = await request(app).get('/api/webhook/endpoints/no-valid-id').expect(400);
    expect(response.body.error).toBe('Invalid endpoint ID format');
  });
  it('returns 404 if endpoint does not exist', async () => {
    const noEndpoint = { error: 'Endpoint not found' };

    mockGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .get('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99')
      .expect(404);

    expect(response.body).toEqual(noEndpoint);
  });
  it('returns 500 if db call fails', async () => {
    mockGet.mockReturnValue({
      where: jest
        .fn<() => Promise<typeof undefined>>()
        .mockRejectedValue(new Error('Failed to fetch endpoint')),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .get('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99')
      .expect(500);

    expect(response.body.error).toBe('Failed to fetch endpoint');
  });
});

describe('DELETE /endpoint/:id', () => {
  it('returns 204 for valid deleting endpoint', async () => {
    const mockEndpointRow = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: '7d9e2f14-3a5b-4c8e-9f21-6b0a1d3c5e77',
      name: 'Stripe test endpoint',
      slug: 'a1b2c3d4e5',
      isActive: true,
      createdAt: new Date('2026-09-20T10:00:00.000Z'),
    };

    mockGet.mockReturnValue({
      delete: jest.fn<() => Promise<typeof mockEndpointRow>>().mockResolvedValue(mockEndpointRow),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    await request(app)
      .delete('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99')
      .expect(204);
  });

  it('returns 400 if id is malformed', async () => {
    const response = await request(app).delete('/api/webhook/endpoints/no-valid-id').expect(400);
    expect(response.body.error).toBe('Invalid endpoint ID format');
  });

  it('returns 404 if id does not exist', async () => {
    mockGet.mockReturnValue({
      delete: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .delete('/api/webhook/endpoints/00000000-0000-0000-0000-000000000000')
      .expect(404);

    expect(response.body.error).toBe('Endpoint not found');
  });

  it('returns 500 if db call fails', async () => {
    mockGet.mockReturnValue({
      delete: jest
        .fn<() => Promise<typeof undefined>>()
        .mockRejectedValue(new Error('Failed to delete Endpoint')),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .delete('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99')
      .expect(500);

    expect(response.body.error).toBe('Failed to delete Endpoint');
  });
});

describe('PATCH /endpoint/:id', () => {
  it('confirms returned endpoint reflects new status, returns 200', async () => {
    const mockToggle = { isActive: false };
    mockGet.mockReturnValue({
      update: jest.fn<() => Promise<typeof mockToggle>>().mockResolvedValue(mockToggle),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .patch('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99')
      .send(mockToggle)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockToggle);
  });

  it('returns 404 if endpoint does not exist', async () => {
    mockGet.mockReturnValue({
      update: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .patch('/api/webhook/endpoints/00000000-0000-0000-0000-000000000000')
      .send({ isActive: false })
      .expect(404);

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual('Endpoint not found');
  });
  it('returns 500 if db call fails', async () => {
    mockGet.mockReturnValue({
      update: jest
        .fn<() => Promise<typeof undefined>>()
        .mockRejectedValue(new Error('Failed to update endpoint')),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .patch('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99')
      .send({ isActive: false })
      .expect(500);

    expect(response.body.error).toBe('Failed to update endpoint');
  });
});
