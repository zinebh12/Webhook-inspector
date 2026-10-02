import type { authRequest } from '../../types/express';
import type { Response, NextFunction } from 'express';
import request from 'supertest';
import { describe, it, expect, jest } from '@jest/globals';
import { db } from '../../prisma/db';
import app from '../../server/app';

//mock middleware
jest.mock('../../middleware/authMiddleware', () => ({
  authMiddleware: (req: authRequest, res: Response, next: NextFunction) => {
    req.userId = 'user-1';
    next();
  },
}));

//mock db
jest.mock('../../prisma/db', () => ({
  db: {
    orm: {
      public: {
        User: {
          create: jest.fn(),
          where: jest.fn(),
        },
      },
    },
  },
}));

const mockCreate = jest.spyOn(db.orm.public.User, 'create');

const mockGet = jest.spyOn(db.orm.public.User, 'where');

describe('register auth', () => {
  it('returns 400 if register data is invalid', async () => {
    const mockData = {
      email: 'invalid email',
      password: 'invalid password',
    };

    const response = await request(app).post('/api/auth/register').send(mockData);
    expect(400);

    expect(response.body.error).toEqual('Validation failed');
  });

  it('returns 400 if email already exists', async () => {
    const mockData = {
      email: 'test@gmail.com',
      password: '@Password123',
    };

    mockGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof mockData>>().mockResolvedValue(mockData),
    } as unknown as ReturnType<typeof db.orm.public.User.where>);

    const response = await request(app).post('/api/auth/register').send(mockData);
    expect(400);

    expect(response.body.error).toEqual('User already exists');
  });

  it('returns 201 if user successfully registered', async () => {
    const mockData = {
      email: 'test@gmail.com',
      password: '@Password123',
    };
    mockGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.User.where>);

    mockCreate.mockResolvedValue({
      id: 'bc046aa3-f949-408c-bd7f-f77ad214eb99',
      email: mockData.email,
    } as unknown as Awaited<ReturnType<typeof db.orm.public.User.create>>);

    const response = await request(app).post('/api/auth/register').send(mockData);
    expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  it('catches errors and returns 500', async () => {
    const mockData = {
      email: 'test@gmail.com',
      password: '@Password123',
    };

    mockGet.mockReturnValueOnce({
      first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.User.where>);

    mockCreate.mockRejectedValue(new Error('Failed to register user'));

    const response = await request(app).post('/api/auth/register').send(mockData).expect(500);

    expect(response.status).toBe(500);
    expect(response.body.error).toEqual('Failed to register user');
  });
});
