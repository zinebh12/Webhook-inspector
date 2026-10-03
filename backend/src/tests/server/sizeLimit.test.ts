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

describe('size limit', () => {
  it('allows body less than 100kb', async () => {
    const payload = { data: 'x'.repeat(90 * 1024) };
    const response = await request(app)
      .post('/webhook/412354r0432-325gf4-df4gh52-dsf4dfg')
      .send(payload);

    expect(response.status).not.toBe(413);
  });

  it('forbids a body more than 100kb', async () => {
    const payload = { data: 'x'.repeat(200 * 1024) };
    const response = await request(app)
      .post('/webhook/412354r0432-325gf4-df4gh52-dsf4dfg')
      .send(payload);

    expect(response.status).toBe(413);
  });
});
