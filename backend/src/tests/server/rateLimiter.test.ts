import { describe, it, expect, jest } from '@jest/globals';
import { replayLimiterConfig, limiterConfig } from '../../middleware/rateLimiter.middleware';

jest.mock('../../prisma/db', () => ({
  db: {
    orm: {
      public: {},
    },
  },
}));

describe('reteLimiter', () => {
  it('limiter allows 100 requests per 15 minutes', () => {
    expect(limiterConfig.windowMs).toBe(15 * 60 * 1000);
    expect(limiterConfig.limit).toBe(100);
  });

  it('replayLimiter allows 5 requests per 15 minutes', () => {
    expect(replayLimiterConfig.windowMs).toBe(15 * 60 * 1000);
    expect(replayLimiterConfig.limit).toBe(5);
  });

  it('limiter has the correct message', () => {
    expect(limiterConfig.message).toEqual({
      error: 'Too many requests, please try again later.',
    });
  });

  it('replayLimiter has the correct message', () => {
    expect(replayLimiterConfig.message).toEqual({
      error: 'Too many replay attempts, please try again later.',
    });
  });
});
