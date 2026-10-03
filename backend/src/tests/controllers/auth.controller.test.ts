process.env.JWT_SECRET = 'test-secret';

jest.mock('argon2', () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    verify: jest.fn(),
  },
}));

import type { authRequest } from '../../types/express';
import type { Response, NextFunction } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { db } from '../../prisma/db';
import app from '../../server/app';
import argon2 from 'argon2';

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

const argon = jest.mocked(argon2.verify);
const argonHash = jest.mocked(argon2.hash);

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

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

    argonHash.mockResolvedValue('hashed-password');

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

describe('login auth', () => {
  it('returns 500 if JWT_SECRET is not configured', async () => {
    delete process.env.JWT_SECRET;
    const mockData = {
      email: 'test@test.com',
      password: 'hashed-password',
    };
    mockGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof mockData>>().mockResolvedValue(mockData),
    } as unknown as ReturnType<typeof db.orm.public.User.where>);
    const response = await request(app).post('/api/auth/login').send(mockData);

    expect(response.status).toBe(500);
    expect(response.body.error).toEqual('Failed to login');
  });

  it('returns 400 for a failed login schema', async () => {
    const mockData = {
      email: 'invalid-email',
      password: '123',
    };

    const response = await request(app).post('/api/auth/login').send(mockData);

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual('Validation failed');
  });

  it('returns 401 if email does not exist', async () => {
    mockGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof undefined>>().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof db.orm.public.User.where>);

    const response = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: '@Password123',
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual('Invalid email or password');
  });

  it('returns 401 if password is invalid', async () => {
    const mockData = {
      email: 'test@gmail.com',
      password: 'hashed-password',
    };

    mockGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof mockData>>().mockResolvedValue(mockData),
    } as unknown as ReturnType<typeof db.orm.public.User.where>);

    argon.mockResolvedValue(false);

    const response = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'wrong-password',
    });

    expect(argon).toHaveBeenCalledWith('hashed-password', 'wrong-password');

    expect(response.status).toBe(401);
    expect(response.body.error).toEqual('Invalid email or password');
  });

  it('successfully logs the user in', async () => {
    const mockData = {
      id: '59432-3335y4f4h3f2t-4f423234h-65433v2',
      email: 'test@gmail.com',
      password: 'hashed-password',
    };

    mockGet.mockReturnValue({
      first: jest.fn<() => Promise<typeof mockData>>().mockResolvedValue(mockData),
    } as unknown as ReturnType<typeof db.orm.public.User.where>);

    argon.mockResolvedValue(true);

    const response = await request(app).post('/api/auth/login').send(mockData);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: 'Login successful!',
      user: {
        id: mockData.id,
        email: mockData.email,
      },
    });

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('token=');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(response.headers['set-cookie'][0]).toContain('Secure');
    expect(response.headers['set-cookie'][0]).toContain('SameSite=Lax');
  });

  it('catches errors and returns 500', async () => {
    const mockData = {
      id: '59432-3335y4f4h3f2t-4f423234h-65433v2',
      email: 'test@gmail.com',
      password: 'hashed-password',
    };

    mockGet.mockReturnValue({
      first: jest
        .fn<() => Promise<typeof undefined>>()
        .mockRejectedValue(new Error('Failed to login')),
    } as unknown as ReturnType<typeof db.orm.public.User.where>);

    argon.mockResolvedValue(true);

    const response = await request(app).post('/api/auth/login').send(mockData);

    expect(response.status).toBe(500);

    expect(response.body.error).toEqual('Failed to login');
  });
});
