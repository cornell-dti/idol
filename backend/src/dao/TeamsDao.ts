import { v4 as uuidv4 } from 'uuid';
import { Team, DBTeam } from '../DataTypes';
import { db } from '../firebase';
import { materialize } from '../util';
import { DBAllTeamsResult, DBTeamResult } from '../DBResultTypes';

export default class TeamsDao {
  static async getAllTeams(): Promise<DBAllTeamsResult> {
    const teamRefs = await db.collection('teams').get();
    const teams = await Promise.all(
      teamRefs.docs.map((teamRef) => materialize(teamRef.data()))
    );
    return { isSuccessful: true, teams };
  }

  static async setTeam(team: Team): Promise<DBTeamResult> {
    const teamRef: DBTeam = {
      uuid: team.uuid ? team.uuid : uuidv4(),
      name: team.name,
      leaders: team.leaders.map((leader) => db.doc(`members/${leader.email}`)),
      members: team.members.map((mem) => db.doc(`members/${mem.email}`))
    };
    const existRes = await Promise.all(
      teamRef.leaders
        .concat(teamRef.members)
        .map((ref) => ref.get().then((val) => val.exists))
    );
    if (existRes.findIndex((val) => val === false) !== -1) {
      return {
        isSuccessful: false,
        error: "Couldn't create team from members that don't exist!",
        team
      };
    }
    return db
      .doc(`teams/${teamRef.uuid}`)
      .set(teamRef)
      .then(() => {
        return {
          isSuccessful: true,
          team: { ...team, uuid: teamRef.uuid }
        };
      })
      .catch((reason) => {
        return {
          isSuccessful: false,
          error: `Couldn't edit team for reason: ${reason}`,
          team: { ...team, uuid: teamRef.uuid }
        };
      });
  }

  static async deleteTeam(teamUuid: string): Promise<DBTeamResult> {
    return db
      .doc(`teams/${teamUuid}`)
      .delete()
      .then(() => {
        return {
          isSuccessful: true,
          team: null!
        };
      })
      .catch((reason) => {
        return {
          isSuccessful: false,
          error: `Couldn't delete team for reason: ${reason}`,
          team: null!
        };
      });
  }
}
