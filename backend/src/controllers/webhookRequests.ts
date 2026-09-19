import type { authRequest } from '../types/auth';
import type { Request, Response } from 'express';
import { db } from '../prisma/db';

export const createRequest = async (req: Request, res: Response) => {
  try {    
    const slug = req.params.slug;
    
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        error: 'Invalid endpoint ID',
      });
    }
    const endpoint = await db.orm.public.WebhookEndpoint.where({ url: slug }).first();

    if (!endpoint) {
      return res.status(404).json({ error: 'No endpoint found.' });
    }
    if (!endpoint.isActive) {
      return res.status(401).json({ error: 'Endpoint is not active.' });
    }

    await db.orm.public.WebhookRequest.create({
      method: req.method,
      headers: JSON.parse(JSON.stringify(req.headers)),
      body: req.body ?? null,
      query: JSON.parse(JSON.stringify(req.query)),
      ip: req.ip,
      statusCode: 200,
      endpointId: endpoint.id,
    });

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
