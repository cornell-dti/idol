import TeamEventAttendanceDao from '../dao/TeamEventAttendanceDao';
import TeamEventsDao from '../dao/TeamEventsDao';
import { PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const teamEventAttendanceDao = new TeamEventAttendanceDao();

/**
 * Gets all team events and their attendees and requests. If the user is not a
 * lead or admin, then an error is thrown.
 * @param user
 * @returns a list of the current team events
 */
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

/**
 * Gets all team events and their relevant information.
 * @returns a list of the current team events
 */
export const getAllTeamEventInfo = async (): Promise<TeamEventInfo[]> =>
  TeamEventsDao.getAllTeamEventInfo();

/**
 * Creates a team event from a TeamEventInfo object which contains the name,
 * date, credits, hours, and whether it is a community event or not.
 * @param teamEventInfo the information about the team event
 * @param user the user creating the team event
 * @returns the created team event
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
 * Deletes a team event and all of its attendees and requests. If the user is
 * not a lead or admin, then an error is thrown.
 * @param uuid the uuid of the team event to delete
 * @param user the user deleting the team event
 * @returns the deleted team event
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
 * Updates a team event using a TeamEventInfo object. If the user is not a lead
 * or admin, then an error is thrown.
 * @param teamEventInfo the information about the team event
 * @param user the user updating the team event
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
 * Submits a team event attendance request for a user given a TeamEventAttendance
 * object. If the user is not the same as the member in the request, then an
 * error is thrown.
 * @param request the TeamEventAttendance object
 * @param user the user submitting the request
 * @returns the created team event attendance
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
  const updatedteamEvent = { ...request, pending: true };
  const teamEventAttendance =
    await teamEventAttendanceDao.createTeamEventAttendance(updatedteamEvent);
  return teamEventAttendance;
};

/**
 * Gets a team event's informaiton, along with its pending and accepted requests
 * given its uuid. If the user is not a lead or admin, then an error is thrown.
 * @param uuid the uuid of the team event
 * @param user the user submitting the request
 * @returns the team event
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
    attendees: (
      await teamEventAttendanceDao.getTeamEventAttendanceByEventId(teamEvent.uuid)
    ).filter((attendance) => !attendance.pending),
    requests: (await teamEventAttendanceDao.getTeamEventAttendanceByEventId(teamEvent.uuid)).filter(
      (attendance) => attendance.pending
    )
  };
};

/**
 * Deletes all team events and their attendees and requests. If the user is not
 * a lead or admin, then an error is thrown.
 * @param user the user submitting the request
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

/**
 * Deletes a team event attendance request given its uuid. If the user is not a
 * lead or admin, then an error is thrown.
 * @param uuid the uuid of the team event attendance to delete
 * @param user the user deleting the team event attendance
 * @returns the deleted team event attendance
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
