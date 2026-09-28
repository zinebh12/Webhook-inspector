/* eslint-disable @typescript-eslint/no-explicit-any */
import { reconstruct } from '../../helpers/reconstructRequest.helper';
import { send } from '../../helpers/sendReplayRequest.helper';
import { record } from '../../helpers/recordReplayResult.helper';
import { replayService } from '../../service/replayService';
import { describe, expect, it, jest } from '@jest/globals';
import type { SendResult } from '../../types/express';

jest.mock('../../helpers/reconstructRequest.helper', () => ({
  reconstruct: jest.fn(),
}));
jest.mock('../../helpers/sendReplayRequest.helper', () => ({
  send: jest.fn(),
}));
jest.mock('../../helpers/recordReplayResult.helper', () => ({
  record: jest.fn(),
}));

const reconstructMock = reconstruct as jest.Mock<(...args: any[]) => any>;
const sendMock = send as jest.Mock<(...args: any[]) => any>;
const recordMock = record as jest.Mock<(...args: any[]) => any>;

describe('Replay service', () => {
  it('resolves in the intended order', async () => {
    const success = {
      success: true,
      statusCode: 200,
      responseTime: 100,
    };
    const mockRow = {
      id: 'abc-123',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { to: 'fu' },
      query: { page: '1' },
    };

    reconstructMock.mockResolvedValue(mockRow);
    sendMock.mockResolvedValue(success);
    recordMock.mockResolvedValue(undefined);

    await replayService('abc-123', 'https://example.com');

    expect(reconstruct).toHaveBeenCalledWith('abc-123');
    expect(sendMock).toHaveBeenCalledWith(mockRow, 'https://example.com');
    expect(record).toHaveBeenCalled();
  });
  it('matches the return value of replay with send', async () => {
    const mockRow = {
      id: 'abc-123',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { to: 'fu' },
      query: { page: '1' },
    };
    const mockData: SendResult = {
      success: true,
      statusCode: 200,
      responseBody: { to: 'fu' },
      responseTime: 250,
      error: undefined,
    };

    reconstructMock.mockResolvedValue(mockRow);
    sendMock.mockResolvedValue(mockData);
    recordMock.mockResolvedValue(undefined);

    const result = await replayService('abc-123', 'https://example.com');

    expect(result).toEqual(mockData);
  });

  it('stops the operation if reconstruct throws an error', async () => {
    reconstructMock.mockRejectedValue(new Error('Request not found'));

    await expect(replayService('no-id', 'https://example.com')).rejects.toThrow(
      'Request not found',
    );
    expect(sendMock).not.toHaveBeenCalled();
    expect(recordMock).not.toHaveBeenCalled();
  });

  it('confirms record still works even if send has a failed success', async () => {
    const mockRow = {
      id: 'abc-123',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { to: 'fu' },
      query: { page: '1' },
    };
    const sendRow = {
      success: false,
      statusCode: 500,
      responseTime: 100,
    };
    sendMock.mockResolvedValue(sendRow);
    reconstructMock.mockResolvedValue(mockRow);

    await replayService('abc-123', 'https://example.com');

    expect(recordMock).toHaveBeenCalled();
  });
});
