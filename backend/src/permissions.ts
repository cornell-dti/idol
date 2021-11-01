import { adminCollection } from './firebase';

export const allRoles: readonly Role[] = ['lead', 'tpm', 'pm', 'developer', 'designer'];

export class PermissionsManager {
  static async canEditMembers(mem: IdolMember): Promise<boolean> {
    return mem.role === 'lead' || this.isAdmin(mem);
  }

  static async canDeploySite(mem: IdolMember): Promise<boolean> {
    return mem.role === 'lead' || this.isAdmin(mem);
  }

  static async canEditSignIn(mem: IdolMember): Promise<boolean> {
    return mem.role === 'lead' || this.isAdmin(mem);
  }

  static async canEditTeams(mem: IdolMember): Promise<boolean> {
    return mem.role === 'lead' || this.isAdmin(mem);
  }

  static async canReviewChanges(mem: IdolMember): Promise<boolean> {
    return mem.role === 'lead' || this.isAdmin(mem);
  }

  static async canGetShoutouts(mem: IdolMember): Promise<boolean> {
    return mem.role === 'lead' || this.isAdmin(mem);
  }

  static async canEditTeamEvent(mem: IdolMember): Promise<boolean> {
    return mem.role === 'lead' || this.isAdmin(mem);
  }

  public static async isAdmin(mem: IdolMember): Promise<boolean> {
    const member = (await adminCollection.doc(mem.email).get()).data();
    return mem.role === 'lead' || member !== undefined;
  }
}
