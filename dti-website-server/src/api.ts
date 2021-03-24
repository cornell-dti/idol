import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';
import path from 'path';

// Constants and configurations
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '../../dti-website/out/index.html')));
app.use('/.netlify/functions/api', router);

export const handler = serverless(app);
