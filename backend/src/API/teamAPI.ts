import { v4 as uuidv4 } from 'uuid';
import PermissionsManager from '../utils/permissionsManager';
import { Team } from '../types/DataTypes';
import { BadRequestError, PermissionError } from '../utils/errors';
import MembersDao from '../dao/MembersDao';

const membersDao = new MembersDao();

export const allTeams = (): Promise<readonly Team[]> => MembersDao.getAllTeams();

/**
 * Updates a current team if exists, otherwise creates a new team. Adds the team to the
 * subteams or formerSubteams field of any current members or former members, respectively.
 * @param team - The Team object used to update team members.
 * @returns - A promise that resolves when the update is complete.
 */
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

/**
 * Updates the subteams field of any new members or removed members of a team.
 * @param team - The Team object that will be used to update current members.
 * @param oldTeam - The Team object that represents the old team.
 * @returns A promise that resolves when the update is complete.
 */
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
      await membersDao.setMember(updatedMember.email, updatedMember);
    })
  );

  await Promise.all(
    deletedMembers.map(async (member) => {
      const updatedMember = {
        ...member,
        subteams: member.subteams.filter((subteam) => subteam !== team.name)
      };
      membersDao.setMember(updatedMember.email, updatedMember);
    })
  );
};

/**
 * Updates the formerSubteams field of any new former members or removed former members of a team.
 * @param team - The Team object that will be used to update former members.
 * @param oldTeam - The Team object that represents the old team.
 * @returns A promise that resolves when the update is complete.
 */
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
      await membersDao.setMember(updatedMember.email, updatedMember);
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
      await membersDao.setMember(updatedMember.email, updatedMember);
    })
  );
};

/**
 * Creates a team by adding the team to the subteam or formerSubteam field of all members or
 * past members, respectively.
 * @param teamBody - The Team object that will be created.
 * @param member - The IdolMember that is requesting to set the team.
 * @returns A promise that resolves to the created Team object.
 */
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

/**
 * Deletes a team by removing the team from the subteams or formerSubteams field of all members,
 * leaders, and formerMembers of the team.
 * @param teamBody - The Team object that will be deleted.
 * @param member - The IdolMember that is requesting to delete the team.
 * @returns A promise that resolves to the deleted Team object.
 */
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
