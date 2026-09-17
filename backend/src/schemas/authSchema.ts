import { z } from 'zod';
export const registerSchemma = z.object({
  email: z.email('Email is required.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export const loginSchema = z.object({
  email: z.email('Please enter a valid email adress'),
  password: z.string().min(1, 'Password is required'),
});
