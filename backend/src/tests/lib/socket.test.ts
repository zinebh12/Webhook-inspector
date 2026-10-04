import { createServer } from 'node:http';
import { type AddressInfo } from 'node:net';
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client';
import { Server, type Socket as ServerSocket } from 'socket.io';
import { describe, it, expect, afterEach, beforeAll, afterAll, jest } from '@jest/globals';
import { initSocket } from '../../lib/socket';

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe('my awesome project', () => {
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = initSocket(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  it('connects successfully', () => {
    expect(clientSocket.connected).toBe(true);
  });

  it('subscribes', async () => {
    clientSocket.emit('subscribe', 'endpoint-A');

    await waitFor(serverSocket, 'subscribe');

    const received = waitFor(clientSocket, 'test-event');
    io.to('endpoint-A').emit('test-event', 'hello-A');

    expect(await received).toBe('hello-A');
  });

  it('removes client when unsubscribing', async () => {
    clientSocket.emit('subscribe', 'endpoint-A');
    await waitFor(serverSocket, 'subscribe');

    clientSocket.emit('unsubscribe', 'endpoint-A');
    await waitFor(serverSocket, 'unsubscribe');

    let received = false;

    clientSocket.once('test-event', () => {
      received = true;
    });

    io.to('endpoint-A').emit('test-event', 'should not arrive');
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(received).toBe(false);
  });

  it('avoids leaks between rooms', async () => {
    clientSocket.emit('subscribe', 'endpoint-A');

    await waitFor(serverSocket, 'subscribe');

    let received = false;

    clientSocket.once('test-event', () => {
      received = true;
    });

    io.to('endpoint-B').emit('test-event', 'not for you');
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(received).toBe(false);
  });
});

describe('getIo()', () => {
  afterEach(() => {
    jest.resetModules();
  });
  it('throws if called before initSocket', async () => {
    jest.resetModules();
    const { getIo } = await import('../../lib/socket');
    expect(() => getIo()).toThrow('Socket.io not initialized. Call initSocket() first.');
  });
});
