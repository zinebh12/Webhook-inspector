import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import authRoute from './../routes/authRoute';
import endpointRoutes from './../routes/endpointRoutes';
import webhookRequestsRoutes from './../routes/webhookRequestsRoutes';
import webhookReceiverRoute from '../routes/webhookReceiverRoute';

dotenv.config();
const app: Express = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/webhook/endpoints', endpointRoutes);
app.use('/api/webhook/request', webhookRequestsRoutes);
app.use('/webhook', webhookReceiverRoute);

//health check!
app.get('/api/health', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// socket io check!
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('subscribe', (endpointId: string) => {
    socket.join(endpointId);
    console.log(`Socket ${socket.id} subscribed to endpoint ${endpointId}`);
  });

  socket.on('unsubscribe', (endpointId: string) => {
    socket.leave(endpointId);
    console.log(`Socket ${socket.id} unsubscribed from endpoint ${endpointId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
