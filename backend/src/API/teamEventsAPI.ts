import TeamEventAttendanceDao from '../dao/TeamEventAttendanceDao';
import TeamEventsDao from '../dao/TeamEventsDao';
import { PermissionError } from '../utils/errors';

const teamEventAttendanceDao = new TeamEventAttendanceDao();

export const getAllTeamEvents = async (user: IdolMember): Promise<TeamEvent[]> => {
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
  await TeamEventsDao.createTeamEvent(teamEventInfo);
  return teamEventInfo;
};

export const deleteTeamEvent = async (uuid: string, user: IdolMember): Promise<void> => {
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
  await teamEventAttendanceDao.updateTeamEventAttendance(teamEventAttendance);
  return teamEventAttendance;
};

export const deleteTeamEventAttendance = async (uuid: string, user: IdolMember): Promise<void> => {
  await teamEventAttendanceDao.deleteTeamEventAttendance(uuid);
};
