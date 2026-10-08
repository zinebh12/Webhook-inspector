/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, jest } from '@jest/globals';
import app from '../../server/app';
import request from 'supertest';
import { replayService } from '../../service/replay.service';

//db mock
jest.mock('../../prisma/db', () => ({
  db: {},
}));

jest.mock('../../service/replay.service', () => ({
  replayService: jest.fn(),
}));

const replayServiceMock = replayService as jest.Mock<(...args: any[]) => any>;

describe('replay', () => {
  it('returns 200 with the service result when successful', async () => {
    const mockResult = { success: true, statusCode: 200, responseTime: 120 };

    replayServiceMock.mockResolvedValue(mockResult);

    const response = await request(app)
      .post('/webhook/bc046aa3-f949-408c-bd7f-f77ad214eb99/replay')
      .send({ url: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult);
  });

  it('returns 400 for an invalid url', async () => {
    const response = await request(app)
      .post('/webhook/bc046aa3-f949-408c-bd7f-f77ad214eb99/replay')
      .send({ url: 'invalid-url' });

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual('Invalid url');
  });

  it('returns 500 if the service throws', async () => {
    replayServiceMock.mockRejectedValue(new Error('Replay failed'));

    const response = await request(app)
      .post('/webhook/bc046aa3-f949-408c-bd7f-f77ad214eb99/replay')
      .send({ url: 'https://example.com' });

    expect(response.status).toBe(500);
    expect(response.body.error).toEqual('Replay failed');
  });
});
