import { LEAD_ROLES } from 'common-types/constants';
import { DISABLE_DELETE_ALL_COFFEE_CHATS } from '../consts';
import { adminCollection } from '../firebase';

export default class PermissionsManager {
  static async canEditMembers(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canNotifyMembers(mem: IdolMember): Promise<boolean> {
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

  static async canEditCoffeeChat(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  static async canEditDevPortfolio(mem: IdolMember): Promise<boolean> {
    return this.isLeadOrAdmin(mem);
  }

  public static async isAdmin(mem: IdolMember): Promise<boolean> {
    const member = (await adminCollection.doc(mem.email).get()).data();
    return LEAD_ROLES.includes(mem.role) || member !== undefined;
  }

  public static async isLeadOrAdmin(mem: IdolMember): Promise<boolean> {
    return LEAD_ROLES.includes(mem.role) || this.isAdmin(mem);
  }

  public static async isClearAllCoffeeChatsDisabled(): Promise<boolean> {
    return DISABLE_DELETE_ALL_COFFEE_CHATS;
  }

  public static async canAccessCandidateDeciderInstance(
    mem: IdolMember,
    instance: CandidateDeciderInstance
  ): Promise<boolean> {
    return (
      (await this.isAdmin(mem)) ||
      instance.authorizedMembers.some((authorizedMember) => authorizedMember.email === mem.email) ||
      instance.authorizedRoles.includes(mem.role)
    );
  }
}
