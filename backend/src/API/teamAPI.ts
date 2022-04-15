import { v4 as uuidv4 } from 'uuid';
import PermissionsManager from '../utils/permissions';
import { Team } from '../DataTypes';
import { BadRequestError, PermissionError } from '../utils/errors';
import MembersDao from '../dao/MembersDao';

export const allTeams = (): Promise<readonly Team[]> => MembersDao.getAllTeams();

const updateTeamMembers = async (team: Team): Promise<void> => {
  const teamCopy = { ...team };
  teamCopy.uuid = teamCopy.uuid ? teamCopy.uuid : uuidv4();
  let oldTeam = await MembersDao.getTeam(team.uuid ? team.uuid : uuidv4());
  if (!oldTeam)
    oldTeam = {
      leaders: [],
      members: [],
      name: '',
      uuid: '',
      formerMembers: []
    };

  await updateCurrentMembers(teamCopy, oldTeam);
  await updateFormerMembers(teamCopy, oldTeam);
};

const updateCurrentMembers = async (team: Team, oldTeam: Team): Promise<void> => {
  let newMembers: IdolMember[] = [];
  let deletedMembers: IdolMember[] = [];

  const oldTeamMembers = [...oldTeam.leaders, ...oldTeam.members];
  const newTeamMembers = [...team.leaders, ...team.members];
  newMembers = newTeamMembers.filter(
    (member) => !oldTeamMembers.some((m) => member.email === m.email)
  );
  deletedMembers = oldTeamMembers.filter(
    (member) => !newTeamMembers.some((m) => member.email === m.email)
  );

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

const updateFormerMembers = async (team: Team, oldTeam: Team): Promise<void> => {
  let newFormerMembers: IdolMember[] = [];
  let removedFormerMembers: IdolMember[] = [];

  newFormerMembers = team.formerMembers.filter(
    (member) => !oldTeam.formerMembers.some((m) => member.email === m.email)
  );
  removedFormerMembers = oldTeam.formerMembers.filter(
    (member) => !team.formerMembers.some((m) => member.email === m.email)
  );

  await Promise.all(
    newFormerMembers.map(async (member) => {
      const updatedMember = {
        ...member,
        formerSubteams: member.formerSubteams ? [...member.formerSubteams, team.name] : [team.name]
      };
      await MembersDao.setMember(updatedMember.email, updatedMember);
    })
  );
  await Promise.all(
    removedFormerMembers.map(async (member) => {
      const updatedMember = {
        ...member,
        formerSubteams: member.formerSubteams
          ? member.formerSubteams.filter((subteam) => subteam !== team.name)
          : []
      };
      await MembersDao.setMember(updatedMember.email, updatedMember);
    })
  );
};

export const setTeam = async (teamBody: Team, member: IdolMember): Promise<Team> => {
  const canEdit = await PermissionsManager.canEditTeams(member);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${member.email} does not have permission to edit teams!`
    );
  }
  if (teamBody.members.length > 0 && !teamBody.members[0].email) {
    throw new BadRequestError('Malformed members on POST!');
  }
  await updateTeamMembers(teamBody);
  return teamBody;
};

export const deleteTeam = async (teamBody: Team, member: IdolMember): Promise<Team> => {
  if (!teamBody.uuid || teamBody.uuid === '') {
    throw new BadRequestError("Couldn't delete team with undefined uuid!");
  }
  const canEdit = await PermissionsManager.canEditTeams(member);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${member.email} does not have permission to delete teams!`
    );
  }
  await updateTeamMembers({ ...teamBody, members: [], leaders: [], formerMembers: [] });
  return teamBody;
};
