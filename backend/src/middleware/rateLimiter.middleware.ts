import rateLimit from 'express-rate-limit';

// rateLimiters.config.ts
export const limiterConfig = {
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8' as const,
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: { error: 'Too many requests, please try again later.' },
};

export const replayLimiterConfig = {
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8' as const,
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: { error: 'Too many replay attempts, please try again later.' },
};

export const limiter = rateLimit({ ...limiterConfig, skip: () => process.env.NODE_ENV === 'test' });

export const replayLimiter = rateLimit({
  ...replayLimiterConfig,
  skip: () => process.env.NODE_ENV === 'test',
});
