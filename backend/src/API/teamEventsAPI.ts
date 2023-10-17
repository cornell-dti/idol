import TeamEventAttendanceDao from '../dao/TeamEventAttendanceDao';
import TeamEventsDao from '../dao/TeamEventsDao';
import { PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const teamEventAttendanceDao = new TeamEventAttendanceDao();

/**
 * Returns a list of all team events along with their requests. If the user does
 * not have permissions to view team events, an error will be thrown.
 * @param user the IdolMember object of the user making the request
 * @returns all team events
 */
export const getAllTeamEvents = async (user: IdolMember): Promise<TeamEvent[]> => {
  const canEditTeamEvents = await PermissionsManager.canEditTeamEvent(user);
  if (!canEditTeamEvents) throw new PermissionError('does not have permissions');
  const teamEvents = await TeamEventsDao.getAllTeamEvents();
  return Promise.all(
    teamEvents.map(async (event) => ({
      ...event,
      requests: await teamEventAttendanceDao.getTeamEventAttendanceByEventId(event.uuid)
    }))
  );
};

/**
 * Gets all team events and their information
 * @returns all list of TeamEventInfo objects with the name, date, numCredits,
 * hasHours, and uuid of each team event
 */
export const getAllTeamEventInfo = async (): Promise<TeamEventInfo[]> =>
  TeamEventsDao.getAllTeamEventInfo();

/**
 * Creates a team event with the given information. If the user does not have
 * permissions to create team events, an error will be thrown.
 * @param teamEventInfo the team event to be created
 * @param user the user making the request
 * @returns the team event that was created
 */
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

/**
 * Deletes a team event with the given uuid. If the user does not have
 * permissions to delete team events, an error will be thrown.
 * @param uuid the uuid of the team event to be deleted
 * @param user the user making the request
 */
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

/**
 * Updates the given team event with new information. If the user does not have
 * permissions to update team events, an error will be thrown.
 * @param teamEventInfo the updated team event object
 * @param user the user making the request
 * @returns the updated team event
 */
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

/**
 * Creates a team event attendance request for the given user. Throws an error
 * if the user requests team event credit for another user.
 * @param request the team event attendance request
 * @param user the user making the request
 */
export const requestTeamEventCredit = async (
  request: TeamEventAttendance,
  user: IdolMember
): Promise<TeamEventAttendance> => {
  if (user.email !== request.member.email) {
    throw new PermissionError(
      `User with email ${user.email} cannot request team event credit for another member, ${request.member.email}.`
    );
  }
  const updatedteamEvent = { ...request, status: 'pending' as Status };
  const teamEventAttendance = await teamEventAttendanceDao.createTeamEventAttendance(
    updatedteamEvent
  );
  return teamEventAttendance;
};

/**
 * Gets the team event with the given uuid. If the user does not have
 * permissions to view team events, an error will be thrown.
 * @param uuid the uuid of the team event to be fetched
 * @param user the user making the request
 * @returns the team event with the given uuid
 */
export const getTeamEvent = async (uuid: string, user: IdolMember): Promise<TeamEvent> => {
  const canEditTeamEvents = await PermissionsManager.canEditTeamEvent(user);
  if (!canEditTeamEvents)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to get full team event`
    );

  const teamEvent = await TeamEventsDao.getTeamEvent(uuid);
  return {
    ...teamEvent,
    requests: await teamEventAttendanceDao.getTeamEventAttendanceByEventId(teamEvent.uuid)
  };
};

/**
 * Deletes all team events and their attendance. If the user does not have
 * permissions to delete team events, an error will be thrown.
 * @param user the user making the request
 */
export const clearAllTeamEvents = async (user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete all team events.`
    );
  await TeamEventAttendanceDao.deleteAllTeamEventAttendance();
  await TeamEventsDao.deleteAllTeamEvents();
};

/**
 * Gets a list of all team event attendance for the given user. If the user
 * does not have permissions to view team events, an error will be thrown.
 * @param user the user making the request
 * @returns the list of team event attendance for the given user
 */
export const getTeamEventAttendanceByUser = async (
  user: IdolMember
): Promise<TeamEventAttendance[]> => teamEventAttendanceDao.getTeamEventAttendanceByUser(user);

/**
 * Updates the given team event attendance. If the user does not have
 * permissions to update team events, an error will be thrown.
 * @param teamEventAttendance the team event attendance to be updated
 * @param user the user making the request
 * @returns the updated team event attendance
 */
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

/**
 * Deletes the team event attendance with the given uuid. If the user does not
 * have permissions to delete team events, an error will be thrown.
 * @param uuid the uuid of the team event attendance to be deleted
 * @param user the user making the request
 */
export const deleteTeamEventAttendance = async (uuid: string, user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  const attendance = await teamEventAttendanceDao.getTeamEventAttendance(uuid);

  if (!attendance) return;

  if (!isLeadOrAdmin && attendance.member.email !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete team events attendance`
    );
  }
  await teamEventAttendanceDao.deleteTeamEventAttendance(uuid);
};
