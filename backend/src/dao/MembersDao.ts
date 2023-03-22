import { db, approvedMemberCollection, memberCollection } from '../firebase';
import { Team } from '../types/DataTypes';
import { archivedMembersBySemesters, archivedMembersByEmail } from '../members-archive';

export default class MembersDao {
  static async getAllMembers(fromApproved: boolean): Promise<IdolMember[]> {
    return (fromApproved ? approvedMemberCollection : memberCollection)
      .get()
      .then((vals) => vals.docs.map((it) => it.data()));
  }

  static async getMembersFromAllSemesters(): Promise<Record<string, readonly IdolMember[]>> {
    return {
      'Current Semester': await this.getAllMembers(true),
      ...archivedMembersBySemesters
    };
  }

  static async getMember(email: string): Promise<IdolMember | undefined> {
    return memberCollection
      .doc(email)
      .get()
      .then((docRef) => docRef.data());
  }

  static async getCurrentOrPastMemberByEmail(email: string): Promise<IdolMember | undefined> {
    // Although it might require an extra async lookup, this is necessary for correctness,
    // because we want to get the latest info of the member that are also a member in the past.
    const currentMember = (await memberCollection.doc(email).get()).data();
    if (currentMember != null) return currentMember;
    return archivedMembersByEmail[email];
  }

  static async deleteMember(email: string): Promise<void> {
    await memberCollection.doc(email).delete();
  }

  static async setMember(email: string, member: IdolMember): Promise<IdolMember> {
    await memberCollection.doc(email).set(member);
    return member;
  }

  static async updateMember(email: string, member: IdolMember): Promise<IdolMember> {
    await memberCollection.doc(email).update(member);
    return member;
  }

  /**
   * @param emails a list of emails to update.
   * It can refer to either an email that needs to be updated or the one that needs to be deleted.
   * This function will automatically decide whether to update or delete the documents in the approved
   * collection based on whether they exist in the original collection.
   */
  static async approveMemberInformationChanges(emails: readonly string[]): Promise<void> {
    const batch = db.batch();
    const approvedMemberInfoList = await Promise.all(
      emails.map(async (email) => {
        const data = (await memberCollection.doc(email).get()).data();
        if (data == null) batch.delete(approvedMemberCollection.doc(email));
        return data;
      })
    );
    approvedMemberInfoList.forEach((member) => {
      if (member != null) {
        batch.set(approvedMemberCollection.doc(member.email), member);
      }
    });
    await batch.commit();
  }

  /**
   * Similar to approveMemberInformationChanges, but reverts the change in
   * memberCollection using the data in approvedMemberCollection
   */
  static async revertMemberInformationChanges(emails: readonly string[]): Promise<void> {
    const batch = db.batch();
    const latestMemberInfoList = await Promise.all(
      emails.map(async (email) => {
        const data = (await approvedMemberCollection.doc(email).get()).data();
        if (data == null) batch.delete(memberCollection.doc(email));
        return data;
      })
    );
    latestMemberInfoList.forEach((member) => {
      if (member != null) {
        batch.set(memberCollection.doc(member.email), member);
      }
    });
    await batch.commit();
  }

  static async getAllTeams(): Promise<Team[]> {
    const allMembers = await MembersDao.getAllMembers(false);
    const teamsMap = new Map<string, Team>();

    function getTeam(name: string) {
      let team = teamsMap.get(name);
      if (team != null) return team;
      team = { uuid: name, name, leaders: [], members: [], formerMembers: [] };
      teamsMap.set(name, team);
      return team;
    }

    allMembers.forEach((member) => {
      (member.formerSubteams || []).forEach((name) => {
        getTeam(name).formerMembers.push(member);
      });
      (member.subteams || []).forEach((name) => {
        const team = getTeam(name);
        if (member.role === 'pm' || member.role === 'tpm') {
          team.leaders.push(member);
        } else {
          team.members.push(member);
        }
      });
    });

    return Array.from(teamsMap.values());
  }

  static async getTeam(id: string): Promise<Team | null> {
    const allMembers = await MembersDao.getAllMembers(false);
    const team: Team = { uuid: id, name: id, leaders: [], members: [], formerMembers: [] };

    allMembers.forEach((member) => {
      (member.formerSubteams || []).forEach((name) => {
        if (name !== team.name) return;
        team.formerMembers.push(member);
      });
      (member.subteams || []).forEach((name) => {
        if (name !== team.name) return;
        if (member.role === 'pm' || member.role === 'tpm') {
          team.leaders.push(member);
        } else {
          team.members.push(member);
        }
      });
    });

    if (team.leaders.length + team.members.length + team.formerMembers.length === 0) return null;
    return team;
  }
}
