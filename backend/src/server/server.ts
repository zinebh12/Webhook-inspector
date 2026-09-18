import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './../routes/authRoute';
import endpointRoutes from './../routes/endpointRoutes';

dotenv.config();
const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoute);
app.use('/api/endpoint', endpointRoutes);

//health check!
app.get('/api/health', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
