import TeamEventsDao from "./dao/TeamEventsDao";
import { TeamEvent } from "./DataTypes";
import { PermissionError } from "./errors";
import { teamEventsCollection } from "./firebase";
import { PermissionsManager } from "./permissions";

const checkIfDocExists = async (id: string): Promise<boolean> =>
  (await teamEventsCollection.doc(id).get()).exists;

export const teamEventExists: (id: string) => Promise<boolean> = checkIfDocExists;

export const getAllTeamEvents = (): Promise<TeamEvent[]> => TeamEventsDao.getAllTeamEvents();

export const createTeamEvent = async (teamEvent: TeamEvent, user: IdolMember): TeamEvent {
  const canCreateTeamEvent = await PermissionsManager.canEditTeamEvent(user);
  if (!canCreateTeamEvent) throw new PermissionError('does not have permissions to create team event');
  await TeamEventsDao.createTeamEvent(teamEvent);
  return teamEvent;
}

export const deleteTeamEvent = async (teamEvent: TeamEvent, user: IdolMember): Promise<void> => {
  if (!PermissionsManager.canEditTeamEvent(user)) {
    throw new PermissionError("You don't have permission to delete a team event!");
  }
  await TeamEventsDao.deleteTeamEvent(teamEvent);
};

export const updateTeamEvent = async (teamEvemt: TeamEvent, user: IdolMember) {

}