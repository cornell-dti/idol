import { adminCollection } from '../firebase';

export default class AdminsDao {
  static async getAllAdminEmails(): Promise<string[]> {
    const snapshot = await adminCollection.get();
    return snapshot.docs.map((doc) => doc.id);
  }
}
