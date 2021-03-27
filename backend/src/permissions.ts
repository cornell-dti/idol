import { db } from './firebase';

export const allRoles: readonly Role[] = [
  'lead',
  'tpm',
  'pm',
  'developer',
  'designer'
];

export class PermissionsManager {
  static async canEditMembers(mem: IdolMember): Promise<boolean> {
    if (mem.role === 'lead' || (await this.isAdmin(mem))) {
      return true;
    }
    return false;
  }

  static async canEditTeams(mem: IdolMember): Promise<boolean> {
    if (mem.role === 'lead' || (await this.isAdmin(mem))) {
      return true;
    }
    return false;
  }

  public static async isAdmin(mem: IdolMember): Promise<boolean> {
    const member = await (await db.doc(`admins/${mem.email}`).get()).data();
    return member !== undefined;
  }
}
