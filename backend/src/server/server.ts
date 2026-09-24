import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { initSocket } from '../lib/socket';
import authRoute from '../routes/auth.route';
import endpointRoutes from '../routes/endpoint.route';
import webhookRequestsRoutes from '../routes/webhookRequests.route';
import webhookReceiverRoute from '../routes/webhookReceiver.route';
import replayRoute from '../routes/replay.route';

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: { error: 'Too many requests, please try again later.' },
});

const replayLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: { error: 'Too many replay attempts, please try again later.' },
});

const app: Express = express();
const port = 3000;

const server = createServer(app);
initSocket(server);

app.set('trust proxy', true);

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

const allowedOrigins = [process.env.APP_URL, 'http://localhost:5173'].filter(Boolean);

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

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
