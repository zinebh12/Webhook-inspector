import { generateWebhookSlug, buildWebhookUrl } from '../helpers/generateWebhookSlug.helper';
import { describe, expect, it } from '@jest/globals';

describe('generates webhook slug', () => {
  it('returns a random id', () => {
    const result = generateWebhookSlug(10);
    expect(typeof result).toBe('string');
    expect(result).toHaveLength(10);
  });

  it('defaults to 10 when no argument is given', () => {
    const result = generateWebhookSlug();
    expect(result).toHaveLength(10);
  });
  it('generates a different value on each call', () => {
    const first = generateWebhookSlug();
    const second = generateWebhookSlug();
    expect(first).not.toEqual(second);
  });
});

describe('build webhook url', () => {
  it('returns a costume url', () => {
    process.env.BASE_URL = 'http://example.com';
    const result = buildWebhookUrl('abc-123');
    expect(result).toBe('http://example.com/hooks/abc-123');
  });
});
