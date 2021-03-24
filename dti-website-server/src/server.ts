import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';
import path from 'path';

// Constants and configurations
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8000;

router.use(express.static(path.join(__dirname, '../../dti-website/out/')));

app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../template/index.html')));
app.use('/.netlify/functions/server', router);

export const handler = serverless(app);
