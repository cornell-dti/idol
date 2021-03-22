export const allRoles: readonly Role[] = [
  'lead',
  'admin',
  'tpm',
  'pm',
  'developer',
  'designer'
];

export class PermissionsManager {
  static canEditMembers(role: Role): boolean {
    if (role === 'lead' || role === 'admin') {
      return true;
    }
    return false;
  }

  static canEditTeams(role: Role): boolean {
    if (role === 'lead' || role === 'admin') {
      return true;
    }
    return false;
  }
}
