import type { Request, Response } from 'express';
import { replayService } from '../service/replay.service';
import { urlSchema, idSchema } from '../schemas/replay.schema';

export const setUpReplay = async (req: Request, res: Response) => {
  try {
    const validatedUrl = urlSchema.safeParse(req.body.url);
    const validatedId = idSchema.safeParse(req.params.id);

    if (!validatedUrl.success) {
      return res.status(400).json({
        error: 'Invalid url',
        details: validatedUrl.error.issues,
      });
    }

    if (!validatedId.success) {
      return res.status(400).json({ error: 'Invalid request ID' });
    }

    const url = validatedUrl.data;
    const id = validatedId.data;

    const result = await replayService(id, url);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Replay failed' });
  }
};
