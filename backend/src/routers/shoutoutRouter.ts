import { Router, Request } from 'express';
import {
  getShoutouts,
  getAllShoutouts,
  giveShoutout,
  hideShoutout,
  deleteShoutout
} from '../API/shoutoutAPI';
import {
  loginCheckedGet,
  loginCheckedPost,
  loginCheckedPut,
  loginCheckedDelete
} from '../utils/auth';

const shoutoutRouter = Router();

const canAccessResource = async (req: Request, user: IdolMember): Promise<boolean> =>
  req.params.email === user.email;

loginCheckedGet(
  shoutoutRouter,
  '/:email/:type',
  async (req, user) => ({
    shoutouts: await getShoutouts(req.params.email, req.params.type as 'given' | 'received', user)
  }),
  'shoutout',
  'read',
  canAccessResource
);

loginCheckedGet(
  shoutoutRouter,
  '/',
  async () => ({
    shoutouts: await getAllShoutouts()
  }),
  'shoutout',
  'read',
  async () => false
);
// No RBAC?
loginCheckedPost(shoutoutRouter, '/', async (req, user) => ({
  shoutout: await giveShoutout(req.body, user)
}));

loginCheckedPut(
  shoutoutRouter,
  '/',
  async (req, user) => {
    await hideShoutout(req.body.uuid, req.body.hide, user);
    return {};
  },
  'shoutout',
  'write',
  async () => false
);

loginCheckedDelete(
  shoutoutRouter,
  '/:uuid',
  async (req, user) => {
    await deleteShoutout(req.params.uuid, user);
    return {};
  },
  'shoutout',
  'write',
  async () => false
);
export default shoutoutRouter;
