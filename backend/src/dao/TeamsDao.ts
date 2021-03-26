import { v4 as uuidv4 } from 'uuid';
import { Team, DBTeam } from '../DataTypes';
import { NotFoundError } from '../errors';
import { db } from '../firebase';
import { materialize } from '../util';

export default class TeamsDao {
  static async getAllTeams(): Promise<Team[]> {
    const teamRefs = await db.collection('teams').get();
    return Promise.all(
      teamRefs.docs.map((teamRef) => materialize(teamRef.data()))
    );
  }

  static async setTeam(team: Team): Promise<Team> {
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
      throw new NotFoundError(
        "Couldn't create team from members that don't exist!"
      );
    }
    await db.doc(`teams/${teamRef.uuid}`).set(teamRef);
    return { ...team, uuid: teamRef.uuid };
  }

  static async deleteTeam(teamUuid: string): Promise<void> {
    await db.doc(`teams/${teamUuid}`).delete();
  }
}
