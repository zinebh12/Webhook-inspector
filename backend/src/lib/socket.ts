import { Server } from 'socket.io';
import type { Server as HttpServer } from 'node:http';

let io: Server | null = null;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server);
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
  return io;
};

export const getIo = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket() first.');
  }
  return io;
};
