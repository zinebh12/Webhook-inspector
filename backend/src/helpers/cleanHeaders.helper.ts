import type { ReconstructedRequest } from '../types/express';

const FORBIDDEN_HEADERS = [
  'content-length',
  'host',
  'connection',
  'transfer-encoding',
  'keep-alive',
  'upgrade',
  'proxy-connection',
  'te',
  'expect',
];

export const cleanHeaders = (headers: ReconstructedRequest['headers']) =>
  Object.fromEntries(
    Object.entries(headers)
      .filter(([key]) => !FORBIDDEN_HEADERS.includes(key.toLowerCase()))
      .map(([key, value]) => [key, String(value)]),
  );
