import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import admin from 'firebase-admin';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import { app as adminApp, env } from './firebase';
import PermissionsManager from './utils/permissionsManager';
import { HandlerError } from './utils/errors';
import {
  acceptIDOLChanges,
  getIDOLChangesPR,
  rejectIDOLChanges,
  requestIDOLPullDispatch
} from './API/siteIntegrationAPI';
import { sendMail } from './API/mailAPI';
import MembersDao from './dao/MembersDao';
import {
  allMembers,
  allApprovedMembers,
  setMember,
  deleteMember,
  updateMember,
  getUserInformationDifference,
  reviewUserInformationChange,
  getMember
} from './API/memberAPI';
import { getMemberImage, setMemberImage, allMemberImages } from './API/imageAPI';
import { allTeams, setTeam, deleteTeam } from './API/teamAPI';
import {
  getAllShoutouts,
  getShoutouts,
  giveShoutout,
  hideShoutout,
  deleteShoutout
} from './API/shoutoutAPI';
import {
  allSignInForms,
  createSignInForm,
  deleteSignInForm,
  signIn,
  signInFormExists,
  signInFormExpired,
  getSignInPrompt
} from './API/signInFormAPI';
import {
  createTeamEvent,
  deleteTeamEvent,
  getAllTeamEventInfo,
  getAllTeamEvents,
  getTeamEvent,
  updateTeamEvent,
  clearAllTeamEvents,
  requestTeamEventCredit,
  getAllTeamEventsForMember
} from './API/teamEventsAPI';
import {
  getAllCandidateDeciderInstances,
  createNewCandidateDeciderInstance,
  toggleCandidateDeciderInstance,
  deleteCandidateDeciderInstance,
  getCandidateDeciderInstance,
  updateCandidateDeciderRating,
  updateCandidateDeciderComment
} from './API/candidateDeciderAPI';
import {
  deleteEventProofImage,
  getEventProofImage,
  setEventProofImage
} from './API/teamEventsImageAPI';
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

const getUserEmailFromRequest = async (request: Request): Promise<string | undefined> => {
  const idToken = request.headers['auth-token'];
  if (typeof idToken !== 'string') return undefined;
  const decodedToken = await admin.auth(adminApp).verifyIdToken(idToken);
  return decodedToken.email;
};

const loginCheckedHandler =
  (handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>): RequestHandler =>
  async (req: Request, res: Response): Promise<void> => {
    const userEmail = await getUserEmailFromRequest(req);
    if (userEmail == null) {
      res.status(440).json({ error: 'Not logged in!' });
      return;
    }
    const user = await MembersDao.getCurrentOrPastMemberByEmail(userEmail);
    if (!user) {
      res.status(401).send({ error: `No user with email: ${userEmail}` });
      return;
    }
    if (env === 'staging' && !(await PermissionsManager.isAdmin(user))) {
      res.status(401).json({ error: 'Only admins users have permismsions to the staging API!' });
    }
    try {
      res.status(200).send(await handler(req, user));
    } catch (error) {
      if (error instanceof HandlerError) {
        res.status(error.errorCode).send({ error: error.reason });
        return;
      }
      res.status(500).send({ error: `Failed to handle the request due to ${error}.` });
    }
  };

const loginCheckedGet = (
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
) => router.get(path, loginCheckedHandler(handler));

const loginCheckedPost = (
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
) => router.post(path, loginCheckedHandler(handler));

const loginCheckedDelete = (
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
) => router.delete(path, loginCheckedHandler(handler));

// Members
router.get('/allMembers', async (_, res) => {
  const members = await allMembers();
  res.status(200).json({ members });
});
router.get('/allApprovedMembers', async (_, res) => {
  const members = await allApprovedMembers();
  res.status(200).json({ members });
});
router.get('/membersFromAllSemesters', async (_, res) => {
  res.status(200).json(await MembersDao.getMembersFromAllSemesters());
});
router.get('/hasIDOLAccess/:email', async (req, res) => {
  const members = await allMembers();
  const adminEmails = await AdminsDao.getAllAdminEmails();

  if (env === 'staging' && !adminEmails.includes(req.params.email)) {
    res.status(200).json({ hasIDOLAccess: false });
  }
  res.status(200).json({
    hasIDOLAccess: members.find((member) => member.email === req.params.email) !== undefined

  });
});

router.get('/info', async (req, res) => {
  res.json({
    isProd,
    hostname: req.hostname
  });
});

loginCheckedPost('/setMember', async (req, user) => ({
  member: await setMember(req.body, user)
}));
loginCheckedDelete('/deleteMember/:email', async (req, user) => {
  await deleteMember(req.params.email, user);
  return {};
});
loginCheckedPost('/updateMember', async (req, user) => ({
  member: await updateMember(req, req.body, user)
}));

loginCheckedGet('/memberDiffs', async (_, user) => ({
  diffs: await getUserInformationDifference(user)
}));
loginCheckedPost('/reviewMemberDiffs', async (req, user) => ({
  member: await reviewUserInformationChange(req.body.approved, req.body.rejected, user)
}));

// Teams
loginCheckedGet('/allTeams', async () => ({ teams: await allTeams() }));
loginCheckedPost('/setTeam', async (req, user) => ({
  team: await setTeam(req.body, user)
}));
loginCheckedPost('/deleteTeam', async (req, user) => ({
  team: await deleteTeam(req.body, user)
}));

// Images
loginCheckedGet('/getMemberImage', async (_, user) => ({
  url: await getMemberImage(user)
}));
loginCheckedGet('/getImageSignedURL', async (_, user) => ({
  url: await setMemberImage(user)
}));
router.get('/allMemberImages', async (_, res) => {
  const images = await allMemberImages();
  res.status(200).json({ images });
});

// Shoutouts
loginCheckedGet('/getShoutouts/:email/:type', async (req, user) => ({
  shoutouts: await getShoutouts(req.params.email, req.params.type as 'given' | 'received', user)
}));

loginCheckedGet('/allShoutouts', async () => ({
  shoutouts: await getAllShoutouts()
}));

loginCheckedPost('/giveShoutout', async (req, user) => ({
  shoutout: await giveShoutout(req.body, user)
}));

loginCheckedPost('/hideShoutout', async (req, user) => {
  await hideShoutout(req.body.uuid, req.body.hide, user);
  return {};
});

loginCheckedPost('/deleteShoutout', async (req, user) => {
  await deleteShoutout(req.body.uuid, user);
  return {};
});

// Permissions
loginCheckedGet('/isAdmin', async (_, user) => ({
  isAdmin: await PermissionsManager.isAdmin(user)
}));

// Pull from IDOL
loginCheckedPost('/pullIDOLChanges', (_, user) => requestIDOLPullDispatch(user));
loginCheckedGet('/getIDOLChangesPR', (_, user) => getIDOLChangesPR(user));
loginCheckedPost('/acceptIDOLChanges', (_, user) => acceptIDOLChanges(user));
loginCheckedPost('/rejectIDOLChanges', (_, user) => rejectIDOLChanges(user));

// Sign In Form
loginCheckedPost('/signInExists', async (req, _) => ({
  exists: await signInFormExists(req.body.id)
}));
loginCheckedPost('/signInExpired', async (req, _) => ({
  expired: await signInFormExpired(req.body.id)
}));
loginCheckedPost('/signInCreate', async (req, user) =>
  createSignInForm(req.body.id, req.body.expireAt, req.body.prompt, user)
);
loginCheckedPost('/signInDelete', async (req, user) => {
  await deleteSignInForm(req.body.id, user);
  return {};
});
loginCheckedPost('/signIn', async (req, user) => signIn(req.body.id, req.body.response, user));
loginCheckedPost('/signInAll', async (_, user) => allSignInForms(user));
loginCheckedGet('/signInPrompt/:id', async (req, _) => ({
  prompt: await getSignInPrompt(req.params.id)
}));

// Team Events
loginCheckedPost('/createTeamEvent', async (req, user) => {
  await createTeamEvent(req.body, user);
  return {};
});
loginCheckedGet('/getTeamEvent/:uuid', async (req, user) => ({
  event: await getTeamEvent(req.params.uuid, user)
}));
loginCheckedGet('/getAllTeamEvents', async (_, user) => ({ events: await getAllTeamEvents(user) }));
loginCheckedPost('/updateTeamEvent', async (req, user) => ({
  event: await updateTeamEvent(req.body, user)
}));
loginCheckedPost('/deleteTeamEvent', async (req, user) => {
  await deleteTeamEvent(req.body, user);
  return {};
});
loginCheckedDelete('/clearAllTeamEvents', async (_, user) => {
  await clearAllTeamEvents(user);
  return {};
});
loginCheckedGet('/getAllTeamEventInfo', async () => ({
  allTeamEventInfo: await getAllTeamEventInfo()
}));
loginCheckedPost('/requestTeamEventCredit', async (req, _) => {
  await requestTeamEventCredit(req.body.uuid, req.body.request);
  return {};
});
loginCheckedGet('/getAllTeamEventsForMember', async (_, user) => ({
  pending: await getAllTeamEventsForMember(user.email, true),
  approved: await getAllTeamEventsForMember(user.email, false)
}));

// Team Events Proof Image
loginCheckedGet('/getEventProofImage/:name(*)', async (req, user) => ({
  url: await getEventProofImage(req.params.name, user)
}));
loginCheckedGet('/getEventProofImageSignedURL/:name(*)', async (req, user) => ({
  url: await setEventProofImage(req.params.name, user)
}));
loginCheckedPost('/deleteEventProofImage', async (req, user) => {
  await deleteEventProofImage(req.body.name, user);
  return {};
});

// Candidate Decider
loginCheckedGet('/getAllCandidateDeciderInstances', async (_, user) => ({
  instances: await getAllCandidateDeciderInstances(user)
}));
loginCheckedGet('/getCandidateDeciderInstance/:uuid', async (req, user) => ({
  instance: await getCandidateDeciderInstance(req.params.uuid, user)
}));
loginCheckedPost('/createNewCandidateDeciderInstance', async (req, user) => ({
  instance: await createNewCandidateDeciderInstance(req.body, user)
}));
loginCheckedPost('/toggleCandidateDeciderInstance', async (req, user) =>
  toggleCandidateDeciderInstance(req.body.uuid, user).then(() => ({}))
);
loginCheckedPost('/deleteCandidateDeciderInstance', async (req, user) =>
  deleteCandidateDeciderInstance(req.body.uuid, user).then(() => ({}))
);
loginCheckedPost('/updateCandidateDeciderRating', (req, user) =>
  updateCandidateDeciderRating(user, req.body.uuid, req.body.id, req.body.rating).then(() => ({}))
);
loginCheckedPost('/updateCandidateDeciderComment', (req, user) =>
  updateCandidateDeciderComment(user, req.body.uuid, req.body.id, req.body.comment).then(() => ({}))
);
loginCheckedPost('/sendMail', async (req, user) => ({
  info: await sendMail(req.body.to, req.body.subject, req.body.text)
}));

// Dev Portfolios
loginCheckedGet('/getAllDevPortfolios', async (req, user) => ({
  portfolios: await getAllDevPortfolios(user)
}));
loginCheckedGet('/getAllDevPortfolioInfo', async (req, user) => ({
  portfolioInfo: await getAllDevPortfolioInfo()
}));
loginCheckedGet('/getDevPortfolioInfo/:uuid', async (req, user) => ({
  portfolioInfo: await getDevPortfolioInfo(req.params.uuid)
}));
loginCheckedGet('/getUsersDevPortfolioSubmissions/:uuid', async (req, user) => ({
  submissions: await getUsersDevPortfolioSubmissions(req.params.uuid, user)
}));
loginCheckedGet('/getDevPortfolio/:uuid', async (req, user) => ({
  portfolio: await getDevPortfolio(req.params.uuid, user)
}));
loginCheckedPost('/createNewDevPortfolio', async (req, user) => ({
  portfolio: await createNewDevPortfolio(req.body, user)
}));
loginCheckedPost('/deleteDevPortfolio', async (req, user) =>
  deleteDevPortfolio(req.body.uuid, user).then(() => ({}))
);
loginCheckedPost('/makeDevPortfolioSubmission', async (req, user) => {
  await DPSubmissionRequestLogDao.logRequest(user.email, req.body.uuid, req.body.submission);
  return {
    submission: await makeDevPortfolioSubmission(req.body.uuid, req.body.submission)
  };
});
loginCheckedPost('/regradeDevPortfolioSubmissions', async (req, user) => ({
  portfolio: await regradeSubmissions(req.body.uuid, user)
}));
loginCheckedPost('/updateDevPortfolioSubmissions', async (req, user) => ({
  portfolio: await updateSubmissions(req.body.uuid, req.body.updatedSubmissions, user)
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
