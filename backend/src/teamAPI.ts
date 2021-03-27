import { Request } from 'express';
import { teamCollection } from './firebase';
import { PermissionsManager } from './permissions';
import { Team } from './DataTypes';
import MembersDao from './dao/MembersDao';
import TeamsDao from './dao/TeamsDao';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  PermissionError
} from './errors';

export const allTeams = (): Promise<readonly Team[]> => TeamsDao.getAllTeams();

export const setTeam = async (req: Request): Promise<Team> => {
  const teamBody = req.body as Team;
  const userEmail: string = req.session?.email as string;
  const member = await MembersDao.getMember(userEmail);
  if (!member) throw new UnauthorizedError(`No user with email: ${userEmail}`);
  const canEdit = await PermissionsManager.canEditTeams(member);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to edit teams!`
    );
  }
  if (teamBody.members.length > 0 && !teamBody.members[0].email) {
    throw new BadRequestError('Malformed members on POST!');
  }
  return TeamsDao.setTeam(teamBody);
};

export const deleteTeam = async (req: Request): Promise<Team> => {
  const teamBody = req.body as Team;
  if (!teamBody.uuid || teamBody.uuid === '') {
    throw new BadRequestError("Couldn't delete team with undefined uuid!");
  }
  const userEmail: string = req.session?.email as string;
  const member = await MembersDao.getMember(userEmail);
  if (!member) throw new UnauthorizedError(`No user with email: ${userEmail}`);
  const teamSnap = await teamCollection.doc(teamBody.uuid).get();
  if (!teamSnap.exists) {
    throw new NotFoundError(`No team with uuid: ${teamBody.uuid}`);
  }
  const canEdit = await PermissionsManager.canEditTeams(member);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to delete teams!`
    );
  }
  await TeamsDao.deleteTeam(teamBody.uuid);
  return teamBody;
};
