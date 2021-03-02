import { Role } from './DataTypes';

export const allRoles: Role[] = [
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
