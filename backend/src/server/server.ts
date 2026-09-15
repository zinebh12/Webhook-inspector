import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const port = 3000;

app.get("/api/health", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
