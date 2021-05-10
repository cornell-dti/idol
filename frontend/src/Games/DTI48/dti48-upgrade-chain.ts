export type SimplifiedMemberForTreeGeneration = {
  readonly netid: string;
  readonly role: Role;
  readonly subteams: readonly string[];
};

type DTI48OrganizationTree<M extends SimplifiedMemberForTreeGeneration = IdolMember> = {
  readonly member: M;
  readonly children: readonly DTI48OrganizationTree<M>[];
};

// TODO: needs to be updated whenever dev lead changes.
export const OPS_LEAD_NETID = 'ad665';
export const PRODUCT_LEAD_NETID = 'acb352';
export const BUSINESS_LEAD_NETID = 'ete26';
export const DESIGN_LEAD_NETIDS = ['ec592', 'sy629'];
export const DEV_LEAD_NETIDS = ['cph64', 'jb2375', 'my474'];

function getDirectChildrenForDTI48OrganizationTree<M extends SimplifiedMemberForTreeGeneration>(
  member: M,
  allMembers: readonly M[]
): readonly M[] {
  const sameSubteam = (otherMember: M) =>
    member.subteams.some((memberSubteam) => otherMember.subteams.includes(memberSubteam));
  switch (member.role) {
    case 'developer':
    case 'designer':
    case 'business':
      return [];
    case 'tpm':
      return allMembers.filter(
        (otherMember) => otherMember.role === 'developer' && sameSubteam(otherMember)
      );
    case 'pm': {
      const allPMs = allMembers.filter(
        (otherMember) => otherMember.role === 'pm' && sameSubteam(otherMember)
      );
      if (member.netid === allPMs[0].netid) {
        // If you are the first PM in the chain, designers are your children
        return allMembers.filter(
          (otherMember) => otherMember.role === 'designer' && sameSubteam(otherMember)
        );
      }
      return [allPMs[allPMs.findIndex((pm) => pm.netid === member.netid) - 1]];
    }
    case 'lead':
      // Design Leads have no children :(
      if (DESIGN_LEAD_NETIDS.includes(member.netid)) return [];
      if (BUSINESS_LEAD_NETID === member.netid) {
        return allMembers.filter((otherMember) => otherMember.role === 'business');
      }
      if (PRODUCT_LEAD_NETID === member.netid) {
        return allMembers.filter((pm) => {
          if (pm.role !== 'pm') return false;
          // Only consider last PM on the chain as children.
          const allPMs = allMembers.filter(
            (otherPM) =>
              otherPM.role === 'pm' &&
              otherPM.subteams.some((memberSubteam) => pm.subteams.includes(memberSubteam))
          );
          return pm.netid === allPMs[allPMs.length - 1].netid;
        });
      }
      // Dev leads form a chain of children
      if (DEV_LEAD_NETIDS.includes(member.netid)) {
        const index = DEV_LEAD_NETIDS.findIndex((it) => it === member.netid);
        if (index === 0) {
          return allMembers.filter((otherMember) => otherMember.role === 'tpm');
        }
        return allMembers.filter((otherMember) => otherMember.netid === DEV_LEAD_NETIDS[index - 1]);
      }
      if (OPS_LEAD_NETID === member.netid) {
        return allMembers.filter(
          (otherMember) =>
            ![...DEV_LEAD_NETIDS.slice(0, DEV_LEAD_NETIDS.length - 1), OPS_LEAD_NETID].includes(
              otherMember.netid
            ) && otherMember.role === 'lead'
        );
      }
      return [];
    default:
      return [];
  }
}

export const treeifyIDOLMembers = <M extends SimplifiedMemberForTreeGeneration>(
  start: M,
  allMembers: readonly M[]
): DTI48OrganizationTree<M> => ({
  member: start,
  children: getDirectChildrenForDTI48OrganizationTree(start, allMembers).map((it) =>
    treeifyIDOLMembers(it, allMembers)
  )
});

function dfs<M extends SimplifiedMemberForTreeGeneration>(
  start: DTI48OrganizationTree<M>,
  targetNetID: string,
  chain: M[]
): boolean {
  if (start.member.netid === targetNetID) return true;
  for (const child of start.children) {
    chain.push(child.member);
    if (dfs(child, targetNetID, chain)) {
      return true;
    }
    chain.pop();
  }
  return false;
}

export default function computeDTI48UpgradeChain<M extends SimplifiedMemberForTreeGeneration>(
  targetNetID: string,
  allMembers: readonly M[]
): readonly M[] {
  const start = allMembers.find((it) => it.netid === OPS_LEAD_NETID);
  if (start == null) throw new Error();
  const chain: M[] = [];
  chain.push(start);
  const tree = treeifyIDOLMembers(start, allMembers);
  dfs(tree, targetNetID, chain);
  chain.reverse();
  return chain;
}
