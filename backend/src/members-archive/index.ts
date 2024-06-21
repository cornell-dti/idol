import sp21 from './sp21.json';
import fa21 from './fa21.json';
import sp23 from './sp23.json';
import fa23 from './fa23.json';
import { allApprovedMembers } from '../API/memberAPI';
import { allMemberImages } from '../API/imageAPI';

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

export const generateArchive = async (): Promise<{ [key: string]: NovaMember[] }> => {
  const allMembers: Set<string> = new Set();
  const archive: { [key: string]: NovaMember[] } = { current: [], alumni: [], inactive: [] };

  const currentMembers = await allApprovedMembers();
  const images = await allMemberImages();

  const addToArchive = (key: string, member: IdolMember) => {
    const image = images.find((image) => image.fileName.split('.')[0] === member.netid);
    archive[key].push({
      ...member,
      image: image ? image.url : null,
      coffeeChatLink: `mailto:${member.email}`
    });
  };

  currentMembers.forEach((member) => {
    allMembers.add(member.netid);
    addToArchive('current', member);
  });

  Object.values(archivedMembersBySemesters).forEach((semester) => {
    semester.forEach((member) => {
      if (!allMembers.has(member.netid)) {
        allMembers.add(member.netid);
        Date.parse(member.graduation) < Date.now()
          ? addToArchive('alumni', member)
          : addToArchive('inactive', member);
      }
    });
  });

  return archive;
};
