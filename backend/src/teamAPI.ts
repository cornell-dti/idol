import { teamCollection } from './firebase';
import { PermissionsManager } from './permissions';
import { Team } from './DataTypes';
import TeamsDao from './dao/TeamsDao';
import { BadRequestError, NotFoundError, PermissionError } from './errors';
import MembersDao from './dao/MembersDao';

export const allTeams = (): Promise<readonly Team[]> => TeamsDao.getAllTeams();

const updateTeamMembers = async (team: Team): Promise<void> => {
  const oldTeam = await TeamsDao.getTeam(team.uuid);
  let newMembers: IdolMember[] = [];
  let deletedMembers: IdolMember[] = [];

 if (oldTeam != null){
  let oldTeamMembers = [...oldTeam.leaders, ...oldTeam.members];
  let newTeamMembers = [...team.leaders, ...team.members];
   for (let member of newTeamMembers) {
    if (!oldTeamMembers.includes(member)){
      newMembers.push(member);
    }
   }
   for (let member of oldTeamMembers) {
    if (!newTeamMembers.includes(member)){
      deletedMembers.push(member);
    }
  } 
}else {
    newMembers = [...team.leaders, ...team.members];
  }

  for (let member of newMembers) {
    let updatedMember = { ...member };
    updatedMember.subteam = team.name;
    MembersDao.setMember(updatedMember.email, updatedMember);
  }
  for (let member of deletedMembers) {
    let updatedMember = { ...member };
    updatedMember.subteam = '';
    MembersDao.setMember(updatedMember.email, updatedMember);
  }
};

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

  return updateTeamMembers(teamBody).then(() => TeamsDao.setTeam(teamBody));
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
  //await TeamsDao.deleteTeam(teamBody.uuid);
  //return teamBody;
  return updateTeamMembers({ ...teamBody, members: [], leaders: [] }).then(() => TeamsDao.setTeam(teamBody));
};
