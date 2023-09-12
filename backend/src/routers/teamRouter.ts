import { Router } from 'express';
import { allTeams, setTeam, deleteTeam } from '../API/teamAPI';
import { loginCheckedGet, loginCheckedPut, loginCheckedPost } from '../utils/auth';

const teamRouter = Router();

loginCheckedGet(teamRouter, '/', async () => ({ teams: await allTeams() }), 'team');

loginCheckedPut(
  teamRouter,
  '/',
  async (req, user) => ({
    team: await setTeam(req.body, user)
  }),
  'team'
);

// TODO: should eventually make this a delete request
loginCheckedPost(
  teamRouter,
  '/',
  async (req, user) => ({
    team: await deleteTeam(req.body, user)
  }),
  'team'
);

export default teamRouter;
