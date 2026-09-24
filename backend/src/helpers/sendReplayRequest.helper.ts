import type { ReconstructedRequest, SendResult } from '../types/express';
import { cleanHeader } from './cleaHeaders.helper';


export const send = async (requestData: ReconstructedRequest, url: string): Promise<SendResult> => {
  const start = Date.now();
  try {
    const hasBody = !['GET', 'HEAD'].includes(requestData.method.toUpperCase());

    const response = await fetch(url, {
      method: requestData.method,
      headers: cleanHeader(requestData.headers),
      body: hasBody ? JSON.stringify(requestData.body) : undefined,
    });

    const responseBody = await response.json().catch(() => null);

    return {
      success: response.ok,
      statusCode: response.status,
      responseBody: responseBody,
      responseTime: Date.now() - start,
    };
  } catch (error) {
    console.error('Send failed - full error:', error);
    if (error instanceof Error && error.cause) {
      console.error('Cause:', error.cause);
    }
    return {
      success: false,
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
