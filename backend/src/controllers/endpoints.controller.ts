import type { Response } from 'express';
import type { authRequest } from '../types/express';
import { db } from '../prisma/db';
import { createEndpointSchema, updateEndpointSchema, idSchema } from '../schemas/endpoints.schema';
import { generateWebhookSlug, buildWebhookUrl } from '../helpers/generateWebhookSlug.helper';
export const createEndpoint = async (req: authRequest, res: Response) => {
  try {
    const validatedData = createEndpointSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validatedData.error.issues,
      });
    }
    const slug = generateWebhookSlug();
    const { name } = validatedData.data;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        error: 'Not authenticated',
      });
    }
    const endpoint = await db.orm.public.WebhookEndpoint.create({
      name: name,
      slug: slug,
      userId: userId,
    });
    return res.status(201).json({
      endpoint,
      fullUrl: buildWebhookUrl(endpoint.slug),
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Error creating new Endpoint' });
  }
};

export const getEndpoints = async (req: authRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const endpoint = await db.orm.public.WebhookEndpoint.where({ userId }).all();
    return res.status(200).json(endpoint);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Error fetching Endpoints' });
  }
};

export const getSingleEndpoint = async (req: authRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const id = idSchema.safeParse(req.params.id);

    if (!id.success) {
      return res.status(400).json({ error: 'Invalid endpoint ID format' });
    }

    const endpoint = await db.orm.public.WebhookEndpoint.where({
      id: id.data,
      userId: req.userId,
    }).first();
    if (!endpoint) {
      return res.status(404).json({
        error: 'Endpoint not found',
      });
    }
    return res.status(200).json(endpoint);
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      error: 'Failed to fetch endpoint',
    });
  }
};

export const toggleEndpointActivity = async (req: authRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const validatedData = updateEndpointSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validatedData.error.issues,
      });
    }
    const { isActive } = validatedData.data;
    const userId = req.userId;
    const id = idSchema.safeParse(req.params.id);

    if (!id.success) {
      return res.status(400).json({ error: 'Invalid endpoint ID format' });
    }

    const toggleIsActive = await db.orm.public.WebhookEndpoint.where({
      id: id.data,
      userId: userId,
    }).update({
      isActive: isActive,
    });

    if (!toggleIsActive) {
      return res.status(404).json({
        error: 'Endpoint not found',
      });
    }

    return res.status(200).json(toggleIsActive);
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      error: 'Failed to update endpoint',
    });
  }
};

export const deleteEndpoint = async (req: authRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const id = idSchema.safeParse(req.params.id);

    if (!id.success) {
      return res.status(400).json({ error: 'Invalid endpoint ID format' });
    }

    const deleteEndpoint = await db.orm.public.WebhookEndpoint.where({
      id: id.data,
      userId: req.userId,
    }).delete();

    if (!deleteEndpoint) {
      return res.status(404).json({
        error: 'Endpoint not found',
      });
    }
    return res.status(204).send();
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      error: 'Failed to delete Endpoint',
    });
  }
};
