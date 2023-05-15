import { RequestHandler, Request, Response, Router } from 'express';
import admin from 'firebase-admin';
import { HandlerError } from './errors';
import PermissionsManager from './permissionsManager';
import { app as adminApp, env } from '../firebase';
import MembersDao from '../dao/MembersDao';

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

export const loginCheckedGet = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
): RequestHandler => router.get(path, loginCheckedHandler(handler));

export const loginCheckedPost = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
): RequestHandler => router.post(path, loginCheckedHandler(handler));

export const loginCheckedDelete = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
): RequestHandler => router.delete(path, loginCheckedHandler(handler));

export const loginCheckedPut = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>
): RequestHandler => router.put(path, loginCheckedHandler(handler));
