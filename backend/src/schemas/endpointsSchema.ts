import z from 'zod';

export const createEndpointSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});