import { registerSchema, loginSchema } from '../schemas/auth.schema';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { db } from '../prisma/db';
import type { authRequest } from '../types/express';
export const registerAuth = async (req: authRequest, res: Response) => {
  try {
    const validatedData = registerSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validatedData.error.issues,
      });
    }
    const { email, password } = validatedData.data;
    const existingUser = await db.orm.public.User.where({ email }).first();
    if (existingUser?.email) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }
    const passwordHash = await argon2.hash(password);
    await db.orm.public.User.create({
      email,
      password: passwordHash,
    });
    return res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Failed to register user',
    });
  }
};

export const loginAuth = async (req: authRequest, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  try {
    const validatedData = loginSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validatedData.error.issues,
      });
    }
    const { email, password } = validatedData.data;
    const user = await db.orm.public.User.where({ email }).first();
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }
    const passwordMatches = await argon2.verify(user?.password, password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: 'Login successful!',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

export const getCurrentUser = async (req: authRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await db.orm.public.User.where({ id: req.userId }).first();
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    return res.json({ id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get current user' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });
  return res.json({
    message: 'Log out successful!',
  });
};
