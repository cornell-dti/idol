import TeamEventsDao from '../dao/TeamEventsDao';
import TeamEventAttendanceDao from '../dao/TeamEventAttendanceDao';
import { PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

export const getAllTeamEvents = async (user: IdolMember): Promise<TeamEvent[]> => {
  const canEditTeamEvents = await PermissionsManager.canEditTeamEvent(user);
  if (!canEditTeamEvents) throw new PermissionError('does not have permissions');
  return TeamEventsDao.getAllTeamEvents();
};

export const getAllTeamEventInfo = async (): Promise<TeamEventInfo[]> =>
  TeamEventsDao.getAllTeamEventInfo();

export const createTeamEvent = async (
  teamEvent: TeamEvent,
  user: IdolMember
): Promise<TeamEvent> => {
  const canCreateTeamEvent = await PermissionsManager.canEditTeamEvent(user);
  if (!canCreateTeamEvent)
    throw new PermissionError('does not have permissions to create team event');
  await TeamEventsDao.createTeamEvent(teamEvent);
  return teamEvent;
};

export const deleteTeamEvent = async (teamEvent: TeamEvent, user: IdolMember): Promise<void> => {
  if (!PermissionsManager.canEditTeamEvent(user)) {
    throw new PermissionError("You don't have permission to delete a team event!");
  }
  await TeamEventsDao.deleteTeamEvent(teamEvent);
};

export const updateTeamEvent = async (
  teamEvent: TeamEvent,
  user: IdolMember
): Promise<TeamEvent> => {
  if (!PermissionsManager.canEditTeamEvent(user)) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to update team events`
    );
  }
  await TeamEventsDao.updateTeamEvent(teamEvent);
  return teamEvent;
};

export const requestTeamEventCredit = async (
  uuid: string,
  request: TeamEventAttendance
): Promise<void> => {
  const teamEvent = await TeamEventsDao.getTeamEvent(uuid);
  const updatedTeamEvent = {
    ...teamEvent,
    requests: [...teamEvent.requests, request]
  };
  await TeamEventsDao.updateTeamEvent(updatedTeamEvent);
};

export const getTeamEvent = async (uuid: string, user: IdolMember): Promise<TeamEvent> => {
  const canEditTeamEvents = await PermissionsManager.canEditTeamEvent(user);
  if (!canEditTeamEvents)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to get full team event`
    );
  return TeamEventsDao.getTeamEvent(uuid);
};

export const clearAllTeamEvents = async (user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete all team events.`
    );
  await TeamEventsDao.deleteAllTeamEvents();
};
export const getAllTeamEventsForMember = async (
  email: string,
  isPending: boolean
): Promise<TeamEventInfo[]> => TeamEventsDao.getTeamEventsForMember(email, isPending);

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
  await TeamEventAttendanceDao.updateTeamEventAttendance(teamEventAttendance);
  return teamEventAttendance;
};

export const deleteTeamEventAttendance = async (uuid: string, user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete team events attendance`
    );
  }
  await TeamEventAttendanceDao.deleteTeamEventAttendance(uuid);
};
