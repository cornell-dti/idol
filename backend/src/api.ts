import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import session, { MemoryStore } from 'express-session';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { db as database, app as adminApp } from './firebase';
import {
  allMembers,
  getMember,
  setMember,
  deleteMember,
  updateMember
} from './memberAPI';
import { getMemberImage, setMemberImage, allMemberImages } from './imageAPI';
import { allTeams, setTeam, deleteTeam } from './teamAPI';
import { allRoles } from './permissions';

// Constants and configurations
const app = express();
const router = express.Router();
const db = database;
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
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore(),
    cookie: {
      secure: !!isProd,
      maxAge: 3600000
    }
  })
);
const sessionErrCb = (err) => {
  console.log(err);
};

// Check valid session
const checkLoggedIn = (req: Request, res: Response): boolean => {
  if (!enforceSession) {
    return true;
  }
  if (req.session?.isLoggedIn) {
    return true;
  }
  // Session expired
  res.status(440).json({ error: 'Not logged in!' });
  return false;
};

const loginCheckedHandler = (
  handler: (req: Request, res: Response) => Promise<void>
): RequestHandler => async (req: Request, res: Response): Promise<void> => {
  if (!checkLoggedIn(req, res)) return;
  await handler(req, res);
};

const loginCheckedGet = (
  path: string,
  handler: (req: Request, res: Response) => Promise<void>
) => router.get(path, loginCheckedHandler(handler));

const loginCheckedPost = (
  path: string,
  handler: (req: Request, res: Response) => Promise<void>
) => router.post(path, loginCheckedHandler(handler));

const loginCheckedDelete = (
  path: string,
  handler: (req: Request, res: Response) => Promise<void>
) => router.delete(path, loginCheckedHandler(handler));

// Login
router.post('/login', async (req: Request, res: Response) => {
  const members = await db
    .collection('members')
    .get()
    .then((vals) => vals.docs.map((doc) => doc.data()));
  const { auth_token } = req.body;
  admin
    .auth(adminApp)
    .verifyIdToken(auth_token)
    .then((decoded) => {
      const foundMember = members.find((val) => val.email === decoded.email);
      if (!foundMember) {
        res.json({ isLoggedIn: false });
        return;
      }
      req.session!.isLoggedIn = true;
      req.session!.email = foundMember.email;
      req.session!.save((err) => {
        if (err) sessionErrCb(err);
        res.json({ isLoggedIn: true });
      });
    });
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.session!.isLoggedIn = false;
  req.session!.destroy((err) => {
    if (err) sessionErrCb(err);
    res.json({ isLoggedIn: false });
  });
});

// Roles
router.get('/allRoles', (_, res) => res.status(200).json({ roles: allRoles }));

// Members
router.get('/allMembers', async (_, res) => {
  const handled = await allMembers();
  res.status(handled.status).json(handled);
});
loginCheckedGet('/getMember/:email', async (req, res) => {
  const handled = await getMember(req);
  res.status(handled.status).json(handled);
});
loginCheckedPost('/setMember', async (req, res) => {
  const handled = await setMember(req);
  res.status(handled.status).json(handled);
});
loginCheckedDelete('/deleteMember/:email', async (req, res) => {
  const handled = await deleteMember(req);
  res.status(handled.status).json(handled);
});
loginCheckedPost('/updateMember', async (req, res) => {
  const handled = await updateMember(req);
  res.status(handled.status).json(handled);
});

// Teams
loginCheckedGet('/allTeams', async (_, res) => {
  const handled = await allTeams();
  res.status(handled.status).json(handled);
});
loginCheckedPost('/setTeam', async (req, res) => {
  const handled = await setTeam(req);
  res.status(handled.status).json(handled);
});
loginCheckedPost('/deleteTeam', async (req, res) => {
  const handled = await deleteTeam(req);
  res.status(handled.status).json(handled);
});

// Images
loginCheckedGet('/getMemberImage', async (req, res) => {
  const handled = await getMemberImage(req);
  res.status(handled.status).json(handled);
});

loginCheckedGet('/getImageSignedURL', async (req, res) => {
  const handled = await setMemberImage(req);
  res.status(handled.status).json(handled);
});

router.get('/allMemberImages', async (_, res) => {
  const handled = await allMemberImages();
  res.status(handled.status).json(handled);
});

app.use('/.netlify/functions/api', router);

// Startup local server if not production (prod is serverless)
if (!isProd) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`IDOL backend listening on port: ${PORT}`);
  });
}

export const handler = serverless(app);
