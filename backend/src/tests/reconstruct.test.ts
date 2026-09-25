import { reconstruct } from '../helpers/reconstructRequest.helper';
import { describe, expect, it, jest } from '@jest/globals';
import { db } from '../prisma/db';

jest.mock('../prisma/db', () => ({
  db: {
    orm: {
      public: {
        WebhookRequest: {
          where: jest.fn(),
        },
      },
    },
  },
}));

describe('Reconstruct', () => {
  it('return reconstruct when found', async () => {
    const mockRow = {
      id: 'abc-123',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { to: 'fu' },
      query: { page: '1' },
    };

    (db.orm.public.WebhookRequest.where as jest.Mock).mockReturnValue({
      first: jest.fn<() => Promise<typeof mockRow>>().mockResolvedValue(mockRow),
    });

    const result = await reconstruct(mockRow.id);
    expect(result.method).toBe(mockRow.method);
    expect(result.headers).toEqual(mockRow.headers);
    expect(result.body).toEqual(mockRow.body);
  });
  it('throws when request does not exist', async () => {
    (db.orm.public.WebhookRequest.where as jest.Mock).mockReturnValue({
      first: jest.fn<() => Promise<null>>().mockResolvedValue(null),
    });

    await expect(reconstruct('no-id')).rejects.toThrow('Request not found');
  });

  it('defaults headers/query to empty object when null', async () => {
    const mockRow = {
      id: 'abc-123',
      method: 'POST',
      header: null,
      body: null,
      query: null,
    };
    (db.orm.public.WebhookRequest.where as jest.Mock).mockReturnValue({
      first: jest.fn<() => Promise<typeof mockRow>>().mockResolvedValue(mockRow),
    });

    const result = await reconstruct(mockRow.id);
    expect(result.method).toBe(mockRow.method);
    expect(result.headers).toEqual({});
    expect(result.body).toBeNull();
    expect(result.query).toBeNull();
  });
});
