import { Router } from 'express';
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
const teamEventAttendanceRouter = Router({ mergeParams: true });

teamEventRouter.use('/attendance', teamEventAttendanceRouter);

// /team-event
loginCheckedPost(
  teamEventRouter,
  '/',
  async (req, user) => {
    await createTeamEvent(req.body, user);
    return {};
  },
  'team-event'
);
loginCheckedGet(
  teamEventRouter,
  '/:uuid',
  async (req, user) => ({
    event: await getTeamEvent(req.params.uuid, user)
  }),
  'team-event'
);
loginCheckedGet(
  teamEventRouter,
  '/',
  async (req, user) => ({
    events: !req.query.meta_only ? await getAllTeamEvents(user) : await getAllTeamEventInfo()
  }),
  'team-event'
);
loginCheckedPut(
  teamEventRouter,
  '/',
  async (req, user) => ({
    event: await updateTeamEvent(req.body, user)
  }),
  'team-event'
);
loginCheckedDelete(
  teamEventRouter,
  '/:uuid',
  async (req, user) => {
    await deleteTeamEvent(req.body, user);
    return {};
  },
  'team-event'
);
loginCheckedDelete(
  teamEventRouter,
  '/',
  async (_, user) => {
    await clearAllTeamEvents(user);
    return {};
  },
  'team-event'
);

// /team-event/attendance
loginCheckedPost(
  teamEventAttendanceRouter,
  '/attendance',
  async (req, user) => {
    await requestTeamEventCredit(req.body.request, user);
    return {};
  },
  'team-event-attendance'
);
loginCheckedGet(
  teamEventAttendanceRouter,
  '/attendance/:email',
  async (_, user) => ({
    teamEventAttendance: await getTeamEventAttendanceByUser(user)
  }),
  'team-event-attendance'
);
loginCheckedPut(
  teamEventAttendanceRouter,
  '/attendance',
  async (req, user) => ({
    teamEventAttendance: await updateTeamEventAttendance(req.body, user)
  }),
  'team-event-attendance'
);
loginCheckedDelete(
  teamEventAttendanceRouter,
  '/attendance/:uuid',
  async (req, user) => {
    await deleteTeamEventAttendance(req.params.uuid, user);
    return {};
  },
  'team-event-attendance'
);

export default teamEventRouter;
