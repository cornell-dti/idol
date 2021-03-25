import { Member } from '../DataTypes';
import { DBAllMembersResult, DBMemberResult, DBResult } from '../DBResultTypes';
import { db } from '../firebase';

export default class MembersDao {
  static async getAllMembers(): Promise<DBAllMembersResult> {
    const members: Member[] = await db
      .collection('members')
      .get()
      .then((vals) => vals.docs.map((doc) => doc.data()) as Member[]);
    return { members, isSuccessful: true };
  }

  static async getMember(
    email: string
  ): Promise<DBResult & { member: Member }> {
    const member = (await db.doc(`members/${email}`).get()).data() as Member;
    return { member, isSuccessful: true };
  }

  static async deleteMember(email: string): Promise<DBResult> {
    return db
      .doc(`members/${email}`)
      .delete()
      .then(() => ({ isSuccessful: true } as const))
      .catch((reason) => ({
        isSuccessful: false,
        error: `Unable to to delete member for reason: ${reason}`
      }));
  }

  static async setMember(
    email: string,
    member: Member
  ): Promise<DBMemberResult> {
    return db
      .doc(`members/${email}`)
      .set(member)
      .then(() => ({ isSuccessful: true, member } as const))
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
      .then(() => ({ isSuccessful: true, member } as const))
      .catch((reason) => ({
        isSuccessful: false,
        error: `Unable to edit member for reason: ${reason}`,
        member
      }));
  }
}
