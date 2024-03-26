const populateMembers = (
  roles: {
    [key in Role]: {
      roleName: string;
      description: string;
      members: IdolMember[];
      order: string[];
    };
  },
  allMembers: IdolMember[]
) => {
  for (const [key, value] of Object.entries(roles)) {
    value.members = allMembers
      .filter((member) =>
        key === 'developer'
          ? member.role === 'developer' || member.role === 'tpm' || member.role === 'dev-advisor'
          : member.role === key
      )
      .sort(
        (mem1, mem2) =>
          value.order.indexOf(mem1.roleDescription) - value.order.indexOf(mem2.roleDescription)
      );
  }
};

const getFullRoleFromDescription = (roleDescription: RoleDescription): string => {
  switch (roleDescription) {
    case 'Technical PM':
      return 'Technical Product Manager';
    default:
      return roleDescription;
  }
};

export { getFullRoleFromDescription, populateMembers };
