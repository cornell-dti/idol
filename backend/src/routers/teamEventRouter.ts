import { Router, Request } from 'express';
import {
  createTeamEvent,
  getTeamEvent,
  getAllTeamEvents,
  getAllTeamEventInfo,
  updateTeamEvent,
  deleteTeamEvent,
  clearAllTeamEvents,
  requestTeamEventCredit,
  getTeamEventAttendanceByUser,
  updateTeamEventAttendance,
  deleteTeamEventAttendance
} from '../API/teamEventsAPI';
import {
  loginCheckedPost,
  loginCheckedGet,
  loginCheckedPut,
  loginCheckedDelete
} from '../utils/auth';

const teamEventRouter = Router();

const canAccessResource = async (req: Request, user: IdolMember): Promise<boolean> =>
  req.query.meta_only === 'true' || req.params.email === user.email;

// /team-event
loginCheckedPost(
  teamEventRouter,
  '/',
  async (req, user) => {
    await createTeamEvent(req.body, user);
    return {};
  },
  'team-event',
  'write',
  async () => false
);
loginCheckedGet(
  teamEventRouter,
  '/:uuid',
  async (req, user) => ({
    event: await getTeamEvent(req.params.uuid, user)
  }),
  'team-event',
  'read',
  canAccessResource
);
loginCheckedGet(
  teamEventRouter,
  '/',
  async (req, user) => ({
    events: !req.query.meta_only ? await getAllTeamEvents(user) : await getAllTeamEventInfo()
  }),
  'team-event',
  'read',
  canAccessResource
);
loginCheckedPut(
  teamEventRouter,
  '/',
  async (req, user) => ({
    event: await updateTeamEvent(req.body, user)
  }),
  'team-event',
  'write',
  async () => false
);
loginCheckedDelete(
  teamEventRouter,
  '/:uuid',
  async (req, user) => {
    await deleteTeamEvent(req.body, user);
    return {};
  },
  'team-event',
  'write',
  async () => false
);
loginCheckedDelete(
  teamEventRouter,
  '/',
  async (_, user) => {
    await clearAllTeamEvents(user);
    return {};
  },
  'team-event',
  'write',
  async () => false
);

// /team-event/attendance
loginCheckedPost(
  teamEventRouter,
  '/attendance',
  async (req, user) => {
    await requestTeamEventCredit(req.body.request, user);
    return {};
  },
  'team-event-attendance'
);
loginCheckedGet(
  teamEventRouter,
  '/attendance/:email',
  async (_, user) => ({
    teamEventAttendance: await getTeamEventAttendanceByUser(user)
  }),
  'team-event-attendance',
  'read',
  canAccessResource
);
loginCheckedPut(
  teamEventRouter,
  '/attendance',
  async (req, user) => ({
    teamEventAttendance: await updateTeamEventAttendance(req.body, user)
  }),
  'team-event-attendance'
);
loginCheckedDelete(
  teamEventRouter,
  '/attendance/:uuid',
  async (req, user) => {
    await deleteTeamEventAttendance(req.params.uuid, user);
    return {};
  },
  'team-event-attendance',
  'write',
  async () => false
);

export default teamEventRouter;
