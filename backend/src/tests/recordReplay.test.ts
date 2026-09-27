import { describe, expect, it, jest } from '@jest/globals';
import { record } from '../helpers/recordReplayResult.helper';
import type { SendResult } from '../types/express';
import { db } from '../prisma/db';

jest.mock('../prisma/db', () => ({
  db: {
    orm: {
      public: {
        ReplayAttempt: {
          create: jest.fn(),
        },
      },
    },
  },
}));
const mockCreate = db.orm.public.ReplayAttempt.create as jest.MockedFunction<
  typeof db.orm.public.ReplayAttempt.create
>;

describe('record', () => {
  it('confirms a replay was created in the database', async () => {
    const mockData: SendResult = {
      success: true,
      statusCode: 200,
      responseBody: { to: 'fu' },
      responseTime: 250,
      error: undefined,
    };

    mockCreate.mockResolvedValue(
      mockData as unknown as Awaited<ReturnType<typeof db.orm.public.ReplayAttempt.create>>,
    );

    const result = await record('id-123', 'example.com', mockData);
    expect(result).toEqual(mockData);
  });

  it('confirm the error is logged and/or rethrown, not silently swallowed', async () => {
    mockCreate.mockRejectedValue(new Error('DB write failed'));

    await expect(
      record('no-id', 'example.com', {
        success: false,
        statusCode: 500,
        responseBody: { to: 'fu' },
        responseTime: 250,
      }),
    ).rejects.toThrow('DB write failed');
  });
});
