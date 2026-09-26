import { send } from '../helpers/sendReplayRequest.helper';
import { describe, expect, it, jest } from '@jest/globals';

const mockedFetch = jest.spyOn(global, 'fetch');
const url = 'example.com';
const request = {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: { to: 'fu' },
};

describe('send', () => {
  it('returns successful status', async () => {
    const fakeResponse = {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ to: 'fu' }),
    };
    mockedFetch.mockResolvedValueOnce(fakeResponse as unknown as Response);
    const result = await send(request, url);
    expect(result).toEqual({
      success: true,
      statusCode: 200,
      responseBody: { to: 'fu' },
      responseTime: expect.any(Number),
    });
  });

  it('confirms false success', async () => {
    const notFoundResponse = {
      ok: false,
      status: 404,
      json: () => Promise.resolve({ to: 'fu' }),
    };
    mockedFetch.mockResolvedValueOnce(notFoundResponse as unknown as Response);
    const result = await send(request, url);

    expect(result).toEqual({
      success: false,
      statusCode: 404,
      responseBody: { to: 'fu' },
      responseTime: expect.any(Number),
    });
  });

  it('catches empty body', async () => {
    const emptyBodyResponse = {
      ok: false,
      status: 404,
      json: () => Promise.reject(new Error('invalid json')),
    };
    mockedFetch.mockResolvedValueOnce(emptyBodyResponse as unknown as Response);
    const result = await send(request, url);

    expect(result).toEqual({
      success: false,
      statusCode: 404,
      responseBody: null,
      responseTime: expect.any(Number),
    });
  });

  it('returns success:false for a 500 response, without throwing', async () => {
    const serverErrorResponse = {
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Error fetching' }),
    };
    mockedFetch.mockResolvedValueOnce(serverErrorResponse as unknown as Response);
    const result = await send(request, url);

    expect(result).toEqual({
      success: false,
      statusCode: 500,
      responseBody: { error: 'Error fetching' },
      responseTime: expect.any(Number),
    });
  });

  it('checks that no body is sent with GET/HEAD method', async () => {
    const getRequest = {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      body: { to: 'fu' },
    };
    const fakeResponse = {
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    } as unknown as Response;

    mockedFetch.mockResolvedValueOnce(fakeResponse as unknown as Response);
    await send(getRequest, url);

    expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({ body: undefined }));
  });

  it('catches a fetch network failure and returns success:false', async () => {
    const input = {
      success: false,
      error: 'Network error',
      responseTime: expect.any(Number),
    };

    mockedFetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await send(request, url);

    expect(result).toEqual(input);
  });
});
