import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authRequest } from '../types/auth';

export const authMiddleware = (request: authRequest, response: Response, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  try {
    const token = request.cookies.token;
    if (!token) {
      response.status(401).json({ error: 'Not authenticated' });
    }
    const decode = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };
    request.userId = decode.userId;
    next();
  } catch {
    return response.status(401).json({ error: 'Invalid or expired token' });
  }
};
