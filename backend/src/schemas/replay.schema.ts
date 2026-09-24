import z from 'zod';

export const replaySchema = z.object({
  url: z.url(),
});
