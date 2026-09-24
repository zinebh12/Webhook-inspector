import { db } from '../prisma/db';
import type { SendResult, ReconstructedRequest } from '../types/express';

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
