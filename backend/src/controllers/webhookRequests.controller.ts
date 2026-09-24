import type { authRequest } from '../types/express';
import type { Request, Response } from 'express';
import { db } from '../prisma/db';
import { requestQuerySchema } from '../schemas/requests.schema';
import { getIo } from '../lib/socket';
import { sanitizeHeaders } from '../helpers/removeHeaders';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        error: 'Invalid endpoint ID',
      });
    }
    const endpoint = await db.orm.public.WebhookEndpoint.where({ slug }).first();

    if (!endpoint) {
      return res.status(404).json({ error: 'No endpoint found.' });
    }
    if (!endpoint.isActive) {
      return res.status(401).json({ error: 'Endpoint is not active.' });
    }

    const newRequest = await db.orm.public.WebhookRequest.create({
      method: req.method,
      headers: sanitizeHeaders(JSON.parse(JSON.stringify(req.headers))),
      body: req.body ?? null,
      query: JSON.parse(JSON.stringify(req.query)),
      ip: req.ip,
      statusCode: 200,
      endpointId: endpoint.id,
    });
    
    getIo().to(endpoint.id).emit('newRequest', newRequest);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getRequests = async (req: authRequest, res: Response) => {
  try {
    const validatedQuery = requestQuerySchema.safeParse(req.query);
    if (!validatedQuery.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validatedQuery.error.issues,
      });
    }
    const id = req.params.id;
    const userId = req.userId;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Invalid endpoint ID',
      });
    }
    const { method, search, page, limit, from, to } = validatedQuery.data;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const endpoint = await db.orm.public.WebhookEndpoint.where({
      id,
      userId,
    }).first();

    if (!endpoint) {
      return res.status(404).json({ error: 'No endpoint found.' });
    }

    const offset = (page - 1) * limit;

    const whereConditions: {
      endpointId: string;
      method?: string;
      receivedAt?: { gte?: Date; lte?: Date };
    } = {
      endpointId: endpoint.id,
    };

    if (typeof method === 'string' && method.length > 0) {
      whereConditions.method = method;
    }

    const receivedAt: { gte?: Date; lte?: Date } = {};

    if (from) {
      receivedAt.gte = from;
    }

    if (to) {
      receivedAt.lte = to;
    }

    if (Object.keys(receivedAt).length > 0) {
      whereConditions.receivedAt = receivedAt;
    }

    const hasSearch = typeof search === 'string' && search.length > 0;

    let endpointRequests;
    let total: number;

    if (hasSearch) {
      const allMatches = await db.orm.public.WebhookRequest.where(whereConditions)
        .orderBy((r) => r.receivedAt.desc())
        .all();

      const filtered = allMatches.filter((r) =>
        JSON.stringify(r.body).toLowerCase().includes(search.toLowerCase()),
      );

      total = filtered.length;
      endpointRequests = filtered.slice(offset, offset + limit);
    } else {
      endpointRequests = await db.orm.public.WebhookRequest.where(whereConditions)
        .orderBy((r) => r.receivedAt.desc())
        .limit(limit)
        .offset(offset)
        .all();

      total = (await db.orm.public.WebhookRequest.where(whereConditions).all()).length;
    }

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      data: endpointRequests,
      page,
      total,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error getting requests' });
  }
};

export const getSingleRequest = async (req: authRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Invalid endpoint ID',
      });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const webhookRequest = await db.orm.public.WebhookRequest.where({ id })
      .include('endpoint')
      .first();

    if (!webhookRequest || webhookRequest.endpoint.userId !== req.userId) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    return res.status(200).json(webhookRequest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error getting request' });
  }
};

export const deleteRequest = async (req: authRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Invalid endpoint ID',
      });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const webhookRequest = await db.orm.public.WebhookRequest.where({ id })
      .include('endpoint')
      .first();

    if (!webhookRequest || webhookRequest.endpoint.userId !== req.userId) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    await db.orm.public.WebhookRequest.where({ id }).delete();

    return res.status(200).json({ message: 'Successfully deleted request' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to delete Request',
    });
  }
};

export const clearRequests = async (req: authRequest, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Invalid endpoint ID',
      });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const endpoint = await db.orm.public.WebhookEndpoint.where({ id, userId }).first();

    if (!endpoint) {
      return res.status(404).json({ error: 'No endpoint found.' });
    }

    const deletedRequests = await db.orm.public.WebhookRequest.where({
      endpointId: endpoint.id,
    }).deleteAndCount();

    return res.status(200).json({ message: `cleared ${deletedRequests} requests` });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to delete Requests',
    });
  }
};
