import sp21 from './sp21.json';

const archivedMembers: Readonly<Record<string, readonly IdolMember[]>> = {
  'Spring 2021': sp21.members as unknown as readonly IdolMember[]
};

export default archivedMembers;
