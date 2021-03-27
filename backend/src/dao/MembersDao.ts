import { db } from '../firebase';

export default class MembersDao {
  static async getAllMembers(): Promise<IdolMember[]> {
    return db
      .collection('members')
      .get()
      .then((vals) => vals.docs.map((doc) => doc.data()) as IdolMember[]);
  }

  static async getMember(email: string): Promise<IdolMember | undefined> {
    return (await db.doc(`members/${email}`).get()).data() as
      | IdolMember
      | undefined;
  }

  static async deleteMember(email: string): Promise<void> {
    await db.doc(`members/${email}`).delete();
  }

  static async setMember(
    email: string,
    member: IdolMember
  ): Promise<IdolMember> {
    await db.doc(`members/${email}`).set(member);
    return member;
  }

  static async updateMember(
    email: string,
    member: IdolMember
  ): Promise<IdolMember> {
    await db.doc(`members/${email}`).update(member);
    return member;
  }
}
