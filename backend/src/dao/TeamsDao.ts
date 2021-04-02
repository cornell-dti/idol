import { v4 as uuidv4 } from 'uuid';
import { Team, DBTeam } from '../DataTypes';
import { NotFoundError } from '../errors';
import { db, memberCollection, teamCollection } from '../firebase';

export default class TeamsDao {
  static async getAllTeams(): Promise<Team[]> {
    const teamRefs = await teamCollection.get();
    return Promise.all(
      teamRefs.docs.map(async (teamRef) => {
        const { uuid, name, leaders, members } = teamRef.data();
        return {
          uuid,
          name,
          leaders: await Promise.all(
            leaders.map((ref) =>
              ref.get().then((doc) => doc.data() as IdolMember)
            )
          ),
          members: await Promise.all(
            members.map((ref) =>
              ref.get().then((doc) => doc.data() as IdolMember)
            )
          )
        };
      })
    );
  }

  static async setTeam(team: Team): Promise<Team> {
    const teamRef: DBTeam = {
      uuid: team.uuid ? team.uuid : uuidv4(),
      name: team.name,
      leaders: team.leaders.map((leader) => memberCollection.doc(leader.email)),
      members: team.members.map((mem) => memberCollection.doc(mem.email))
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
    await teamCollection.doc(teamRef.uuid).set(teamRef);
    return { ...team, uuid: teamRef.uuid };
  }

  static async deleteTeam(teamUuid: string): Promise<void> {
    await db.doc(`teams/${teamUuid}`).delete();
  }
}
