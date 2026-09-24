import type { JsonValue } from '@prisma/orm-postgres/contract';

const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'api-key',
  'x-auth-token',
  'proxy-authorization',
];

export const sanitizeHeaders = (headers: Record<string, JsonValue>): Record<string, JsonValue> => {
  const sanitized: Record<string, JsonValue> = {};

  for (const key in headers) {
    if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = headers[key];
    }
  }
  return sanitized;
};
