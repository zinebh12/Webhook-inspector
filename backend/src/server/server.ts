import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { db } from '../prisma/db';
import authRoute from './../routes/authRoute';

dotenv.config();
const app: Express = express();
const port = 3000;

app.use('/api/auth', authRoute);
//health check!
app.get('/api/health', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// get users
app.get('/api/user', (req: Request, res: Response) => {
  const result = db.sql.public.user.select('id', 'email').build();
  res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
