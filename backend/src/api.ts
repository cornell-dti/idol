import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import admin from 'firebase-admin';
import { app as adminApp } from './firebase';
import {
  allMembers,
  allApprovedMembers,
  setMember,
  deleteMember,
  updateMember,
  getUserInformationDifference,
  reviewUserInformationChange
} from './memberAPI';
import { getMemberImage, setMemberImage, allMemberImages } from './imageAPI';
import { allTeams, setTeam, deleteTeam } from './teamAPI';
import { getAllShoutouts, getShoutouts, giveShoutout } from './shoutoutAPI';
import {
  acceptIDOLChanges,
  getIDOLChangesPR,
  rejectIDOLChanges,
  requestIDOLPullDispatch
} from './site-integration';
import PermissionsManager from './permissions';
import { HandlerError } from './errors';
import MembersDao from './dao/MembersDao';
import {
  allSignInForms,
  createSignInForm,
  deleteSignInForm,
  signIn,
  signInFormExists,
  signInFormExpired
} from './signinformAPI';
import {
  createTeamEvent,
  deleteTeamEvent,
  getAllTeamEvents,
  getTeamEvent,
  updateTeamEvent
} from './team-eventsAPI';

import {
  getAllCandidateDeciderInstances,
  createNewCandidateDeciderInstance,
  toggleCandidateDeciderInstance,
  deleteCandidateDeciderInstance,
  getCandidateDeciderInstance,
  updateCandidateDeciderRating,
  updateCandidateDeciderComment
} from './candidateDeciderAPI';
import { getEventProofImage, setEventProofImage } from './team-events-imageAPI';

// Constants and configurations
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 9000;
const isProd: boolean = JSON.parse(process.env.IS_PROD as string);
const allowAllOrigins = false;
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
loginCheckedPost('/setMember', async (req, user) => ({
  member: await setMember(req.body, user)
}));
loginCheckedDelete('/deleteMember/:email', async (req, user) => {
  await deleteMember(req.params.email, user);
  return {};
});
loginCheckedPost('/updateMember', async (req, user) => ({
  member: await updateMember(req.body, user)
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

loginCheckedGet('/getShoutouts/:email/:type', async (req, user) => ({
  shoutouts: await getShoutouts(req.params.email, req.params.type as 'given' | 'received', user)
}));

loginCheckedGet('/allShoutouts', async () => ({
  shoutouts: await getAllShoutouts()
}));

loginCheckedPost('/giveShoutout', async (req, user) => ({
  shoutout: await giveShoutout(req.body, user)
}));

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
loginCheckedPost('/signinExists', async (req, _) => ({
  exists: await signInFormExists(req.body.id)
}));
loginCheckedPost('/signinExpired', async (req, _) => ({
  expired: await signInFormExpired(req.body.id)
}));
loginCheckedPost('/signinCreate', async (req, user) =>
  createSignInForm(req.body.id, req.body.expireAt, user)
);
loginCheckedPost('/signinDelete', async (req, user) => {
  await deleteSignInForm(req.body.id, user);
  return {};
});
loginCheckedPost('/signin', async (req, user) => signIn(req.body.id, user));
loginCheckedPost('/signinAll', async (_, user) => allSignInForms(user));

// Team Events
loginCheckedPost('/createTeamEvent', async (req, user) => createTeamEvent(req.body, user));
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

// Team Events Proof Image
loginCheckedGet('/getEventProofImageSignedURL/:name', async (req, user) => ({
  url: await setEventProofImage(req.params.name, user)
}));
loginCheckedGet('/getEventProofImage', async (req, user) => ({
  url: await getEventProofImage(req.body, user)
}));

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

app.use('/.netlify/functions/api', router);

// Startup local server if not production (prod is serverless)
if (!isProd) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`IDOL backend listening on port: ${PORT}`);
  });
}

export const handler = serverless(app);
