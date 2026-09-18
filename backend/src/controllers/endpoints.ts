// POST   /endpoints               → create a new WebhookEndpoint (generates unique `url`)
// GET    /endpoints               → list all endpoints for logged-in user
// GET    /endpoints/:id           → get one endpoint's details
// PATCH  /endpoints/:id           → update name
// DELETE /endpoints/:id           → delete endpoint (cascades to its requests)
import type { Response } from 'express';
import type { authRequest } from '../types/auth';
import { db } from '../prisma/db';
import { createEndpointSchema } from '../schemas/endpointsSchema';
import { generateWebhookSlug, buildWebhookUrl } from '../helpers/generateWebhookSlug';
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
        error: 'User not found',
      });
    }
    const endpoint = await db.orm.public.WebhookEndpoint.create({
      name: name,
      url: slug,
      userId: userId,
    });
    return res.status(201).json({
      endpoint,
      fullUrl: buildWebhookUrl(endpoint.url),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating new Endpoint' });
  }
};
