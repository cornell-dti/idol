import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';
import path from 'path';
import { exec } from 'child_process';

// Constants and configurations
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8000;

router.get('/', (req: Request, res: Response) => {
  console.log("Connection made!");
  // Check whether to update?
  exec('pwd && cd ../../dti-website && yarn run pull-from-idol', (err, stdout, stderr) => {
    console.log(err, stdout, stderr);
  });
  res.send('');
});

app.use('/.netlify/functions/server', router);

export const handler = serverless(app);
