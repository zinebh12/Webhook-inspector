import { cleanHeaders } from '../helpers/cleanHeaders.helper';
import { describe, it, expect } from '@jest/globals';

describe('clean header', () => {
  it('returns a cleaned header', () => {
    const headers = {
      'content-type': 'application/json',
      host: 'example.com',
      connection: 'keep-alive',
    };
    const result = cleanHeaders(headers);
    expect(result).not.toHaveProperty('host');
    expect(result).not.toHaveProperty('connection');
    expect(result).toHaveProperty('content-type');
  });

  it('filters out host even if capitalized', () => {
    const headers = { Host: 'example.com', 'Content-type': 'application/json' };
    const result = cleanHeaders(headers);
    expect(result).not.toHaveProperty('Host');
  });

  it('coerces all values to turn to strings', () => {
    const headers = { 'x-count': 22 as unknown as string, 'Content-type': 'application/json' };
    const result = cleanHeaders(headers);
    expect(typeof result['x-count']).toBe('string');
  });
});
