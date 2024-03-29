import sp21 from './sp21.json';
import fa21 from './fa21.json';
import sp23 from './sp23.json';
import fa23 from './fa23.json';

export const archivedMembersBySemesters: Readonly<Record<string, readonly IdolMember[]>> = {
  'Spring 2021': sp21.members as unknown as readonly IdolMember[],
  'Fall 2021': fa21.members as unknown as readonly IdolMember[],
  'Spring 2023': sp23.members as unknown as readonly IdolMember[],
  'Fall 2023': fa23.members as unknown as readonly IdolMember[]
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
