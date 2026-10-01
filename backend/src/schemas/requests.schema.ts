import z from 'zod';

export const requestQuerySchema = z.object({
  method: z.string().optional(),
  search: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const slugSchema = z.string();

export const idSchema = z.uuid();
