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

export const getRequests = async (req: authRequest, res: Response) => {
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

    const endpoint = await db.orm.public.WebhookEndpoint.where({
      id,
      userId,
    }).first();

    if (!endpoint) {
      return res.status(404).json({ error: 'No endpoint found.' });
    }

    const endpointRequests = await db.orm.public.WebhookRequest.where({
      endpointId: endpoint.id,
    }).all();

    return res.status(200).json(endpointRequests);
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
