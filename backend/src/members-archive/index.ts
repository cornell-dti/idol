import sp21 from './sp21.json';
import fa21 from './fa21.json';
import sp23 from './sp23.json';

export const archivedMembersBySemesters: Readonly<Record<string, readonly IdolMember[]>> = {
  'Spring 2021': sp21.members as unknown as readonly IdolMember[],
  'Fall 2021': sp21.members as unknown as readonly IdolMember[],
  'Spring 2023': sp21.members as unknown as readonly IdolMember[],
};

export const archivedMembersByEmail: Readonly<Record<string, IdolMember>> = (() => {
  const map: Record<string, IdolMember> = {};
  Object.values(archivedMembersBySemesters).forEach((members) => {
    members.forEach((member) => {
      map[member.email] = member;
    });
  });
  return map;
})();
