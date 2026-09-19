import type { authRequest } from '../types/auth';
import type { Request, Response } from 'express';
import { db } from '../prisma/db';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const requests = {
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
      ip: req.ip,
      statusCode: 200,
    };
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
