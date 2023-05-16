import { Router } from 'express';
import TeamEventAttendanceDao from '../dao/TeamEventAttendanceDao';
import TeamEventsDao from '../dao/TeamEventsDao';
import { PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';
import {
  loginCheckedDelete,
  loginCheckedPost,
  loginCheckedGet,
  loginCheckedPut
} from '../utils/auth';

const teamEventAttendanceDao = new TeamEventAttendanceDao();

export const getAllTeamEvents = async (user: IdolMember): Promise<TeamEvent[]> => {
  const canEditTeamEvents = await PermissionsManager.canEditTeamEvent(user);
  if (!canEditTeamEvents) throw new PermissionError('does not have permissions');
  const teamEvents = await TeamEventsDao.getAllTeamEvents();
  return Promise.all(
    teamEvents.map(async (event) => ({
      ...event,
      attendees: (await teamEventAttendanceDao.getTeamEventAttendanceByEventId(event.uuid)).filter(
        (attendance) => !attendance.pending
      ),
      requests: (await teamEventAttendanceDao.getTeamEventAttendanceByEventId(event.uuid)).filter(
        (attendance) => attendance.pending
      )
    }))
  );
};

export const getAllTeamEventInfo = async (): Promise<TeamEventInfo[]> =>
  TeamEventsDao.getAllTeamEventInfo();

export const createTeamEvent = async (
  teamEventInfo: TeamEventInfo,
  user: IdolMember
): Promise<TeamEventInfo> => {
  const canCreateTeamEvent = await PermissionsManager.canEditTeamEvent(user);
  if (!canCreateTeamEvent)
    throw new PermissionError('does not have permissions to create team event');
  await TeamEventsDao.createTeamEvent(teamEventInfo);
  return teamEventInfo;
};

export const deleteTeamEvent = async (uuid: string, user: IdolMember): Promise<void> => {
  if (!PermissionsManager.canEditTeamEvent(user)) {
    throw new PermissionError("You don't have permission to delete a team event!");
  }
  const teamEvent = await TeamEventsDao.getTeamEvent(uuid); // TODO: need to make a dao method for getting full team event
  if (!teamEvent) return;

  const allAttendances = await teamEventAttendanceDao.getTeamEventAttendanceByEventId(uuid);

  await Promise.all(
    allAttendances.map((attendance) =>
      teamEventAttendanceDao.deleteTeamEventAttendance(attendance.uuid)
    )
  );
  await TeamEventsDao.deleteTeamEvent(teamEvent);
};

export const updateTeamEvent = async (
  teamEventInfo: TeamEventInfo,
  user: IdolMember
): Promise<TeamEventInfo> => {
  if (!PermissionsManager.canEditTeamEvent(user)) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to update team events`
    );
  }
  const updatedTeamEvent = await TeamEventsDao.updateTeamEvent(teamEventInfo);
  return updatedTeamEvent;
};

export const requestTeamEventCredit = async (
  request: TeamEventAttendance,
  user: IdolMember
): Promise<void> => {
  if (user.email !== request.member.email) {
    throw new PermissionError(
      `User with email ${user.email} cannot request team event credit for another member, ${request.member.email}.`
    );
  }
  const updatedteamEvent = { ...request, pending: true };
  await teamEventAttendanceDao.createTeamEventAttendance(updatedteamEvent);
};

export const getTeamEvent = async (uuid: string, user: IdolMember): Promise<TeamEvent> => {
  const canEditTeamEvents = await PermissionsManager.canEditTeamEvent(user);
  if (!canEditTeamEvents)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to get full team event`
    );

  const teamEvent = await TeamEventsDao.getTeamEvent(uuid);
  return {
    ...teamEvent,
    attendees: (
      await teamEventAttendanceDao.getTeamEventAttendanceByEventId(teamEvent.uuid)
    ).filter((attendance) => !attendance.pending),
    requests: (await teamEventAttendanceDao.getTeamEventAttendanceByEventId(teamEvent.uuid)).filter(
      (attendance) => attendance.pending
    )
  };
};

export const clearAllTeamEvents = async (user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete all team events.`
    );
  await TeamEventAttendanceDao.deleteAllTeamEventAttendance();
  await TeamEventsDao.deleteAllTeamEvents();
};

export const getTeamEventAttendanceByUser = async (
  user: IdolMember
): Promise<TeamEventAttendance[]> => teamEventAttendanceDao.getTeamEventAttendanceByUser(user);

export const updateTeamEventAttendance = async (
  teamEventAttendance: TeamEventAttendance,
  user: IdolMember
): Promise<TeamEventAttendance> => {
  const canEditTeamEvent = await PermissionsManager.canEditTeamEvent(user);
  if (!canEditTeamEvent) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to update team events attendance`
    );
  }
  await teamEventAttendanceDao.updateTeamEventAttendance(teamEventAttendance);
  return teamEventAttendance;
};

export const deleteTeamEventAttendance = async (uuid: string, user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete team events attendance`
    );
  }
  await teamEventAttendanceDao.deleteTeamEventAttendance(uuid);
};

export const teamEventRouter = Router();

loginCheckedPost(teamEventRouter, '/', async (req, user) => {
  await createTeamEvent(req.body, user);
  return {};
});
loginCheckedGet(teamEventRouter, '/:uuid', async (req, user) => ({
  event: await getTeamEvent(req.params.uuid, user)
}));
loginCheckedGet(teamEventRouter, '/', async (req, user) => ({
  events: !req.query.meta_only ? await getAllTeamEvents(user) : await getAllTeamEventInfo()
}));
loginCheckedPut(teamEventRouter, '/', async (req, user) => ({
  event: await updateTeamEvent(req.body, user)
}));
loginCheckedDelete(teamEventRouter, '/:uuid', async (req, user) => {
  await deleteTeamEvent(req.body, user);
  return {};
});
loginCheckedDelete(teamEventRouter, '/', async (_, user) => {
  await clearAllTeamEvents(user);
  return {};
});
loginCheckedPost(teamEventRouter, '/attendance', async (req, user) => {
  await requestTeamEventCredit(req.body.request, user);
  return {};
});
loginCheckedGet(teamEventRouter, '/attendance/:email', async (_, user) => ({
  teamEventAttendance: await getTeamEventAttendanceByUser(user)
}));
loginCheckedPut(teamEventRouter, '/attendance', async (req, user) => ({
  teamEventAttendance: await updateTeamEventAttendance(req.body, user)
}));
loginCheckedDelete(teamEventRouter, '/attendance/:uuid', async (req, user) => {
  await deleteTeamEventAttendance(req.params.uuid, user);
  return {};
});
