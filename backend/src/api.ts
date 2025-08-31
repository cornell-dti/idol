import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import admin from 'firebase-admin';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import { app as adminApp, env } from './firebase';
import PermissionsManager from './utils/permissionsManager';
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
  generateMemberArchive
} from './API/memberAPI';
import { allTeams, setTeam, deleteTeam } from './API/teamAPI';
import {
  getAllShoutouts,
  getShoutouts,
  giveShoutout,
  hideShoutout,
  deleteShoutout,
  editShoutout
} from './API/shoutoutAPI';
import {
  createCoffeeChat,
  getAllCoffeeChats,
  updateCoffeeChat,
  getCoffeeChatsByUser,
  deleteCoffeeChat,
  clearAllCoffeeChats,
  getCoffeeChatBingoBoard,
  checkMemberMeetsCategory,
  runAutoChecker,
  notifyMemberCoffeeChat,
  getCoffeeChatSuggestions,
  archiveCoffeeChats
} from './API/coffeeChatAPI';
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
  deleteTeamEventAttendance,
  notifyMemberTeamEvents,
  notifyMemberPeriod
} from './API/teamEventsAPI';
import {
  getAllCandidateDeciderInstances,
  createNewCandidateDeciderInstance,
  deleteCandidateDeciderInstance,
  getCandidateDeciderInstance,
  updateCandidateDeciderRatingAndComment,
  updateCandidateDeciderInstance,
  getCandidateDeciderReviews,
  hasCandidateDeciderInstance
} from './API/candidateDeciderAPI';
import {
  getAllDevPortfolios,
  createNewDevPortfolio,
  updateDevPortfolio,
  deleteDevPortfolio,
  makeDevPortfolioSubmission,
  getDevPortfolio,
  getAllDevPortfolioInfo,
  getDevPortfolioInfo,
  getUsersDevPortfolioSubmissions,
  regradeSubmissions,
  updateSubmissions
} from './API/devPortfolioAPI';
import { getWriteSignedURL, getReadSignedURL, deleteImage } from './API/imageAPI';
import DPSubmissionRequestLogDao from './dao/DPSubmissionRequestLogDao';
import AdminsDao from './dao/AdminsDao';
import { sendMail } from './API/mailAPI';
import {
  addInterviewSlots,
  createInterviewScheduler,
  deleteInterviewSchedulerInstance,
  deleteInterviewSlot,
  getAllApplicants,
  getAllInterviewSchedulerInstances,
  getInterviewSchedulerInstance,
  getInterviewSlots,
  updateInterviewSchedulerInstance,
  updateInterviewSlot
} from './API/interviewSchedulerAPI';
import {
  getAllInterviewStatuses,
  getInterviewStatus,
  createInterviewStatus,
  updateInterviewStatus,
  deleteInterviewStatus,
  deleteInterviewStatusInstance
} from './API/interviewStatusAPI';

import { HandlerError } from './utils/errors';

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
      res.status(401).json({ error: 'Only admins users have permissions to the staging API!' });
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

const loginCheckedPatch = (
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
) => router.patch(path, loginCheckedHandler(handler));

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
  const member = await MembersDao.getCurrentOrPastMemberByEmail(req.params.email);
  const adminEmails = await AdminsDao.getAllAdminEmails();
  const applicants = await getAllApplicants();

  const type = req.query.type as string | undefined;
  let hasIDOLAccess: boolean;

  switch (type) {
    case 'applicants-included':
      hasIDOLAccess = member !== undefined || applicants.includes(req.params.email);
      break;
    default:
      hasIDOLAccess = member !== undefined;
  }

  if (env === 'staging' && !adminEmails.includes(req.params.email)) {
    res.status(200).json({ hasIDOLAccess: false });
  }
  res.status(200).json({
    hasIDOLAccess
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
  member: await updateMember(req.body, user)
}));

loginCheckedGet('/memberDiffs', async (_, user) => ({
  diffs: await getUserInformationDifference(user)
}));
loginCheckedPut('/memberDiffs', async (req, user) => ({
  member: await reviewUserInformationChange(req.body.approved, req.body.rejected, user)
}));

loginCheckedPost('/member-archive', async (req, user) => ({
  archive: await generateMemberArchive(req.body, user, req.query.semesters as number | undefined)
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
loginCheckedGet('/image/:name(*)', async (req) => ({
  url: await getReadSignedURL(req.params.name)
}));

loginCheckedGet('/image-signed-url/:name(*)', async (req) => ({
  url: await getWriteSignedURL(req.params.name)
}));

loginCheckedDelete('/image/:name(*)', async (req) => {
  await deleteImage(req.params.name);
  return {};
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

loginCheckedPut('/shoutout/:uuid', async (req, user) => {
  await editShoutout(req.params.uuid, req.body.message, user);
  return {};
});

loginCheckedDelete('/shoutout/:uuid', async (req, user) => {
  await deleteShoutout(req.params.uuid, user);
  return {};
});

// Coffee Chats
loginCheckedGet('/coffee-chat', async () => ({
  coffeeChats: await getAllCoffeeChats()
}));

loginCheckedPost('/coffee-chat', async (req, user) => ({
  coffeeChat: await createCoffeeChat(req.body, user)
}));

loginCheckedDelete('/coffee-chat', async (_, user) => {
  await clearAllCoffeeChats(user);
  return {};
});

loginCheckedDelete('/coffee-chat/:uuid', async (req, user) => {
  await deleteCoffeeChat(req.params.uuid, user);
  return {};
});

loginCheckedGet('/coffee-chat/:email', async (req, user) => {
  const coffeeChats = await getCoffeeChatsByUser(user, req.params.email);
  return { coffeeChats };
});

loginCheckedPut('/coffee-chat', async (req, user) => ({
  coffeeChat: await updateCoffeeChat(req.body, user)
}));

loginCheckedPatch('/coffee-chat/archive', async (_, user) => {
  await archiveCoffeeChats(user);
  return { message: 'All coffee chats archived successfully.' };
});

loginCheckedGet('/coffee-chat-bingo-board', async () => {
  const board = await getCoffeeChatBingoBoard();
  return { board };
});

loginCheckedGet('/coffee-chat/:otherMemberEmail/:submitterEmail/:category', async (req) => {
  const result = await checkMemberMeetsCategory(
    req.params.otherMemberEmail,
    req.params.submitterEmail,
    decodeURIComponent(req.params.category)
  );
  return { result };
});

loginCheckedPut('/coffee-chat/autocheck/:uuid/', async (req, user) => ({
  coffeeChat: await runAutoChecker(req.params.uuid, user)
}));

loginCheckedPost('/coffee-chat-reminder', async (req, user) => ({
  info: await notifyMemberCoffeeChat(req, req.body, user)
}));

loginCheckedGet('/coffee-chat-suggestions/:email', async (req) => {
  const suggestions = await getCoffeeChatSuggestions(req.params.email);
  return { suggestions };
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
loginCheckedPost('/team-event-attendance', async (req, user) => ({
  teamEventAttendance: await requestTeamEventCredit(req.body.request, user)
}));

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
loginCheckedPost('/team-event-reminder', async (req, user) => ({
  info: await notifyMemberTeamEvents(
    req,
    req.query.end_of_semester_reminder !== undefined,
    req.body,
    user
  )
}));
loginCheckedPost('/send-period-reminder', async (req, user) => ({
  info: await notifyMemberPeriod(req, req.body, user)
}));

// Candidate Decider
loginCheckedGet('/candidate-decider', async (_, user) => ({
  instances: await getAllCandidateDeciderInstances(user)
}));
loginCheckedGet('/candidate-decider-instance', async (_, user) => ({
  hasInstance: await hasCandidateDeciderInstance(user)
}));
loginCheckedGet('/candidate-decider/:uuid', async (req, user) => ({
  instance: await getCandidateDeciderInstance(req.params.uuid, user)
}));
loginCheckedGet('/candidate-decider/:uuid/review', async (req, user) => ({
  reviews: await getCandidateDeciderReviews(req.params.uuid, user)
}));
loginCheckedPost('/candidate-decider', async (req, user) => ({
  instance: await createNewCandidateDeciderInstance(req.body, user)
}));
loginCheckedPut('/candidate-decider', async (req, user) => ({
  instance: await updateCandidateDeciderInstance(req.body, user)
}));
loginCheckedDelete('/candidate-decider/:uuid', async (req, user) =>
  deleteCandidateDeciderInstance(req.params.uuid, user).then(() => ({}))
);
loginCheckedPut('/candidate-decider/rating-and-comment', (req, user) =>
  updateCandidateDeciderRatingAndComment(
    user,
    req.body.uuid,
    req.body.id,
    req.body.rating,
    req.body.comment
  ).then(() => ({}))
);

loginCheckedPost('/sendMail', async (req, user) => ({
  info: await sendMail(req.body.to, req.body.subject, req.body.text, user)
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
loginCheckedPut('/dev-portfolio', async (req, user) => ({
  portfolio: await updateDevPortfolio(req.body, user)
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

// Interview Scheduler
router.get(`/interview-scheduler/applicant`, async (req, res) => {
  const userEmail = await getUserEmailFromRequest(req);
  res.status(200).send({
    instances: await getAllInterviewSchedulerInstances(userEmail ?? '', true)
  });
});

router.get(`/interview-scheduler/applicant/:uuid`, async (req, res) => {
  const userEmail = await getUserEmailFromRequest(req);
  res.status(200).send({
    instance: await getInterviewSchedulerInstance(req.params.uuid, userEmail ?? '', true)
  });
});

loginCheckedGet('/interview-scheduler', async (req, user) => ({
  instances: await getAllInterviewSchedulerInstances(user.email, false)
}));

loginCheckedGet('/interview-scheduler/:uuid', async (req, user) => ({
  instance: await getInterviewSchedulerInstance(req.params.uuid, user.email, false)
}));

loginCheckedPost('/interview-scheduler', async (req, user) => ({
  uuid: await createInterviewScheduler(req.body, user)
}));

loginCheckedPut('/interview-scheduler', async (req, user) => ({
  instance: await updateInterviewSchedulerInstance(user, req.body)
}));

loginCheckedDelete('/interview-scheduler/:uuid', async (req, user) =>
  deleteInterviewSchedulerInstance(req.params.uuid, user).then(() => ({}))
);

router.get('/interview-slots/applicant/:uuid', async (req, res) => {
  const userEmail = await getUserEmailFromRequest(req);
  res.status(200).send({
    slots: await getInterviewSlots(req.params.uuid, userEmail ?? '', true)
  });
});

router.put('/interview-slots/applicant', async (req, res) => {
  const userEmail = await getUserEmailFromRequest(req);
  res.status(200).send({
    success: await updateInterviewSlot(req.body, userEmail ?? '', true, req)
  });
});

loginCheckedGet('/interview-slots/:uuid', async (req, user) => ({
  slots: await getInterviewSlots(req.params.uuid, user.email, false)
}));

loginCheckedPost('/interview-slots', async (req, user) => ({
  slots: await addInterviewSlots(req.body.slots, user)
}));

loginCheckedPut('/interview-slots', async (req, user) => ({
  success: await updateInterviewSlot(req.body, user.email, false, req)
}));

loginCheckedDelete('/interview-slots/:uuid', async (req, user) =>
  deleteInterviewSlot(req.params.uuid, user).then(() => ({}))
);

// Interview Status Dashboard
loginCheckedGet('/interview-status', async (_, user) => ({
  instances: await getAllInterviewStatuses(user)
}));

loginCheckedGet('/interview-status/:uuid', async (req, user) => ({
  instances: await getInterviewStatus(req.params.uuid, user)
}));

loginCheckedPost('/interview-status', async (req, user) => {
  const newStatus = await createInterviewStatus(req.body, user);
  return { newStatus };
});

loginCheckedPut('/interview-status', async (req, user) => ({
  success: await updateInterviewStatus(user, req.body, req.body.uuid)
}));

loginCheckedDelete('/interview-status/:uuid', async (req, user) =>
  deleteInterviewStatus(req.params.uuid, user).then(() => ({}))
);

loginCheckedDelete('/interview-status/instance/:instanceName', async (req, user) =>
  deleteInterviewStatusInstance(req.params.instanceName, user).then(() => ({}))
);

app.use('/.netlify/functions/api', router);

// Startup local server if not production (prod is serverless)
if (!isProd) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`IDOL backend listening on port: ${PORT}`);
  });
}

export const handler = serverless(app);
