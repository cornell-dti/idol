import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import { env } from './firebase';
import { siteIntegrationRouter } from './API/siteIntegrationAPI';
import { sendMail } from './API/mailAPI';
import MembersDao from './dao/MembersDao';
import { memberRouter, memberDiffRouter, getMember } from './API/memberAPI';
import { memberImageRouter } from './API/imageAPI';
import { teamRouter } from './API/teamAPI';
import { shoutoutRouter } from './API/shoutoutAPI';
import { signInRouter } from './API/signInFormAPI';
import { teamEventRouter } from './API/teamEventsAPI';
import { candidateDeciderRouter } from './API/candidateDeciderAPI';
import { eventProofImageRouter } from './API/teamEventsImageAPI';
import {
  getAllDevPortfolios,
  createNewDevPortfolio,
  deleteDevPortfolio,
  makeDevPortfolioSubmission,
  getDevPortfolio,
  getAllDevPortfolioInfo,
  getDevPortfolioInfo,
  getUsersDevPortfolioSubmissions,
  regradeSubmissions,
  updateSubmissions
} from './API/devPortfolioAPI';
import DPSubmissionRequestLogDao from './dao/DPSubmissionRequestLogDao';
import AdminsDao from './dao/AdminsDao';

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
router.use('/event-proof-image'); // TODO: have to update frontend endpoints
router.use('/candidate-decider', candidateDeciderRouter);

// Dev Portfolios
loginCheckedGet('/dev-portfolio', async (req, user) => ({
  portfolios: !req.query.meta_only
    ? await getAllDevPortfolios(user)
    : await getAllDevPortfolioInfo()
}));
loginCheckedGet('/dev-portfolio/:uuid', async (req, user) => ({
  portfolioInfo: !req.query.meta_only
    ? await getDevPortfolio(req.params.uuid, user)
    : await getDevPortfolioInfo(req.params.uuid)
}));
loginCheckedGet('/dev-portfolio/:uuid/submission/:email', async (req, user) => ({
  submissions: await getUsersDevPortfolioSubmissions(req.params.uuid, user)
}));
loginCheckedPost('/dev-portfolio', async (req, user) => ({
  portfolio: await createNewDevPortfolio(req.body, user)
}));
loginCheckedDelete('/dev-portfolio/:uuid', async (req, user) =>
  deleteDevPortfolio(req.params.uuid, user).then(() => ({}))
);
loginCheckedPost('/dev-portfolio/submission', async (req, user) => {
  await DPSubmissionRequestLogDao.logRequest(user.email, req.body.uuid, req.body.submission);
  return {
    submission: await makeDevPortfolioSubmission(req.body.uuid, req.body.submission)
  };
});
loginCheckedPut('/dev-portfolio/submission', async (req, user) => ({
  portfolio: await regradeSubmissions(req.body.uuid, user)
}));
loginCheckedPut('/dev-portfolio/submission/:uuid', async (req, user) => ({
  portfolio: await updateSubmissions(req.params.uuid, req.body.updatedSubmissions, user)
}));

app.use('/.netlify/functions/api', router);

// Startup local server if not production (prod is serverless)
if (!isProd) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`IDOL backend listening on port: ${PORT}`);
  });
}

export const handler = serverless(app);
