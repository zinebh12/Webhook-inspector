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
        'user-agent': 'GitHub/test',
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
        'user-agent': 'GitHub/test',
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

  it('catches errors and returns 500', async () => {
    mockCreate.mockRejectedValue(new Error('Failed to create WebhookRequest'));

    const response = await request(app)
      .post('/webhook/a1b2c3d4e5')
      .send({
        event: 'push',
        amount: 100,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body.error).toEqual('Failed to create webhook request');
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
        'user-agent': 'GitHub/test',
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
        'user-agent': 'GitHub/test',
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

  it('catches errors and returns 500', async () => {
    mockGet.mockReturnValueOnce({
      delete: jest
        .fn<() => Promise<typeof undefined>>()
        .mockRejectedValue(new Error('Failed to delete Request')),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .delete('/api/webhook/request/bc046aa3-f949-408c-bd7f-f77ad214eb99')
      .expect(500);
    expect(response.body.error).toEqual('Failed to delete Request');
  });
});

describe('Clear all requests', () => {
  it('returns 200 if requests are cleared', async () => {
    const mockWebhookRequest = {
      id: '8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27',
      endpointId: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'GitHub/test',
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
    mockGet.mockReturnValueOnce({
      deleteAndCount: jest
        .fn<() => Promise<typeof mockWebhookRequest>>()
        .mockResolvedValue(mockWebhookRequest),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .delete('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99/requests/')
      .expect(200);
    expect(response.body.message).toEqual(`cleared [object Object] requests`);
  });

  it('returns 400 if request id is invalid', async () => {
    const mockWebhookRequest = {
      id: 'no-id-value',
      endpointId: 'no-id-value',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'GitHub/test',
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
    mockGet.mockReturnValueOnce({
      deleteAndCount: jest
        .fn<() => Promise<typeof mockWebhookRequest>>()
        .mockResolvedValue(mockWebhookRequest),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .delete('/api/webhook/endpoints/no-id-value/requests/')
      .expect(400);
    expect(response.body.error).toEqual('Invalid endpoint ID');
  });

  it('returns 404 if endpoint does not exist', async () => {
    mockEndpointGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app)
      .delete('/api/webhook/endpoints/00000000-0000-0000-0000-000000000000/requests/')
      .expect(404);

    expect(response.body.error).toEqual('Endpoint not found');
  });

  it('catches errors and returns 500', async () => {
    mockGet.mockReturnValueOnce({
      deleteAndCount: jest
        .fn<() => Promise<void>>()
        .mockRejectedValue(new Error('Failed to delete Requests')),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .delete('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99/requests/')
      .expect(500);
    expect(response.body.error).toEqual('Failed to delete Requests');
  });
});

describe('GET /requests', () => {
  it('confirms pagination is set without filters', async () => {
    const mockEndpoint = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: 'user-1',
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
        'user-agent': 'GitHub/test',
      },
      body: {
        event: 'push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
    };

    mockEndpointGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof mockEndpoint>>().mockResolvedValue(mockEndpoint),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);
    mockGet
      .mockReturnValueOnce({
        orderBy: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            offset: jest.fn().mockReturnValue({
              all: jest
                .fn<() => Promise<(typeof mockWebhookRequest)[]>>()
                .mockResolvedValue([mockWebhookRequest]),
            }),
          }),
        }),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>)
      .mockReturnValueOnce({
        all: jest
          .fn<() => Promise<(typeof mockWebhookRequest)[]>>()
          .mockResolvedValue(Array.from({ length: 100 }, () => mockWebhookRequest)),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .get('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99/requests?page=10&limit=10')
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body).toEqual(
      expect.objectContaining({
        page: 10,
        total: 100,
        limit: 10,
        totalPages: 10,
      }),
    );
  });

  it('confirms DB call receives the correct where conditions', async () => {
    const mockEndpoint = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: 'user-1',
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
        'user-agent': 'GitHub/test',
      },
      body: {
        event: 'push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
    };

    mockEndpointGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof mockEndpoint>>().mockResolvedValue(mockEndpoint),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);
    mockGet
      .mockReturnValueOnce({
        orderBy: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            offset: jest.fn().mockReturnValue({
              all: jest
                .fn<() => Promise<(typeof mockWebhookRequest)[]>>()
                .mockResolvedValue([mockWebhookRequest]),
            }),
          }),
        }),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>)
      .mockReturnValueOnce({
        all: jest
          .fn<() => Promise<(typeof mockWebhookRequest)[]>>()
          .mockResolvedValue(Array.from({ length: 100 }, () => mockWebhookRequest)),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    await request(app)
      .get(
        '/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99/requests' +
          '?method=POST' +
          '&from=2026-09-01' +
          '&to=2026-09-30',
      )
      .expect(200);
    expect(mockGet).toHaveBeenCalledWith({
      endpointId: mockEndpoint.id,
      method: 'POST',
      receivedAt: {
        gte: expect.any(Date),
        lte: expect.any(Date),
      },
    });
  });

  it('confirms the DB call receives the correct search term', async () => {
    const mockEndpoint = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: 'user-1',
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
        'user-agent': 'GitHub/test',
      },
      body: {
        event: 'test.push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
    };

    mockEndpointGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof mockEndpoint>>().mockResolvedValue(mockEndpoint),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);
    mockGet.mockReturnValueOnce({
      orderBy: jest.fn().mockReturnValue({
        all: jest
          .fn<() => Promise<(typeof mockWebhookRequest)[]>>()
          .mockResolvedValue([mockWebhookRequest]),
      }),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .get('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99/requests?search=push')
      .expect(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toEqual({
      ...mockWebhookRequest,
      receivedAt: mockWebhookRequest.receivedAt.toISOString(),
    });
  });

  it('returns an empty array if requesting more pages than the available results', async () => {
    const mockEndpoint = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: 'user-1',
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
        'user-agent': 'GitHub/test',
      },
      body: {
        event: 'push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
    };

    mockEndpointGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof mockEndpoint>>().mockResolvedValue(mockEndpoint),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);
    mockGet
      .mockReturnValueOnce({
        orderBy: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            offset: jest.fn().mockReturnValue({
              all: jest.fn<() => Promise<(typeof mockWebhookRequest)[]>>().mockResolvedValue([]),
            }),
          }),
        }),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>)
      .mockReturnValueOnce({
        all: jest
          .fn<() => Promise<(typeof mockWebhookRequest)[]>>()
          .mockResolvedValue(Array.from({ length: 100 }, () => mockWebhookRequest)),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .get('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99/requests?page=100&limit=10')
      .expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body).toEqual(
      expect.objectContaining({
        page: 100,
        total: 100,
        limit: 10,
        totalPages: 10,
      }),
    );
  });

  it('returns 400 if pagination params are invalid', async () => {
    const mockEndpoint = {
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      userId: 'user-1',
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
        'user-agent': 'GitHub/test',
      },
      body: {
        event: 'push',
        amount: 100,
      },
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
    };

    mockEndpointGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof mockEndpoint>>().mockResolvedValue(mockEndpoint),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);
    mockGet
      .mockReturnValueOnce({
        orderBy: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            offset: jest.fn().mockReturnValue({
              all: jest.fn<() => Promise<(typeof mockWebhookRequest)[]>>().mockResolvedValue([]),
            }),
          }),
        }),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>)
      .mockReturnValueOnce({
        all: jest
          .fn<() => Promise<(typeof mockWebhookRequest)[]>>()
          .mockResolvedValue(Array.from({ length: 100 }, () => mockWebhookRequest)),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .get(
        '/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99/requests?page=malformed&limit=-10',
      )
      .expect(400);

    expect(response.body.error).toEqual('Validation failed');
  });

  it('returns 404 if endpoint is not found', async () => {
    mockEndpointGet.mockReset();

    mockEndpointGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);

    const response = await request(app).get(
      '/api/webhook/endpoints/00000000-0000-0000-0000-000000000000/requests?page=10&limit=10',
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toEqual('No endpoint found');
  });

  it('catches errors and returns 500', async () => {
    mockEndpointGet.mockReturnValueOnce({
      first: jest
        .fn<() => Promise<typeof Error>>()
        .mockRejectedValue(new Error('Error getting requests')),
    } as unknown as ReturnType<typeof db.orm.public.WebhookEndpoint.where>);
    mockGet
      .mockReturnValueOnce({
        orderBy: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            offset: jest.fn().mockReturnValue({
              all: jest
                .fn<() => Promise<typeof Error>>()
                .mockRejectedValue(new Error('Error getting requests')),
            }),
          }),
        }),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>)
      .mockReturnValueOnce({
        all: jest
          .fn<() => Promise<typeof Error>>()
          .mockRejectedValue(new Error('Error getting requests')),
      } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .get('/api/webhook/endpoints/bc046aa3-f949-408c-bd7f-f77ad214eb99/requests?page=10&limit=10')
      .expect(500);

    expect(response.body.error).toEqual('Error getting requests');
  });
});

describe('GET /request/:id', () => {
  it('returns 400 for invalid id format', async () => {
    const mockWebhookRequest = {
      id: 'no-id-value',
      endpointId: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'GitHub/test',
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
    mockGet.mockReturnValueOnce({
      include: jest.fn().mockReturnValue({
        first: jest
          .fn<() => Promise<typeof mockWebhookRequest>>()
          .mockResolvedValue(mockWebhookRequest),
      }),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app).get('/api/webhook/request/no-id-value').expect(400);
    expect(response.body.error).toEqual('Invalid endpoint ID');
  });
  it('returns 404 if request does not exist', async () => {
    mockGet.mockReturnValueOnce({
      include: jest.fn().mockReturnValue({
        first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
      }),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .get('/api/webhook/request/8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27')
      .expect(404);
    expect(response.body.error).toEqual('Request not found');
  });

  it('returns 404 if request does not belong to user', async () => {
    const mockWebhookRequest = {
      id: '8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27',
      endpointId: '00000000-0000-0000-0000-000000000001',
      method: 'POST',
      headers: {},
      body: {},
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
      endpoint: {
        userId: 'different-user',
      },
    };
    mockGet.mockReturnValueOnce({
      include: jest.fn().mockReturnValue({
        first: jest
          .fn<() => Promise<typeof mockWebhookRequest>>()
          .mockResolvedValue(mockWebhookRequest),
      }),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .get('/api/webhook/request/8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27')
      .expect(404);

    expect(response.body.error).toEqual('Request not found');
  });

  it('returns 200 for successful request', async () => {
    const mockWebhookRequest = {
      id: '8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27',
      endpointId: '00000000-0000-0000-0000-000000000001',
      method: 'POST',
      headers: {},
      body: {},
      query: {},
      statusCode: 200,
      receivedAt: new Date('2026-09-29T19:00:00.000Z'),
      endpoint: {
        userId: 'user-1',
      },
    };
    mockGet.mockReturnValueOnce({
      include: jest.fn().mockReturnValue({
        first: jest
          .fn<() => Promise<typeof mockWebhookRequest>>()
          .mockResolvedValue(mockWebhookRequest),
      }),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    await request(app).get('/api/webhook/request/8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27').expect(200);
  });

  it('catches errors and returns 500', async () => {
    mockGet.mockReturnValueOnce({
      include: jest.fn().mockReturnValue({
        first: jest
          .fn<() => Promise<typeof Error>>()
          .mockRejectedValue(new Error('Error getting request')),
      }),
    } as unknown as ReturnType<typeof db.orm.public.WebhookRequest.where>);

    const response = await request(app)
      .get('/api/webhook/request/8f3c2a91-7d64-4b12-9e35-1a6f0c8d4b27')
      .expect(500);

    expect(response.body.error).toEqual('Error getting request');
  });
});
