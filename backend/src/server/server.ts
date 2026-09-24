import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { initSocket } from '../lib/socket';
import authRoute from '../routes/auth.route';
import endpointRoutes from '../routes/endpoint.route';
import webhookRequestsRoutes from '../routes/webhookRequests.route';
import webhookReceiverRoute from '../routes/webhookReceiver.route';
import replayRoute from '../routes/replay.route';

dotenv.config();
const app: Express = express();
const port = 3000;

const server = createServer(app);
initSocket(server);

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/webhook/endpoints', endpointRoutes);
app.use('/api/webhook/request', webhookRequestsRoutes);
app.use('/webhook', webhookReceiverRoute);
app.use('/webhook', replayRoute);

//health check!
app.get('/api/health', (req: Request, res: Response) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
