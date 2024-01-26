import { Router } from 'express';
import { allTeams, setTeam, deleteTeam } from '../API/teamAPI';
import { loginCheckedGet, loginCheckedPut, loginCheckedPost } from '../utils/auth';

const teamRouter = Router();

loginCheckedGet(
  teamRouter,
  '/',
  async () => ({ teams: await allTeams() }),
  'team',
  'read',
  async () => false
);

loginCheckedPut(
  teamRouter,
  '/',
  async (req, user) => ({
    team: await setTeam(req.body, user)
  }),
  'team',
  'write',
  async () => false
);

// TODO: should eventually make this a delete request
loginCheckedPost(
  teamRouter,
  '/',
  async (req, user) => ({
    team: await deleteTeam(req.body, user)
  }),
  'team',
  'write',
  async () => false
);

export default teamRouter;
