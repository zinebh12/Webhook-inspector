import express, { NextFunction, type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from '../routes/auth.route';
import endpointRoutes from '../routes/endpoint.route';
import webhookRequestsRoutes from '../routes/webhookRequests.route';
import webhookReceiverRoute from '../routes/webhookReceiver.route';
import replayRoute from '../routes/replay.route';
import { limiter, replayLimiter } from '../middleware/rateLimiter.middleware';

dotenv.config();

const app: Express = express();
app.set('trust proxy', true);

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

const allowedOrigins = [process.env.APP_URL, 'http://localhost:3000'].filter(Boolean);

const setOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

app.use(
  cors({
    origin: setOrigin,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'PATCH', 'PUT', 'POST', 'DELETE'],
  }),
);

app.use(limiter);

app.use('/api/auth', authRoute);
app.use('/api/webhook/endpoints', endpointRoutes);
app.use('/api/webhook/request', webhookRequestsRoutes);
app.use('/webhook', webhookReceiverRoute);
app.use('/webhook', replayLimiter, replayRoute);

//health check!
app.get('/api/health', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error.message === 'Not allowed by CORS') {
    return response.status(403).json({ error: 'Not allowed by CORS' });
  }
  next(error);
});

export default app;
