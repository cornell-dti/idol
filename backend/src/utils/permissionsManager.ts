import { adminCollection } from '../firebase';

export default class PermissionsManager {
  static async canEditMembers(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canDeploySite(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canEditSignIn(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canEditTeams(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canReviewChanges(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canGetShoutouts(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canHideShoutouts(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canEditTeamEvent(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canEditDevPortfolio(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  public static async isAdmin(mem: IdolMember): Promise<boolean> {
    const member = (await adminCollection.doc(mem.email).get()).data();
    return mem.role === 'lead' || member !== undefined;
  }

  public static async isLeadOrAdmin(mem: IdolMember): Promise<boolean> {
    return mem.role === 'lead' || this.isAdmin(mem);
  }
}
