import BaseDao from './BaseDao';
import { authRoleCollection } from '../firebase';
import { AuthRoleDoc, AuthRole } from '../types/DataTypes';

export default class AuthRoleDao extends BaseDao<AuthRoleDoc, AuthRoleDoc> {
  constructor() {
    super(
      authRoleCollection,
      async (doc) => doc,
      async (data) => data
    );
  }

  async getAuthRole(user: IdolMember): Promise<AuthRole | undefined> {
    const authRoleData = await this.getDocument(user.email);
    return authRoleData?.role;
  }
}
