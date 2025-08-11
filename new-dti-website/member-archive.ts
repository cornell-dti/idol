/* eslint-disable no-console */
import { spawnSync } from 'child_process';
import { readFileSync, unlinkSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DIFF_OUTPUT_LIMIT = 65_000;

async function getIdolMembers(): Promise<readonly IdolMember[]> {
  const { members } = await fetch(
    'https://idol.cornelldti.org/.netlify/functions/api/member?type=approved'
  ).then((response) => response.json() as Promise<{ members: readonly IdolMember[] }>);
  return members.filter((it) => it.email.endsWith('@cornell.edu'));
}

function runCommand(program: string, ...programArguments: readonly string[]) {
  const programArgumentsQuoted = programArguments
    .map((it) => (it.includes(' ') ? `"${it}"` : it))
    .join(' ');
  console.log(`> ${program} ${programArgumentsQuoted}`);
  return spawnSync(program, programArguments, { stdio: 'inherit' });
}

function getSemesters() {
  const now = new Date();
  let currentSemester: string;
  let previousSemesterOne: string;
  let previousSemesterTwo: string;

  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (currentMonth >= 1 && currentMonth <= 5) {
    // It's Spring (sp)
    currentSemester = `sp${String(currentYear).padStart(2, '0')}`;
    previousSemesterOne = `fa${String(currentYear - 1).padStart(2, '0')}`;
    previousSemesterTwo = `sp${String(currentYear - 1).padStart(2, '0')}`;
  } else if (currentMonth >= 8 && currentMonth <= 12) {
    // It's Fall (fa)
    currentSemester = `fa${String(currentYear).padStart(2, '0')}`;
    previousSemesterOne = `sp${String(currentYear).padStart(2, '0')}`;
    previousSemesterTwo = `fa${String(currentYear - 1).padStart(2, '0')}`;
  } else {
    throw new Error('Current month does not fall within a valid Spring or Fall semester range.');
  }

  return { currentSemester, previousSemesterOne, previousSemesterTwo };
}

async function updateAlumniJson(): Promise<void> {
  const idolMembers = await getIdolMembers();
  const { previousSemesterOne, previousSemesterTwo } = getSemesters();

  const semesterOnePath = `../backend/src/members-archive/${previousSemesterOne}.json`;
  const semesterTwoPath = `../backend/src/members-archive/${previousSemesterTwo}.json`;
  console.log(`Reading ${semesterOnePath} and ${semesterTwoPath}`);
  if (!existsSync(semesterOnePath)) {
    throw new Error(
      `Missing JSON file: ${semesterOnePath}. Please include it in the member-archive directory.`
    );
  }

  if (!existsSync(semesterTwoPath)) {
    throw new Error(
      `Missing JSON file: ${semesterTwoPath}. Please include it in the member-archive directory.`
    );
  }

  const semesterOne = await import(semesterOnePath);
  const semesterTwo = await import(semesterTwoPath);

  if (!Array.isArray(semesterOne.members) || !Array.isArray(semesterTwo.members)) {
    throw new Error(
      `One or both of the semester files (${semesterOnePath}, ${semesterTwoPath}) are not in the expected format.`
    );
  }

  const alumniJsonPath = join('components', 'team', 'data', 'alumni.json');

  const existingContent = readFileSync(alumniJsonPath).toString();
  const newAlumni = [...semesterOne.members, ...semesterTwo.members];

  const updatedAlumni: IdolMember[] = [];

  newAlumni.forEach((member) => {
    const existsInCurrentMembers = idolMembers.some(
      (idolMember) => idolMember.email === member.email
    );

    const existsInNewAlumni = updatedAlumni.some(
      (existingMember) => existingMember.email === member.email
    );

    if (!existsInCurrentMembers && !existsInNewAlumni) {
      updatedAlumni.push(member);
    }
  });

  const newContent = JSON.stringify(updatedAlumni, null, 2);

  if (existingContent === newContent) {
    console.log('No changes.');
    return;
  }

  writeFileSync(alumniJsonPath, newContent);

  let diffOutput = '';
  writeFileSync('existing.json', existingContent);
  const output = spawnSync('diff', ['--unified=0', 'existing.json', alumniJsonPath], {
    encoding: 'utf-8'
  });
  diffOutput = output.stdout.toString();
  unlinkSync('existing.json');

  if (!process.env.CI) {
    console.log(`\n${diffOutput}`);
  }
}

updateAlumniJson();
