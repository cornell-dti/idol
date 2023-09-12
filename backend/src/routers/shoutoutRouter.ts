import { Router } from 'express';
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

loginCheckedGet(
  shoutoutRouter,
  '/:email/:type',
  async (req, user) => ({
    shoutouts: await getShoutouts(req.params.email, req.params.type as 'given' | 'received', user)
  }),
  'shoutout'
);

loginCheckedGet(
  shoutoutRouter,
  '/',
  async () => ({
    shoutouts: await getAllShoutouts()
  }),
  'shoutout'
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
  'shoutout'
);

loginCheckedDelete(
  shoutoutRouter,
  '/:uuid',
  async (req, user) => {
    await deleteShoutout(req.params.uuid, user);
    return {};
  },
  'shoutout'
);
export default shoutoutRouter;
