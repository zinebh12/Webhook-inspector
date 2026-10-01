import request from 'supertest';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { db } from '../../prisma/db';
import app from '../../server/app';
import type { authRequest } from '../../types/express';
import { NextFunction } from 'express';

//mock middleware
jest.mock('../../middleware/authMiddleware', () => ({
  authMiddleware: (req: authRequest, res: Response, next: NextFunction) => {
    req.userId = 'user-1';
    next();
  },
}));

//io mock
jest.mock('../../lib/socket', () => ({
  getIo: jest.fn(() => ({
    to: jest.fn(() => ({
      emit: jest.fn(),
    })),
  })),
}));

//mock db
jest.mock('../../prisma/db', () => ({
  db: {
    orm: {
      public: {
        WebhookRequest: {
          create: jest.fn(),
          where: jest.fn(),
        },
        WebhookEndpoint: {
          where: jest.fn(),
        },
      },
    },
  },
}));
// /api/webhook/request/:id
const mockEndpointGet = jest.spyOn(db.orm.public.WebhookEndpoint, 'where');

const mockCreate = jest.spyOn(db.orm.public.WebhookRequest, 'create');
const mockGet = jest.spyOn(db.orm.public.WebhookRequest, 'where');

beforeEach(() => {
  mockGet.mockReset();
});

describe('POST/ request', () => {
  it('returns 200 if endpoint is valid', async () => {
    const mockEndpoint = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: '7d9e2f14-3a5b-4c8e-9f21-6b0a1d3c5e77',
      name: 'Stripe test endpoint',
      slug: 'a1b2c3d4e5',
      isActive: true,
      createdAt: new Date('2026-09-20T10:00:00.000Z'),
    };
    const mockWebhookRequest = {
      id: '8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27',
      endpointId: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'GitHub-Hookshot/test',
      },
      body: {
        event: 'push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
    };

    mockEndpointGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof mockEndpoint>>().mockResolvedValue(mockEndpoint),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    mockCreate.mockResolvedValue(
      mockWebhookRequest as unknown as Awaited<
        ReturnType<typeof db.orm.public.WebhookRequest.create>
      >,
    );

    const response = await request(app)
      .post('/webhook/a1b2c3d4e5')
      .send({
        event: 'push',
        amount: 100,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true });

    expect(db.orm.public.WebhookRequest.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        endpointId: mockEndpoint.id,
        method: 'POST',
        statusCode: 200,
      }),
    );
  });

  it('returns 404 if endpoint id does not exist', async () => {
    mockEndpointGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    mockCreate.mockResolvedValue(
      undefined as unknown as Awaited<ReturnType<typeof db.orm.public.WebhookRequest.create>>,
    );

    const response = await request(app)
      .post('/webhook/a1b2c3d4e5')
      .send({
        event: 'push',
        amount: 100,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual('No endpoint found.');
  });

  it('returns 401 if endpoint is not active', async () => {
    const mockEndpoint = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: '7d9e2f14-3a5b-4c8e-9f21-6b0a1d3c5e77',
      name: 'Stripe test endpoint',
      slug: 'a1b2c3d4e5',
      isActive: false,
      createdAt: new Date('2026-09-20T10:00:00.000Z'),
    };
    const mockWebhookRequest = {
      id: '8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27',
      endpointId: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'GitHub-Hookshot/test',
      },
      body: {
        event: 'push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
    };

    mockEndpointGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof mockEndpoint>>().mockResolvedValue(mockEndpoint),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    mockCreate.mockResolvedValue(
      mockWebhookRequest as unknown as Awaited<
        ReturnType<typeof db.orm.public.WebhookRequest.create>
      >,
    );

    const response = await request(app)
      .post('/webhook/a1b2c3d4e5')
      .send({
        event: 'push',
        amount: 100,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual('Endpoint is not active.');
  });

  it('returns 200 for all different bodies', async () => {
    const mockEndpoint = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: '7d9e2f14-3a5b-4c8e-9f21-6b0a1d3c5e77',
      name: 'Stripe test endpoint',
      slug: 'a1b2c3d4e5',
      isActive: true,
      createdAt: new Date('2026-09-20T10:00:00.000Z'),
    };
    const mockWebhookRequest = {
      id: '8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27',
      endpointId: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
      },
      body: 'this is not JSON at all <<< ???',
      query: {},
      ip: '::ffff:127.0.0.1',
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
    };

    mockEndpointGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof mockEndpoint>>().mockResolvedValue(mockEndpoint),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    mockCreate.mockResolvedValue(
      mockWebhookRequest as unknown as Awaited<
        ReturnType<typeof db.orm.public.WebhookRequest.create>
      >,
    );

    const response = await request(app)
      .post('/webhook/a1b2c3d4e5')
      .send({
        event: 'push',
        amount: 100,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true });

    expect(db.orm.public.WebhookRequest.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        endpointId: mockEndpoint.id,
        method: 'POST',
        statusCode: 200,
      }),
    );
  });
});

describe('DELETE /requests', () => {
  it('returns 204 if request is valid', async () => {
    const mockWebhookRequest = {
      id: '8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27',
      endpointId: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'GitHub-Hookshot/test',
      },
      body: {
        event: 'push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
      endpoint: {
        userId: 'user-1',
      },
    };
    mockGet
      .mockReturnValueOnce({
        include: jest.fn().mockReturnValue({
          first: jest
            .fn<() => Promise<typeof mockWebhookRequest>>()
            .mockResolvedValue(mockWebhookRequest),
        }),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>)
      .mockReturnValueOnce({
        delete: jest
          .fn<() => Promise<typeof mockWebhookRequest>>()
          .mockResolvedValue(mockWebhookRequest),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    await request(app)
      .delete('/api/webhook/request/8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27')
      .expect(204);
  });

  it('returns 400 if request id is invalid', async () => {
    const mockWebhookRequest = {
      id: 'no-id-value',
      endpointId: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'GitHub-Hookshot/test',
      },
      body: {
        event: 'push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
      endpoint: {
        userId: 'user-1',
      },
    };
    mockGet
      .mockReturnValueOnce({
        include: jest.fn().mockReturnValue({
          first: jest
            .fn<() => Promise<typeof mockWebhookRequest>>()
            .mockResolvedValue(mockWebhookRequest),
        }),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>)
      .mockReturnValueOnce({
        delete: jest
          .fn<() => Promise<typeof mockWebhookRequest>>()
          .mockResolvedValue(mockWebhookRequest),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app).delete('/api/webhook/request/no-id-value').expect(400);
    expect(response.body.error).toEqual('Invalid endpoint ID');
  });

  it('returns 404 if request does not exist', async () => {
    mockGet
      .mockReturnValueOnce({
        include: jest.fn().mockReturnValue({
          first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
        }),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>)
      .mockReturnValueOnce({
        delete: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .delete('/api/webhook/request/00000000-0000-0000-0000-000000000000')
      .expect(404);
    expect(response.body.error).toEqual('Request not found');
  });
});
