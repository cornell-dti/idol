import BaseDao from './BaseDao';
import { authRoleCollection } from '../firebase';
import { AuthRoleDoc } from '../types/AuthTypes';

export default class AuthRoleDao extends BaseDao<AuthRoleDoc, AuthRoleDoc> {
  constructor() {
    super(
      authRoleCollection,
      async (doc) => doc,
      async (data) => data
    );
  }

  async getAuthRole(user: IdolMember): Promise<AuthRoleDoc | undefined> {
    const authRoleData = await this.getDocument(user.email);
    return authRoleData || undefined;
  }
}
