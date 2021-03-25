import { Request } from 'express';
import { db } from './firebase';
import { PermissionsManager } from './permissions';
import { Team, Member } from './DataTypes';
import TeamsDao from './dao/TeamsDao';
import { ErrorResponse, TeamResponse, AllTeamsResponse } from './APITypes';

export const allTeams = async (): Promise<AllTeamsResponse> => {
  const result = await TeamsDao.getAllTeams();
  return { status: 200, teams: result.teams };
};

export const setTeam = async (
  req: Request
): Promise<TeamResponse | ErrorResponse> => {
  const teamBody = req.body as Team;
  const userEmail: string = req.session?.email as string;
  const member = (await db.doc(`members/${userEmail}`).get()).data() as Member;
  const canEdit = await PermissionsManager.canEditTeams(member);
  if (!canEdit) {
    return {
      status: 403,
      error: `User with email: ${userEmail} does not have permission to edit teams!`
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
  return { status: 500, error: result.error };
};

export const deleteTeam = async (
  req: Request
): Promise<TeamResponse | ErrorResponse> => {
  const teamBody = req.body as Team;
  if (!teamBody.uuid || teamBody.uuid === '') {
    return {
      status: 400,
      error: "Couldn't delete team with undefined uuid!"
    };
  }
  const userEmail: string = req.session?.email as string;
  const member = (await db.doc(`members/${userEmail}`).get()).data() as Member;
  const teamSnap = await db.doc(`teams/${teamBody.uuid}`).get();
  if (!teamSnap.exists) {
    return {
      status: 404,
      error: `No team with uuid: ${teamBody.uuid}`
    };
  }
  const canEdit = await PermissionsManager.canEditTeams(member);
  if (!canEdit) {
    return {
      status: 403,
      error: `User with email: ${userEmail} does not have permission to delete teams!`
    };
  }
  const result = await TeamsDao.deleteTeam(teamBody.uuid);
  if (result.isSuccessful) {
    return { status: 200, team: teamBody };
  }
  return { status: 500, error: result.error };
};
