import type { authRequest } from '../types/auth';
import type { Request, Response } from 'express';
import { db } from '../prisma/db';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const requests = {
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
      ip: req.ip,
      statusCode: 200,
    };
    //handle inactive / invalide endpoints
    const slug = req.params.slug;
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        error: 'Invalid endpoint ID',
      });
    }
    const endpoint = await db.orm.public.WebhookEndpoint.where({ url: slug }).first();
    const inactiveEndpoint = await db.orm.public.WebhookEndpoint.where({ isActive: false }).first();
    if (!endpoint) {
      return res.status(404).json({ error: 'No endpoint found.' });
    }
    if (inactiveEndpoint) {
      return res.status(401).json({ error: 'Endpoint is not active.' });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
