import { teamCollection } from './firebase';
import { PermissionsManager } from './permissions';
import { Team } from './DataTypes';
import TeamsDao from './dao/TeamsDao';
import { BadRequestError, NotFoundError, PermissionError } from './errors';

export const allTeams = (): Promise<readonly Team[]> => TeamsDao.getAllTeams();

export const setTeam = async (
  teamBody: Team,
  member: IdolMember
): Promise<Team> => {
  const canEdit = await PermissionsManager.canEditTeams(member);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${member.email} does not have permission to edit teams!`
    );
  }
  if (teamBody.members.length > 0 && !teamBody.members[0].email) {
    throw new BadRequestError('Malformed members on POST!');
  }
  return TeamsDao.setTeam(teamBody);
};

export const deleteTeam = async (
  teamBody: Team,
  member: IdolMember
): Promise<Team> => {
  if (!teamBody.uuid || teamBody.uuid === '') {
    throw new BadRequestError("Couldn't delete team with undefined uuid!");
  }
  const teamSnap = await teamCollection.doc(teamBody.uuid).get();
  if (!teamSnap.exists) {
    throw new NotFoundError(`No team with uuid: ${teamBody.uuid}`);
  }
  const canEdit = await PermissionsManager.canEditTeams(member);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${member.email} does not have permission to delete teams!`
    );
  }
  await TeamsDao.deleteTeam(teamBody.uuid);
  return teamBody;
};
