/**
 * Returns a new object with the results of calling a provided function on each key-value pair.
 *
 * @param obj some object whose values all have the same type.
 * @param func a function to execute for each key-value pair. Its return value is the new value
 * associated with the key passed in as the argument.
 * @returns a new object with the same keys but values as the result of the callback function.
 */
export function populateObject<T>(obj: { [s: string]: T }, func: (k: string, v: T) => T) {
  return Object.fromEntries(
    Object.entries(obj).map((pair) => {
      const [key, value] = pair;
      return [key, func(key, value)];
    })
  );
}

export const populateMembers = (
  roles: {
    [key: string]: {
      roleName: string;
      description: string;
      members: IdolMember[];
      roles: string[];
      color: string;
    };
  },
  allMembers: IdolMember[]
): {
  [key: string]: {
    roleName: string;
    description: string;
    members: IdolMember[];
    roles: string[];
    color: string;
  };
} =>
  populateObject(roles, (key, value) => {
    const sortedMembers = allMembers
      .filter((member) => value.roles.includes(member.role))
      .sort((mem1, mem2) => value.roles.indexOf(mem1.role) - value.roles.indexOf(mem2.role));
    return { ...value, members: sortedMembers };
  });

export const getGeneralRole = (role: Role): GeneralRole => {
  switch (role) {
    case 'ops-lead':
      return 'lead';
    case 'product-lead':
      return 'lead';
    case 'dev-lead':
      return 'lead';
    case 'design-lead':
      return 'lead';
    case 'business-lead':
      return 'lead';
    case 'tpm':
      return 'developer';
    case 'apm':
      return 'pm';
    case 'pm-advisor':
      return 'pm';
    case 'dev-advisor':
      return 'developer';
    case 'design-advisor':
      return 'designer';
    case 'business-advisor':
      return 'business';
    case 'alum':
      return 'developer';
    default:
      return role as GeneralRole;
  }
};
