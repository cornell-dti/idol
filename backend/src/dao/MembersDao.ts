import { memberCollection } from '../firebase';

export default class MembersDao {
  static async getAllMembers(): Promise<IdolMember[]> {
    return memberCollection
      .get()
      .then((vals) => vals.docs.map((it) => it.data()));
  }

  static async getMember(email: string): Promise<IdolMember | undefined> {
    return (await memberCollection.doc(email).get()).data();
  }

  static async deleteMember(email: string): Promise<void> {
    await memberCollection.doc(email).delete();
  }

  static async setMember(
    email: string,
    member: IdolMember
  ): Promise<IdolMember> {
    await memberCollection.doc(email).set(member);
    return member;
  }

  static async updateMember(
    email: string,
    member: IdolMember
  ): Promise<IdolMember> {
    await memberCollection.doc(email).update(member);
    return member;
  }
}
