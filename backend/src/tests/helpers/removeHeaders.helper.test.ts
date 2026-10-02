import { sanitizeHeaders } from '../../helpers/removeHeaders.helper';
import { describe, expect, it } from '@jest/globals';

describe('sanitize headers', () => {
  it('returns a clean header', () => {
    const headers = {
      'content-type': 'application/json',
      authorization: 'user',
    };
    const result = sanitizeHeaders(headers);
    expect(result.authorization).toBe('[REDACTED]');
    expect(result['content-type']).toBe('application/json');
  });

  it('redact sensitive headers even if capitalized', () => {
    const headers = {
      Authorization: 'user',
    };
    const result = sanitizeHeaders(headers);
    expect(result.Authorization).toBe('[REDACTED]');
  });

  it('Leave all non-sensitive headers untouched', () => {
    const headers = { 'x-request-id': 'abc-123' };
    const result = sanitizeHeaders(headers);
    expect(result['x-request-id']).toBe('abc-123');
  });
});
