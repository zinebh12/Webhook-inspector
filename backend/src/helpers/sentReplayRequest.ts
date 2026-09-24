import type { ReconstructedRequest, SendResult } from '../types/express';

export const send = async (requestData: ReconstructedRequest, url: string): Promise<SendResult> => {
  const start = Date.now();
  try {
    const hasBody = !['GET', 'HEAD'].includes(requestData.method.toUpperCase());
    const response = await fetch(url, {
      method: requestData.method,
      headers: requestData.headers,
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
    return {
      success: false,
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
