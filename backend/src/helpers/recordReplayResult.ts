import { send } from './sentReplayRequest';
import { db } from '../prisma/db';

type SendResult = {
  success: boolean;
  statusCode?: number;
  responseBody?: unknown;
  responseTime: number;
  error?: string;
};

type ReconstructedRequest = {
  method: string;
  headers: Record<string, string>;
  body: unknown;
};

export const record = async (
  requestData: ReconstructedRequest,
  requestId: string,
  url: string,
  resultObject: SendResult,
) => {
  try {
    const { success, statusCode, responseBody, responseTime, error } = resultObject;
    await db.orm.public.ReplayAttempt.create({
      success,
      statusCode,
      responseBody,
      responseTime,
      errorMessage: error,
      requestId,
      url,
    });
  } catch (error) {
    console.error('Failed to record replay result:', error);
    throw error;
  }
};
