import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';

// Constants and configurations
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8000;

router.get('/', (req: Request, res: Response) => {
  console.log("Ping!");
  res.send('Pong!');
});

app.use('/.netlify/functions/server', router);

export const handler = serverless(app);
