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
  getTeamEventAttendanceByUser,
  updateTeamEventAttendance,
  deleteTeamEventAttendance
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
import { sendMail } from './API/mailAPI';

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

const loginCheckedPut = (
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
) => router.put(path, loginCheckedHandler(handler));

// Members
router.get('/member', async (req, res) => {
  const type = req.query.type as string | undefined;
  let members;
  switch (type) {
    case 'all-semesters':
      members = await MembersDao.getMembersFromAllSemesters();
      break;
    case 'approved':
      members = await allApprovedMembers();
      break;
    default:
      members = await allMembers();
  }
  res.status(200).json({ members });
});
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

loginCheckedPost('/member', async (req, user) => ({
  member: await setMember(req.body, user)
}));
loginCheckedDelete('/member/:email', async (req, user) => {
  await deleteMember(req.params.email, user);
  return {};
});
loginCheckedPut('/member', async (req, user) => ({
  member: await updateMember(req, req.body, user)
}));

loginCheckedGet('/memberDiffs', async (_, user) => ({
  diffs: await getUserInformationDifference(user)
}));
loginCheckedPut('/memberDiffs', async (req, user) => ({
  member: await reviewUserInformationChange(req.body.approved, req.body.rejected, user)
}));

// Teams
loginCheckedGet('/team', async () => ({ teams: await allTeams() }));
loginCheckedPut('/team', async (req, user) => ({
  team: await setTeam(req.body, user)
}));
// should eventually make DELETE
loginCheckedPost('/team', async (req, user) => ({
  team: await deleteTeam(req.body, user)
}));

// Images
loginCheckedGet('/member-image/:email', async (_, user) => ({
  url: await getMemberImage(user)
}));
loginCheckedGet('/member-image-signedURL', async (_, user) => ({
  url: await setMemberImage(user)
}));
router.get('/member-image', async (_, res) => {
  const images = await allMemberImages();
  res.status(200).json({ images });
});

// Shoutouts
loginCheckedGet('/shoutout/:email', async (req, user) => ({
  shoutouts: await getShoutouts(req.params.email, req.query.type as 'given' | 'received', user)
}));

loginCheckedGet('/shoutout', async () => ({
  shoutouts: await getAllShoutouts()
}));

loginCheckedPost('/shoutout', async (req, user) => ({
  shoutout: await giveShoutout(req.body, user)
}));

loginCheckedPut('/shoutout', async (req, user) => {
  await hideShoutout(req.body.uuid, req.body.hide, user);
  return {};
});

loginCheckedDelete('/shoutout/:uuid', async (req, user) => {
  await deleteShoutout(req.params.uuid, user);
  return {};
});

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
loginCheckedPost('/team-event', async (req, user) => {
  await createTeamEvent(req.body, user);
  return {};
});
loginCheckedGet('/team-event/:uuid', async (req, user) => ({
  event: await getTeamEvent(req.params.uuid, user)
}));
loginCheckedGet('/team-event', async (req, user) => ({
  events: !req.query.meta_only ? await getAllTeamEvents(user) : await getAllTeamEventInfo()
}));
loginCheckedPut('/team-event', async (req, user) => ({
  event: await updateTeamEvent(req.body, user)
}));
loginCheckedDelete('/team-event/:uuid', async (req, user) => {
  await deleteTeamEvent(req.params.uuid, user);
  return {};
});
loginCheckedDelete('/team-event', async (_, user) => {
  await clearAllTeamEvents(user);
  return {};
});
loginCheckedPost('/team-event-attendance', async (req, user) => {
  await requestTeamEventCredit(req.body.request, user);
  return {};
});
loginCheckedGet('/team-event-attendance', async (_, user) => ({
  teamEventAttendance: await getTeamEventAttendanceByUser(user)
}));
loginCheckedPut('/team-event-attendance', async (req, user) => ({
  teamEventAttendance: await updateTeamEventAttendance(req.body, user)
}));
loginCheckedDelete('/team-event-attendance/:uuid', async (req, user) => {
  await deleteTeamEventAttendance(req.params.uuid, user);
  return {};
});

// Team Events Proof Image
loginCheckedGet('/event-proof-image/:name(*)', async (req, user) => ({
  url: await getEventProofImage(req.params.name, user)
}));
loginCheckedGet('/event-proof-image/:name(*)/signed-url', async (req, user) => ({
  url: await setEventProofImage(req.params.name, user)
}));
loginCheckedDelete('/event-proof-image/:name(*)', async (req, user) => {
  await deleteEventProofImage(req.params.name, user);
  return {};
});

// Candidate Decider
loginCheckedGet('/candidate-decider', async (_, user) => ({
  instances: await getAllCandidateDeciderInstances(user)
}));
loginCheckedGet('/candidate-decider/:uuid', async (req, user) => ({
  instance: await getCandidateDeciderInstance(req.params.uuid, user)
}));
loginCheckedPost('/candidate-decider', async (req, user) => ({
  instance: await createNewCandidateDeciderInstance(req.body, user)
}));
loginCheckedPut('/candidate-decider/:uuid', async (req, user) =>
  toggleCandidateDeciderInstance(req.params.uuid, user).then(() => ({}))
);
loginCheckedDelete('/candidate-decider/:uuid', async (req, user) =>
  deleteCandidateDeciderInstance(req.params.uuid, user).then(() => ({}))
);
loginCheckedPut('/candidate-decider/:uuid/rating', (req, user) =>
  updateCandidateDeciderRating(user, req.params.uuid, req.body.id, req.body.rating).then(() => ({}))
);
loginCheckedPost('/candidate-decider/:uuid/comment', (req, user) =>
  updateCandidateDeciderComment(user, req.params.uuid, req.body.id, req.body.comment).then(
    () => ({})
  )
);

loginCheckedPost('/sendMail', async (req, user) => ({
  info: await sendMail(req.body.to, req.body.subject, req.body.text)
}));

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
loginCheckedGet('/dev-portfolio/:uuid/submission', async (req, user) => ({
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
loginCheckedPut('/dev-portfolio/:uuid/submission/regrade', async (req, user) => ({
  portfolio: await regradeSubmissions(req.params.uuid, user)
}));
loginCheckedPut('/dev-portfolio/:uuid/submission', async (req, user) => ({
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
