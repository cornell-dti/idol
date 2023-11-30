import { adminCollection } from '../firebase';

export default class AdminsDao {
  /**
   * Gets all admin emails.
   * Returns a list of all admin emails as strings.
   */
  static async getAllAdminEmails(): Promise<string[]> {
    const snapshot = await adminCollection.get();
    return snapshot.docs.map((doc) => doc.id);
  }
}
