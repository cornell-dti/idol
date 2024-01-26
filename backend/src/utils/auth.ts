import { RequestHandler, Request, Response, Router, NextFunction } from 'express';
import admin from 'firebase-admin';
import { HandlerError } from './errors';
import PermissionsManager from './permissionsManager';
import { app as adminApp, env } from '../firebase';
import MembersDao from '../dao/MembersDao';
import rbacConfig from '../../rbac.json';
import { AuthRoleDoc, RBACConfig } from '../types/AuthTypes';
import AuthRoleDao from '../dao/AuthRoleDao';

const getUserEmailFromRequest = async (request: Request): Promise<string | undefined> => {
  const idToken = request.headers['auth-token'];
  if (typeof idToken !== 'string') return undefined;
  const decodedToken = await admin.auth(adminApp).verifyIdToken(idToken);
  return decodedToken.email;
};

const getUserRole = async (user: IdolMember): Promise<AuthRoleDoc | undefined> => {
  const authRoleDao = new AuthRoleDao();
  return authRoleDao.getAuthRole(user);
};

const loginCheckedHandler =
  (handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>): RequestHandler =>
  async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals;
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

const hasRbacPerm = async (
  user: IdolMember,
  rbacConfig: RBACConfig,
  resource?: string,
  action?: string
): Promise<boolean> => {
  if (resource && action) {
    const roleData = await getUserRole(user);
    const userRole = roleData?.role;
    const resourceRBACConfig = rbacConfig.resources[resource];

    if (resourceRBACConfig) {
      return resourceRBACConfig[action].includes(userRole);
    }
  }
  return true;
};

const getAuthMiddleware =
  (
    resource?: string,
    action?: string,
    userHasAccess: (req: Request, user: IdolMember) => Promise<boolean> = async () => true
  ): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    // authentication
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
    // RBAC
    const userHasRbacPerm = await hasRbacPerm(user, rbacConfig as RBACConfig, resource, action);
    if (!(userHasRbacPerm || (await userHasAccess(req, user)))) {
      res.status(401).send({
        error: `User with email ${user.email} does not have read and/or write access to the requested resource.`
      });
    }
    res.locals.user = user;
    next();
  };

export const loginCheckedGet = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>,
  resource?: string,
  action?: string,
  userHasAccess?: (req: Request, user: IdolMember) => Promise<boolean>
): RequestHandler =>
  router.get(
    path,
    getAuthMiddleware(resource, action, userHasAccess),
    loginCheckedHandler(handler)
  );

export const loginCheckedPost = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>,
  resource?: string,
  action?: string,
  userHasAccess?: (req: Request, user: IdolMember) => Promise<boolean>
): RequestHandler =>
  router.post(
    path,
    getAuthMiddleware(resource, action, userHasAccess),
    loginCheckedHandler(handler)
  );

export const loginCheckedDelete = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>,
  resource?: string,
  action?: string,
  userHasAccess?: (req: Request, user: IdolMember) => Promise<boolean>
): RequestHandler =>
  router.delete(
    path,
    getAuthMiddleware(resource, action, userHasAccess),
    loginCheckedHandler(handler)
  );

export const loginCheckedPut = (
  router: Router,
  path: string,
  handler: (req: Request, user: IdolMember) => Promise<Record<string, unknown>>,
  resource?: string,
  action?: string,
  userHasAccess?: (req: Request, user: IdolMember) => Promise<boolean>
): RequestHandler =>
  router.put(
    path,
    getAuthMiddleware(resource, action, userHasAccess),
    loginCheckedHandler(handler)
  );
