import z from 'zod';

export const replaySchema = z.object({
  url: z.string(),
});
