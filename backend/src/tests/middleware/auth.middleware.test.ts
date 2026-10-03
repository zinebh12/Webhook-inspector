process.env.JWT_SECRET = 'test-secret';

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../server/app';

jest.mock('../../prisma/db', () => ({
  db: {
    orm: {
      public: {},
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

describe('auth middleware', () => {
  it('checks that tokens are valid and present', async () => {
    const token = jwt.sign({ userId: 'user-1' }, 'test-secret', { expiresIn: '7d' });

    const response = await request(app).get('/api/auth/user').set('Cookie', `token=${token}`);

    expect(response.status).not.toBe(401);
  });

  it('returns 401 if no token is present', async () => {
    const token = jwt.sign({ undefined }, 'test-secret');

    const response = await request(app).get('/api/auth/user').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual('Not authenticated');
  });

  it('returns 401 if token is malformed', async () => {
    const token = 'malformed token';

    const response = await request(app).get('/api/auth/user').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual('Invalid or expired token');
  });

  it('returns 401 if token is expired', async () => {
    const token = jwt.sign({ userId: 'user-1' }, 'test-secret', {
      expiresIn: '0',
    });

    const response = await request(app).get('/api/auth/user').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual('Invalid or expired token');
  });

  it('returns 401 if JWT_SECRET is not defined', async () => {
    delete process.env.JWT_SECRET;

    const token = jwt.sign({ userId: 'user-1' }, 'test-secret', { expiresIn: '7d' });

    const response = await request(app).get('/api/auth/user').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual('JWT_SECRET is not set');
  });
});
