import { Request } from 'express';
import TeamEventAttendanceDao from '../dao/TeamEventAttendanceDao';
import TeamEventsDao from '../dao/TeamEventsDao';
import { BadRequestError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';
import { sendPeriodReminder, sendTECReminder } from './mailAPI';

const teamEventAttendanceDao = new TeamEventAttendanceDao();

/**
 * Gets all team events and their attendees and requests.
 * @param user - the user submitting the request
 * @throws PermissionError if the user does not have permissions to get all team events
 * @returns a list of the current team events
 */
export const getAllTeamEvents = async (user: IdolMember): Promise<TeamEvent[]> => {
  const canEditTeamEvents = await PermissionsManager.canEditTeamEvent(user);
  if (!canEditTeamEvents)
    throw new PermissionError(`User with email ${user.email} cannot get all team events`);
  const teamEvents = await TeamEventsDao.getAllTeamEvents();
  return Promise.all(
    teamEvents.map(async (event) => ({
      ...event,
      requests: await teamEventAttendanceDao.getTeamEventAttendanceByEventId(event.uuid)
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
 * @param teamEventInfo - the information about the team event
 * @param user - the user creating the team event
 * @throws PermissionError if the user does not have permissions to create team events
 * @returns the created team event
 */
export const createTeamEvent = async (
  teamEventInfo: TeamEventInfo,
  user: IdolMember
): Promise<TeamEventInfo> => {
  const canCreateTeamEvent = await PermissionsManager.canEditTeamEvent(user);
  if (!canCreateTeamEvent)
    throw new PermissionError(`User with email ${user.email} cannot create team events`);
  await TeamEventsDao.createTeamEvent(teamEventInfo);
  return teamEventInfo;
};

/**
 * Deletes a team event and all of its attendees and requests.
 * @param uuid - the uuid of the team event to delete
 * @param user - the user deleting the team event
 * @throws PermissionError if the user does not have permissions to delete team events
 * @returns the deleted team event
 */
export const deleteTeamEvent = async (uuid: string, user: IdolMember): Promise<void> => {
  if (!PermissionsManager.canEditTeamEvent(user)) {
    throw new PermissionError(`User with email ${user.email} cannot delete team events`);
  }
  const teamEvent = await TeamEventsDao.getTeamEvent(uuid);
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
 * Updates a team event using a TeamEventInfo object.
 * @param teamEventInfo - the information about the team event
 * @param user - the user updating the team event
 * @throws PermissionError if the user does not have permissions to update team events
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
 * object.
 * @param request - the TeamEventAttendance object
 * @param user - the user submitting the request
 * @throws PermissionError if the user's email does not match the member's email in the request
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
  const updatedteamEvent = { ...request, status: 'pending' as Status };
  const teamEventAttendance =
    await teamEventAttendanceDao.createTeamEventAttendance(updatedteamEvent);
  return teamEventAttendance;
};

/**
 * Gets a team event's informaiton, along with its pending and accepted requests
 * given its uuid.
 * @param uuid - the uuid of the team event
 * @param user - the user submitting the request
 * @throws PermissionError if the user does not have permissions to get full team events
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
    requests: await teamEventAttendanceDao.getTeamEventAttendanceByEventId(teamEvent.uuid)
  };
};

/**
 * Deletes all team events and their attendees and requests.
 * @param user - the user submitting the request
 * @throws PermissionError if the user does not have permissions to delete all team events
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
 * Gets all the team event attendance requests for a user.
 * @param user - the user submitting the request
 * @returns the team event attendance requests submitted by the user
 */
export const getTeamEventAttendanceByUser = async (
  user: IdolMember
): Promise<TeamEventAttendance[]> => teamEventAttendanceDao.getTeamEventAttendanceByUser(user);

/**
 * Updates a team event attendance request given a TeamEventAttendance object.
 * @param teamEventAttendance - the TeamEventAttendance object
 * @param user - the user submitting the request
 * @throws PermissionError if the user does not have permissions to update team events attendance
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
 * Deletes a team event attendance request given its uuid.
 * @param uuid - the uuid of the team event attendance to delete
 * @param user - the user deleting the team event attendance
 * @throws PermissionError if the user does not have permissions to delete team events attendance
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

/**
 * Reminds a member about completing enough TECs this semester.
 * @param req - the post request being made by the user
 * @param member - the member being notified
 * @param user - the user trying to notify the member
 * @throws PermissionError if the user does not have permissions to notify members
 * @returns the body of the request, which contains details about the member being notified
 */
export const notifyMemberTeamEvents = async (
  req: Request,
  endOfPeriodReminder: boolean,
  member: IdolMember,
  user: IdolMember
): Promise<unknown> => {
  const canNotify = await PermissionsManager.canNotifyMembers(user);
  if (!canNotify) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to notify members!`
    );
  }
  if (!member.email || member.email === '') {
    throw new BadRequestError("Couldn't notify member with undefined email!");
  }
  const responseBody = await sendTECReminder(req, endOfPeriodReminder, member);
  return responseBody.data;
};

/**
 * Reminds a member about completing enough TECs this period.
 * @param req - the post request being made by the user
 * @param member - the member being notified
 * @param user - the user trying to notify the member
 * @throws PermissionError if the user does not have permissions to notify members
 * @returns the body of the request, which contains details about the member being notified
 */
export const notifyMemberPeriod = async (
  req: Request,
  member: IdolMember,
  user: IdolMember
): Promise<unknown> => {
  const canNotify = await PermissionsManager.canNotifyMembers(user);
  if (!canNotify) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to notify members!`
    );
  }
  if (!member.email || member.email === '') {
    throw new BadRequestError("Couldn't notify member with undefined email!");
  }
  const responseBody = await sendPeriodReminder(req, member);
  return responseBody.data;
};
