function populateObject<T>(obj: { [s: string]: T }, func: (k: string, v: T) => T) {
  return Object.fromEntries(
    Object.entries(obj).map((pair) => {
      const [key, value] = pair;
      return [key, func(key, value)];
    })
  );
}

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
  populateObject(roles, (key, value) => {
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
    return { ...value, members: sortedMembers };
  });

const getFullRoleFromDescription = (roleDescription: RoleDescription): string => {
  switch (roleDescription) {
    case 'Technical PM':
      return 'Technical Product Manager';
    default:
      return roleDescription;
  }
};

const getGeneralRole = (role: Role): Role => {
  switch (role) {
    case 'tpm':
      return 'developer';
    case 'dev-advisor':
      return 'developer';
    default:
      return role;
  }
};

export { getFullRoleFromDescription, getGeneralRole, populateMembers, populateObject };
