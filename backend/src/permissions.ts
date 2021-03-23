import { db } from './firebase';
import { Member } from './DataTypes';

export const allRoles: readonly Role[] = [
  'lead',
  'admin',
  'tpm',
  'pm',
  'developer',
  'designer'
];

export class PermissionsManager {
  static async canEditMembers(mem: Member): Promise<boolean> {
    if (mem.role === 'lead' || (await this.isAdmin(mem))) {
      return true;
    }
    return false;
  }

  static async canEditTeams(mem: Member): Promise<boolean> {
    if (mem.role === 'lead' || (await this.isAdmin(mem))) {
      return true;
    }
    return false;
  }

  public static async isAdmin(mem: Member): Promise<boolean> {
    const member = await (await db.doc(`admins/${mem.email}`).get()).data();
    return member !== undefined;
  }
}
