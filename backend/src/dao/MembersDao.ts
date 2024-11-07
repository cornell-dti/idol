import {
  db,
  approvedMemberCollection,
  memberCollection,
  memberPropertiesCollection
} from '../firebase';
import { DBMemberProperties, Team } from '../types/DataTypes';
import { archivedMembersBySemesters, archivedMembersByEmail } from '../members-archive';
import BaseDao from './BaseDao';
import { allMemberImages } from '../API/imageAPI';

export default class MembersDao extends BaseDao<IdolMember, IdolMember> {
  constructor() {
    super(
      memberCollection,
      async (member) => member,
      async (member) => member
    );
  }

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

  async deleteMember(email: string): Promise<void> {
    await this.deleteDocument(email);
  }

  async setMember(email: string, member: IdolMember): Promise<IdolMember> {
    return this.createDocument(email, member);
  }

  async updateMember(email: string, member: IdolMember): Promise<IdolMember> {
    return this.updateDocument(email, member);
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

  /**
   * Gets all teams based on the subteam and formersubteam(s) each member is on, since teams do not have
   * a collection in the database (teams are aggregated data from the members collection).
   * @returns A promise that resolves to an array of Team objects.
   */
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

  /**
   * Gets a specific team by searching through each IDOL member and saving each member of the team.
   * @param id - The name of the team
   * @returns A promise that resolves to the Team object with the specified name, or null if the team has no members.
   */
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

  /**
   * Generates an archive of all IDOL members into three categories: current, alumni, and inactive.
   * The data for each member includes additional information for display on the website.
   * @param updates - the status of IDOL members in the next semester.
   * @param semesters - the limit, if any, of the number of semesters to include in archive.
   * @returns A promise that resolves to an Archive object.
   */
  static async generateArchive(
    updates: {
      [key: string]: string[];
    },
    semesters: number | undefined
  ): Promise<{ [key: string]: string[] }> {
    const allMembers: Set<string> = new Set();
    const archive = { current: [], alumni: [], inactive: [] };

    const currentMembers = await MembersDao.getAllMembers(true);
    const images = await allMemberImages();

    const addToArchive = (returning: boolean, member: IdolMember) => {
      allMembers.add(member.netid);
      const image = images.find((image) => image.fileName.split('.')[0] === member.netid);

      let key = 'current';
      if (!returning) {
        key = Date.parse(member.graduation) < Date.now() ? 'alumni' : 'inactive';
      }

      archive[key].push({
        ...member,
        image: image ? image.url : null,
        coffeeChatLink: `mailto:${member.email}`
      });
    };

    // Each current member's netid should be found in the returning members survey.
    currentMembers.forEach((member) => {
      addToArchive(updates.returning.includes(member.netid), member);
    });

    Object.values(archivedMembersBySemesters)
      .reverse()
      .forEach((semester, index) => {
        if (!semesters || index < semesters) {
          semester.forEach((member) => {
            if (!allMembers.has(member.netid)) {
              addToArchive(false, member);
            }
          });
        }
      });

    return archive;
  }

  /**
   * Gets the properties for a specific member
   * @param email - the email of the member whose properties we want to retrieve.
   * @returns A promise that resolves to an DBMemberProperties object or undefined.
   */
  static async getMemberProperties(email: string): Promise<DBMemberProperties | undefined> {
    return memberPropertiesCollection
      .doc(email)
      .get()
      .then((docRef) => docRef.data());
  }
}
