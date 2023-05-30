import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import { env } from './firebase';
import AdminsDao from './dao/AdminsDao';
import { getMember } from './API/memberAPI';
import teamRouter from './routers/teamRouter';
import candidateDeciderRouter from './routers/candidateDeciderRouter';
import devPortfolioRouter from './routers/devPortfolioRouter';
import memberImageRouter from './routers/imageRouter';
import { memberRouter, memberDiffRouter } from './routers/memberRouter';
import shoutoutRouter from './routers/shoutoutRouter';
import signInRouter from './routers/signInRouter';
import siteIntegrationRouter from './routers/siteIntegrationRouter';
import teamEventRouter from './routers/teamEventRouter';
import eventProofImageRouter from './routers/teamEventsImageRouter';

// Constants and configurations
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 9000;
const allowAllOrigins = false;
export const isProd: boolean = env === 'staging' || env === 'prod';

export const enforceSession = true;
// eslint-disable-next-line no-nested-ternary
const allowedOrigins = allowAllOrigins
  ? [/.*/]
  : isProd
  ? [/https:\/\/idol\.cornelldti\.org/, /.*--cornelldti-idol\.netlify\.app/]
  : [/http:\/\/localhost:3000/];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: '50mb' }));

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(
        (info) =>
          `${info.timestamp} ${info.level} - ${info.meta.req.method} ${info.meta.req.originalUrl} ${
            info.meta.res.statusCode
          } -- ${JSON.stringify(info.meta.req.body)}`
      )
    ),
    requestWhitelist: ['body', 'method', 'originalUrl'],
    responseWhitelist: ['body', 'statusCode']
  })
);

// Members
router.get('/hasIDOLAccess/:email', async (req, res) => {
  const member = await getMember(req.params.email);
  const adminEmails = await AdminsDao.getAllAdminEmails();

  if (env === 'staging' && !adminEmails.includes(req.params.email)) {
    res.status(200).json({ hasIDOLAccess: false });
  }
  res.status(200).json({
    hasIDOLAccess: member !== undefined
  });
});

router.use('/member', memberRouter);
router.use('/memberDiffs', memberDiffRouter);
router.use('/team', teamRouter);
router.use('/memberImage', memberImageRouter);
router.use('/shoutout', shoutoutRouter);
router.use('/', siteIntegrationRouter);
router.use('/', signInRouter);
router.use('/team-event', teamEventRouter);
router.use('/event-proof-image', eventProofImageRouter);
router.use('/candidate-decider', candidateDeciderRouter);
router.use('/dev-portfolio', devPortfolioRouter);

// Dev Portfolios

app.use('/.netlify/functions/api', router);

// Startup local server if not production (prod is serverless)
if (!isProd) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`IDOL backend listening on port: ${PORT}`);
  });
}

export const handler = serverless(app);
