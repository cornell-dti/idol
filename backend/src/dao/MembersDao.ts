import { db, approvedMemberCollection, memberCollection } from '../firebase';
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
}
