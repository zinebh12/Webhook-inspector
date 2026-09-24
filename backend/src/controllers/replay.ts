import type { Request, Response } from 'express';
import { replayService } from '../service/replayService';
import { replaySchema } from '../schemas/replaySchema';

export const setUpReplay = async (req: Request, res: Response) => {
  try {
    const validatedQuery = replaySchema.safeParse(req.query);
    if (!validatedQuery.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validatedQuery.error.issues,
      });
    }
    const { url } = validatedQuery.data;
    const id = req.params.id;

    if (id && typeof id !== 'string') {
      return res.status(400).json({
        error: 'Invalid request ID',
      });
    }

    const result = await replayService(id, url);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Replay failed' });
  }
};
