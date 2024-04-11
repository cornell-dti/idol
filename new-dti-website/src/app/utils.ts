const populateMembers = (
  roles: {
    [key: string]: {
      roleName: string;
      description: string;
      members: IdolMember[];
      order: string[];
      color: string;
    };
  },
  allMembers: IdolMember[]
): {
  [key: string]: {
    roleName: string;
    description: string;
    members: IdolMember[];
    order: string[];
    color: string;
  };
} =>
  Object.fromEntries(
    Object.entries(roles).map((role) => {
      const [key, value] = role;
      const sortedMembers = allMembers
        .filter((member) =>
          key === 'developer'
            ? member.role === 'developer' || member.role === 'tpm' || member.role === 'dev-advisor'
            : member.role === key
        )
        .sort(
          (mem1, mem2) =>
            value.order.indexOf(mem1.roleDescription) - value.order.indexOf(mem2.roleDescription)
        );
      return [key, { ...value, members: sortedMembers }];
    })
  );

const getFullRoleFromDescription = (roleDescription: RoleDescription): string => {
  switch (roleDescription) {
    case 'Technical PM':
      return 'Technical Product Manager';
    default:
      return roleDescription;
  }
};

export { getFullRoleFromDescription, populateMembers };
