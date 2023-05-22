import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Team } from '../types/DataTypes';
import { BadRequestError } from '../utils/errors';
import MembersDao from '../dao/MembersDao';
import { loginCheckedGet, loginCheckedPost, loginCheckedPut } from '../utils/auth';

const membersDao = new MembersDao();

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

export const setTeam = async (teamBody: Team, member: IdolMember): Promise<Team> => {
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
  await updateTeamMembers({ ...teamBody, members: [], leaders: [], formerMembers: [] });
  return teamBody;
};

export const teamRouter = Router();

loginCheckedGet(teamRouter, '/', async () => ({ teams: await allTeams() }), 'team');

loginCheckedPut(
  teamRouter,
  '/',
  async (req, user) => ({
    team: await setTeam(req.body, user)
  }),
  'team'
);

// TODO: should eventually make this a delete request
loginCheckedPost(
  teamRouter,
  '/',
  async (req, user) => ({
    team: await deleteTeam(req.body, user)
  }),
  'team'
);
