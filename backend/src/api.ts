import express from 'express';
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
import { getAllRoles } from './roleAPI';
import { allTeams, setTeam, deleteTeam } from './teamAPI';

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
export const checkLoggedIn = (req, res): boolean => {
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

// Login
router.post('/login', async (req, res) => {
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
router.post('/logout', (req, res) => {
  req.session!.isLoggedIn = false;
  req.session!.destroy((err) => {
    if (err) sessionErrCb(err);
    res.json({ isLoggedIn: false });
  });
});

// Roles
router.get('/allRoles', getAllRoles);

// Members
router.get('/allMembers', async (req, res) => {
  const handled = await allMembers(req, res);
  res.status(handled!.status).json(handled);
});
router.get('/getMember/:email', async (req, res) => {
  const handled = await getMember(req, res);
  res.status(handled!.status).json(handled);
});
router.post('/setMember', async (req, res) => {
  const handled = await setMember(req, res);
  res.status(handled!.status).json(handled);
});
router.delete('/deleteMember', async (req, res) => {
  const handled = await deleteMember(req, res);
  res.status(handled!.status).json(handled);
});

router.post('/updateMember', async (req, res) => {
  const handled = await updateMember(req, res);
  res.status(handled!.status).json(handled);
});

// Teams
router.get('/allTeams', allTeams);
router.post('/setTeam', setTeam);
router.delete('/deleteTeam', deleteTeam);

app.use('/.netlify/functions/api', router);

// Startup local server if not production (prod is serverless)
if (!isProd) {
  app.listen(PORT, () => {
    console.log(`IDOL backend listening on port: ${PORT}`);
  });
}

module.exports.handler = serverless(app);
