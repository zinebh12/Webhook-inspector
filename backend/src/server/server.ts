import { createServer } from 'node:http';
import app from './app';
import { initSocket } from '../lib/socket';

const port = 3001;

const server = createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
