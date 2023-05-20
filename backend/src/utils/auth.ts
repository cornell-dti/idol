import { RequestHandler, Request, Response, Router, NextFunction } from 'express';
import admin from 'firebase-admin';
import { HandlerError } from './errors';
import PermissionsManager from './permissionsManager';
import { app as adminApp, env } from '../firebase';
import MembersDao from '../dao/MembersDao';
import rbacConfig from '../../rbac.json';
import { AuthRole } from '../types/DataTypes';
import AuthRoleDao from '../dao/AuthRoleDao';

const getUserEmailFromRequest = async (request: Request): Promise<string | undefined> => {
  const idToken = request.headers['auth-token'];
  if (typeof idToken !== 'string') return undefined;
  const decodedToken = await admin.auth(adminApp).verifyIdToken(idToken);
  return decodedToken.email;
};

const getUserRole = async (user: IdolMember): Promise<AuthRole | undefined> => {
  const authRoleDao = new AuthRoleDao();
  return authRoleDao.getAuthRole(user);
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

const isAuthorized = async (
  req: Request,
  resource: string,
  user: IdolMember,
  rbacConfig: any
): Promise<boolean> => {
  const userRole = await getUserRole(user);
  const resourceRBACConfig = rbacConfig.resources[resource];

  if (userRole === 'admin') return true;

  if (req.method === 'GET') {
    if (resourceRBACConfig.attributes.includes('meta_only') && req.query.meta_only) return true;
    const canReadRoles = resourceRBACConfig.read_only.push(...resourceRBACConfig.read_and_write);
    if (canReadRoles.includes(userRole)) return true;
  }

  const canWriteRoles = resourceRBACConfig.read_and_write;
  if (resourceRBACConfig.attributes.includes('email') && req.params.email) {
    if (req.params.email === user.email) return true;
  }

  if (canWriteRoles.includes('userRole')) return true;

  return false;
};

const getRBACMiddleware =
  (resource?: string | undefined): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
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
    if (
      resource &&
      resource in Object.keys(rbacConfig.resources) &&
      !(await isAuthorized(req, resource, user, rbacConfig))
    ) {
      res.status(401).send({
        error: `User with email ${user.email} does not have read and/or write access to the requested resource.`
      });
    }
    next();
  };

export const loginCheckedGet = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>,
  resource?: string
): RequestHandler => router.get(path, getRBACMiddleware(resource), loginCheckedHandler(handler));

export const loginCheckedPost = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>,
  resource?: string
): RequestHandler => router.post(path, getRBACMiddleware(resource), loginCheckedHandler(handler));

export const loginCheckedDelete = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>,
  resource?: string
): RequestHandler => router.delete(path, getRBACMiddleware(resource), loginCheckedHandler(handler));

export const loginCheckedPut = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>,
  resource?: string
): RequestHandler => router.put(path, getRBACMiddleware(resource), loginCheckedHandler(handler));
