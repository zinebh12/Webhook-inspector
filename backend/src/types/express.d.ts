import type { Request } from 'express';
import { JsonValue } from '@prisma/orm-postgres/contract';

export interface authRequest extends Request {
  userId?: string;
}

export type ReconstructedRequest = {
  method: string;
  headers: Record<string, string>;
  body: JsonValue;
};

export type SendResult = {
  success: boolean;
  statusCode?: number;
  responseBody?: JsonValue;
  responseTime: number;
  error?: string;
};
