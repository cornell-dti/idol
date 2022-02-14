import TeamEventsDao from './dao/TeamEventsDao';
import { TeamEvent } from './DataTypes';
import { PermissionError } from './errors';
import PermissionsManager from './permissions';

export const getAllTeamEvents = (user: IdolMember): Promise<TeamEvent[]> => 
  // const canCreateTeamEvent = await PermissionsManager.canEditTeamEvent(user);
  // if (!canCreateTeamEvent) throw new PermissionError('does not have permissions');
   TeamEventsDao.getAllTeamEvents()
;

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
  console.log("in update");
  console.log(teamEvent);
  // if (!PermissionsManager.canEditTeamEvent(user)) {
  //   throw new PermissionError("You don't have permission to update a team event!");
  // }
  console.log("here!!!!");
  await TeamEventsDao.updateTeamEvent(teamEvent);
  return teamEvent;
};
