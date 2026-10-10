import { describe, it, expect, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../server/app';

jest.mock('../../prisma/db', () => ({
  db: {
    orm: {
      public: {},
    },
  },
}));

describe('cors', () => {
  it('returns 200 for allowed origin', async () => {
    const url = 'http://localhost:3000';

    const response = await request(app).get('/api/health').set('Origin', url);

    expect(response.headers['access-control-allow-origin']).toContain(url);
    expect(response.status).toBe(200);
  });

  it('checks for forbidden origin', async () => {
    const url = 'http://evil.com';

    const response = await request(app).get('/api/health').set('Origin', url);

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
    expect(response.body.error).toEqual('Not allowed by CORS');
    expect(response.status).toBe(403);
  });

  it('allows for no origin header', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
    expect(response.status).toBe(200);
  });
});
