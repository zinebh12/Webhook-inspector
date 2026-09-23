type SendResult = {
  success: boolean;
  statusCode?: number;
  responseBody?: unknown;
  responseTime: number;
  error?: string;
};

export const record = async (requestId: string, url: string, resultObject: SendResult) => {};
