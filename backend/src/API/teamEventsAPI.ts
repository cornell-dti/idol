import TeamEventsDao from '../dao/TeamEventsDao';
import { TeamEvent } from '../dataTypes';
import { PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissions';

export const getAllTeamEvents = async (user: IdolMember): Promise<TeamEvent[]> => {
  const canCreateTeamEvent = await PermissionsManager.canEditTeamEvent(user);
  if (!canCreateTeamEvent) throw new PermissionError('does not have permissions');
  return TeamEventsDao.getAllTeamEvents();
};

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
  // if (!PermissionsManager.canEditTeamEvent(user)) {
  //   throw new PermissionError("You don't have permission to update a team event!");
  // }
  await TeamEventsDao.updateTeamEvent(teamEvent);
  return teamEvent;
};

export const getTeamEvent = async (uuid: string, user: IdolMember): Promise<TeamEvent> =>
  TeamEventsDao.getTeamEvent(uuid);
