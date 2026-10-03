import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authRequest } from '../types/express';

export const authMiddleware = (request: authRequest, response: Response, next: NextFunction) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return response.status(401).json({ error: 'JWT_SECRET is not set' });
    }
    const token = request.cookies.token;
    if (!token) {
      return response.status(401).json({ error: 'Not authenticated' });
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
