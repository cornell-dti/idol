import { Member } from '../DataTypes';
import { DBAllMembersResult, DBMemberResult } from '../DBResultTypes';
import { db } from '../firebase';

export default class MembersDao {
  static async getAllMembers(): Promise<DBAllMembersResult> {
    const members: Member[] = await db
      .collection('members')
      .get()
      .then((vals) => vals.docs.map((doc) => doc.data()) as Member[]);
    return { members, isSuccessful: true };
  }

  static async getMember(email: string): Promise<DBMemberResult> {
    const member = (await (
      await db.doc(`members/${email}`).get()
    ).data()) as Member;
    return { member, isSuccessful: true };
  }

  static async deleteMember(email: string): Promise<DBMemberResult> {
    return db
      .doc(`members/${email}`)
      .delete()
      .then(() => ({ isSuccessful: true, member: null! }))
      .catch((reason) => ({
        isSuccessful: false,
        error: `Unable to to delete member for reason: ${reason}`,
        member: null!
      }));
  }

  static async setMember(
    email: string,
    member: Member
  ): Promise<DBMemberResult> {
    return db
      .doc(`members/${email}`)
      .set(member)
      .then(() => ({ isSuccessful: true, member }))
      .catch((reason) => ({
        isSuccessful: false,
        error: `Unable to edit member for reason: ${reason}`,
        member
      }));
  }

  static async updateMember(
    email: string,
    member: Member
  ): Promise<DBMemberResult> {
    return db
      .doc(`members/${email}`)
      .update(member)
      .then(() => ({ isSuccessful: true, member }))
      .catch((reason) => ({
        isSuccessful: false,
        error: `Unable to edit member for reason: ${reason}`,
        member
      }));
  }
}
