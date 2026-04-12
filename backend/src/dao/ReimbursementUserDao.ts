import { reimbursementUserCollection } from '../firebase';
import BaseDao from './BaseDao';

export default class ReimbursementUserDao extends BaseDao<ReimbursementUser, ReimbursementUser> {
  constructor() {
    super(
      reimbursementUserCollection,
      async (user) => user,
      async (user) => user
    );
  }

  /**
   * Gets all reimbursement users
   * @returns A `ReimbursementUser` list with all users
   */
  async getAllUsers(): Promise<ReimbursementUser[]> {
    return this.getDocuments();
  }

  /**
   * Gets a reimbursement user by their userId
   * @param userId - The user ID
   * @returns The `ReimbursementUser` with a matching userId (null if they don't exist)
   */
  async getUser(userId: string): Promise<ReimbursementUser | null> {
    return this.getDocument(userId);
  }

  /**
   * Gets all users for a specific team
   * @param teamId - The team ID
   * @returns List of `ReimbursementUser` for the team
   */
  async getUsersByTeam(teamId: string): Promise<ReimbursementUser[]> {
    return this.getDocuments([{ field: 'teamId', comparisonOperator: '==', value: teamId }]);
  }

  /**
   * Gets all users with a specific role
   * @param role - The role ('requestor' or 'admin')
   * @returns List of `ReimbursementUser` with the specified role
   */
  async getUsersByRole(role: ReimbursementUserRole): Promise<ReimbursementUser[]> {
    return this.getDocuments([{ field: 'role', comparisonOperator: '==', value: role }]);
  }

  /**
   * Creates a new reimbursement user
   * @param user - The user data
   * @returns The newly created `ReimbursementUser`
   */
  async createUser(user: ReimbursementUser): Promise<ReimbursementUser> {
    return this.createDocument(user.userId, user);
  }

  /**
   * Updates a reimbursement user
   * @param user - The updated user data
   * @returns The updated `ReimbursementUser`
   */
  async updateUser(user: ReimbursementUser): Promise<ReimbursementUser> {
    return this.updateDocument(user.userId, user);
  }

  /**
   * Deletes a reimbursement user
   * @param userId - The user ID
   */
  async deleteUser(userId: string): Promise<void> {
    return this.deleteDocument(userId);
  }
}
