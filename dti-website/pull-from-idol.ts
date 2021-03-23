#!/usr/bin/env node

/* eslint-disable no-console */

import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

import fetch from 'node-fetch';

async function getIdolMembers(): Promise<readonly IdolMember[]> {
  const { members }: { members: readonly IdolMember[] } = await fetch(
    'https://idol.cornelldti.org/.netlify/functions/api/allMembers'
  ).then((response) => response.json());
  return members.filter((it) => it.email.endsWith('@cornell.edu'));
}

function convertIdolMemberToNovaMember(idolMember: IdolMember): NovaMember {
  const {
    netid,
    firstName,
    lastName,
    graduation,
    major,
    doubleMajor,
    minor,
    website,
    linkedin,
    github,
    hometown,
    about,
    subteam,
    otherSubteams,
    role,
    roleDescription
  } = idolMember;

  return {
    netid,
    name: `${firstName} ${lastName}`,
    graduation,
    major,
    hometown,
    about,
    subteam,
    roleId: role,
    roleDescription,
    doubleMajor: doubleMajor || undefined,
    minor: minor || undefined,
    otherSubteams: otherSubteams || undefined,
    website: website || undefined,
    linkedin: linkedin || undefined,
    github: github || undefined
  };
}

async function main(): Promise<void> {
  const idolMembers = await getIdolMembers();
  const novaMembers = idolMembers.map(convertIdolMemberToNovaMember);
  const jsonPath = join('src', 'data', 'all-members.json');
  writeFileSync(jsonPath, `${JSON.stringify(novaMembers, undefined, 2)}\n`);
  spawnSync('git', ['add', jsonPath]);
  const diff = spawnSync('git', ['diff', 'master', jsonPath]).stdout.toString();
  console.log(diff);
}

main();
