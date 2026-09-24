import { db } from '../prisma/db';

export const reconstruct = async (requestId: string) => {
  const existingRequest = await db.orm.public.WebhookRequest.where({ id: requestId }).first();

  if (!existingRequest) {
    throw new Error('Request not found');
  }

  return {
    method: existingRequest.method,
    headers: (existingRequest.headers as Record<string, string>) ?? {},
    body: existingRequest.body,
    query: existingRequest.query,
  };
};
