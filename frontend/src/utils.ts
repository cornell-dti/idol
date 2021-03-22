export const getNetIDFromEmail = (email: string): string => email.split('@')[0];

export const getRoleDescriptionFromRoleID = (role: Role): RoleDescription => {
  switch (role) {
    case 'lead':
      return 'Lead';
    case 'admin':
      return 'Admin';
    case 'tpm':
      return 'Technical PM';
    case 'pm':
      return 'Product Manager';
    case 'developer':
      return 'Developer';
    case 'designer':
      return 'Designer';
    case 'business':
      return 'Business Analyst';
    default:
      throw new Error();
  }
};
