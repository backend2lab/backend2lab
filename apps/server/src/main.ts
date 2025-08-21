import express, { Request, Response } from 'express';

const host: string = process.env.HOST ?? 'localhost';
const port: number = process.env.PORT ? Number(process.env.PORT) : 54300;

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Hello World endpoint
app.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ message: 'Hello, World!' });
});

app.listen(port, host, () => {
  console.log(`Backend2Lab Server running at http://${host}:${port}`);
});
