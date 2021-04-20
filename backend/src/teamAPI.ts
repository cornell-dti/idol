import { v4 as uuidv4 } from 'uuid';
import { teamCollection } from './firebase';
import { PermissionsManager } from './permissions';
import { Team } from './DataTypes';
import TeamsDao from './dao/TeamsDao';
import { BadRequestError, NotFoundError, PermissionError } from './errors';
import MembersDao from './dao/MembersDao';

export const allTeams = (): Promise<readonly Team[]> => TeamsDao.getAllTeams();

const updateTeamMembers = async (team: Team): Promise<void> => {
  const teamCopy = team;
  teamCopy.uuid = team.uuid ? team.uuid : uuidv4();

  const oldTeam = await TeamsDao.getTeam(team.uuid);
  let newMembers: IdolMember[] = [];
  let deletedMembers: IdolMember[] = [];

  if (oldTeam != null) {
    const oldTeamMembers = [...oldTeam.leaders, ...oldTeam.members];
    const newTeamMembers = [...team.leaders, ...team.members];
    newMembers = newTeamMembers.filter(
      (member) => !oldTeamMembers.includes(member)
    );
    deletedMembers = oldTeamMembers.filter(
      (member) => !newTeamMembers.includes(member)
    );
  } else {
    newMembers = [...team.leaders, ...team.members];
  }

  await Promise.all(
    newMembers.map(async (member) => {
      const updatedMember = {
        ...member,
        subteams: [...member.subteams, team.name]
      };
      await MembersDao.setMember(updatedMember.email, updatedMember);
    })
  );

  await Promise.all(
    deletedMembers.map(async (member) => {
      const updatedMember = {
        ...member,
        subteams: member.subteams.filter((subteam) => subteam !== team.name)
      };
      MembersDao.setMember(updatedMember.email, updatedMember);
    })
  );
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
  return updateTeamMembers({ ...teamBody, members: [], leaders: [] }).then(() =>
    TeamsDao.deleteTeam(teamBody)
  );
};
