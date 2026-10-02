import z from 'zod';

export const urlSchema = z.url();

export const idSchema = z.uuid();
