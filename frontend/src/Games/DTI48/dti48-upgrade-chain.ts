export type SimplifiedMemberForTreeGeneration = {
  readonly netid: string;
  readonly role: Role;
  readonly subteams: readonly string[];
};

type DTI48OrganizationTree<M extends SimplifiedMemberForTreeGeneration = IdolMember> = {
  readonly member: M;
  readonly children: readonly DTI48OrganizationTree<M>[];
};

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
    case 'lead': {
      // Design Leads have no children :(
      if (member.subteams.includes('design-leads')) return [];
      if (member.subteams.includes('business-leads')) {
        return allMembers.filter((otherMember) => otherMember.role === 'business');
      }
      if (member.subteams.includes('product-leads')) {
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
      const devLeadNetIds = allMembers
        .filter((it) => it.subteams.includes('dev-leads'))
        .map((it) => it.netid);
      // Dev leads form a chain of children
      if (devLeadNetIds.includes(member.netid)) {
        const index = devLeadNetIds.findIndex((it) => it === member.netid);
        if (index === 0) {
          return allMembers.filter((otherMember) => otherMember.role === 'tpm');
        }
        return allMembers.filter((otherMember) => otherMember.netid === devLeadNetIds[index - 1]);
      }
      if (member.subteams.includes('ops-leads')) {
        return allMembers.filter(
          (otherMember) =>
            ![...devLeadNetIds.slice(0, devLeadNetIds.length - 1), member.netid].includes(
              otherMember.netid
            ) && otherMember.role === 'lead'
        );
      }
      throw new Error(`Unknown lead type: ${member.netid}!`);
    }
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
  const start = allMembers.find((it) => it.subteams.includes('ops-leads'));
  if (start == null) throw new Error();
  const chain: M[] = [];
  chain.push(start);
  const tree = treeifyIDOLMembers(start, allMembers);
  dfs(tree, targetNetID, chain);
  chain.reverse();
  return chain;
}
