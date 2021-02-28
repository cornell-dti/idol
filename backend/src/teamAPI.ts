import { Request, Response } from 'express';
import { db } from './firebase';
import { PermissionsManager } from './permissions';
import { checkLoggedIn } from './api';
import { Team } from './DataTypes';
import TeamsDao from './dao/TeamsDao';
import { ErrorResponse, TeamResponse, AllTeamsResponse } from './APITypes';

export const allTeams = async (
  req: Request,
  res: Response
): Promise<AllTeamsResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const result = await TeamsDao.getAllTeams();
    return { status: 200, teams: result.teams };
  }
  return undefined;
};

export const setTeam = async (
  req: Request,
  res: Response
): Promise<TeamResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const teamBody = req.body as Team;
    const member = await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data();
    const canEdit = PermissionsManager.canEditTeams(member!.role);
    if (!canEdit) {
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to edit teams!`
      };
    }
    if (teamBody.leaders.length > 0 && !teamBody.leaders[0].email) {
      return {
        status: 400,
        error: 'Malformed leaders on POST!'
      };
    }
    if (teamBody.members.length > 0 && !teamBody.members[0].email) {
      return {
        status: 400,
        error: 'Malformed members on POST!'
      };
    }
    const result = await TeamsDao.setTeam(teamBody);
    if (result.isSuccessful) {
      return { status: 200, team: result.team };
    }
    return { status: 500, error: result.error! };
  }
  return undefined;
};

export const deleteTeam = async (
  req: Request,
  res: Response
): Promise<TeamResponse | ErrorResponse | undefined> => {
  if (checkLoggedIn(req, res)) {
    const teamBody = req.body as Team;
    if (!teamBody.uuid || teamBody.uuid === '') {
      return {
        status: 400,
        error: "Couldn't delete team with undefined uuid!"
      };
    }
    const member = (await (
      await db.doc(`members/${req.session!.email}`).get()
    ).data()) as any;
    const teamSnap = await await db.doc(`teams/${teamBody.uuid}`).get();
    if (!teamSnap.exists) {
      return {
        status: 404,
        error: `No team with uuid: ${teamBody.uuid}`
      };
    }
    const canEdit = PermissionsManager.canEditTeams(member.role);
    if (!canEdit) {
      return {
        status: 403,
        error: `User with email: ${
          req.session!.email
        } does not have permission to delete teams!`
      };
    }
    const result = await TeamsDao.deleteTeam(teamBody.uuid);
    if (result.isSuccessful) {
      return { status: 200, team: teamBody };
    }
    return { status: 500, error: result.error! };
  }
  return undefined;
};
