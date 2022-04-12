import * as fs from 'fs';
import MembersDao from './dao/MembersDao';

function convertIdolMemberToNovaMember(idolMember: IdolMember): NovaMember {
  const {
    netid,
    firstName,
    lastName,
    pronouns,
    graduation,
    major,
    doubleMajor,
    minor,
    website,
    linkedin,
    github,
    hometown,
    about,
    subteams,
    formerSubteams,
    role,
    roleDescription
  } = idolMember;

  return {
    netid,
    name: `${firstName} ${lastName}`,
    pronouns: pronouns || '',
    graduation,
    major,
    hometown,
    about,
    subteams: [...subteams],
    roleId: role,
    roleDescription,
    doubleMajor: doubleMajor || undefined,
    minor: minor || undefined,
    formerSubteams: formerSubteams ? ([...formerSubteams] as string[]) : undefined,
    website: website || undefined,
    linkedin: linkedin || undefined,
    github: github || undefined
  };
}

const main = async () => {
  const allApprovedMembers = await MembersDao.getAllMembers(true);
  const novaMembers = allApprovedMembers.map((member) => convertIdolMemberToNovaMember(member));
  fs.writeFile('../dti-website/src/data/all-members.json', JSON.stringify(novaMembers), (err) => {
    if (err) console.log(err);
  });
};

main();
