import { spawnSync } from 'child_process';
import { readFileSync, unlinkSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { Octokit } from '@octokit/rest';
import { join } from 'path';

const DIFF_OUTPUT_LIMIT = 65_000;

function checkFileExists(filePath: string): boolean {
  console.log(`Checking if file exists: ${filePath}`);
  return existsSync(filePath);
}

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

  console.log(`Current semester: ${currentSemester}`);
  console.log(`Previous semesters: ${previousSemesterOne}, ${previousSemesterTwo}`);

  return { currentSemester, previousSemesterOne, previousSemesterTwo };
}

async function updateAlumniJson(): Promise<void> {
  const idolMembers = await getIdolMembers();
  const { previousSemesterOne, previousSemesterTwo } = getSemesters();

  const semesterOneFile = `${previousSemesterOne}.json`;
  const semesterTwoFile = `${previousSemesterTwo}.json`;

  const semesterOnePath = resolve(__dirname, `../backend/src/members-archive/${semesterOneFile}`);
  const semesterTwoPath = resolve(__dirname, `../backend/src/members-archive/${semesterTwoFile}`);

  console.log(`Semester One Path: ${semesterOnePath}`);
  console.log(`Semester Two Path: ${semesterTwoPath}`);

  if (!checkFileExists(semesterOnePath)) {
    throw new Error(
      `Missing JSON file: ${semesterOneFile}. Please include it in the member-archive directory.`
    );
  }

  if (!checkFileExists(semesterTwoPath)) {
    throw new Error(
      `Missing JSON file: ${semesterTwoFile}. Please include it in the member-archive directory.`
    );
  }

  const semesterOne = await import(semesterOnePath);
  const semesterTwo = await import(semesterTwoPath);

  if (!Array.isArray(semesterOne.members) || !Array.isArray(semesterTwo.members)) {
    throw new Error(
      `One or both of the semester files (${semesterOneFile}, ${semesterTwoFile}) are not in the expected format.`
    );
  }

  const alumniJsonPath = join('components', 'team', 'data', 'test-alumni.json');
  console.log(`Alumni JSON Path: ${alumniJsonPath}`);

  const existingContent = readFileSync(alumniJsonPath).toString();
  const newAlumni = [...semesterOne.members, ...semesterTwo.members];

  let existingAlumni = [];
  try {
    existingAlumni = JSON.parse(existingContent);
  } catch (e) {
    console.error('Error parsing existing alumni JSON:', e);
  }

  const updatedAlumni = [...existingAlumni];

  newAlumni.forEach((member) => {
    const existsInCurrentMembers = idolMembers.some(
      (idolMember) => idolMember.email === member.email
    );

    const existsInExistingAlumni = existingAlumni.some(
      (existingMember: any) => existingMember.email === member.email
    );

    const existsInNewAlumni = updatedAlumni.some(
      (existingMember: any) => existingMember.email === member.email
    );

    if (!existsInCurrentMembers && !existsInExistingAlumni && !existsInNewAlumni) {
      console.log(`Adding new alumni: ${member.firstName} ${member.lastName}`);
      updatedAlumni.push(member);
    }
  });

  const newContent = JSON.stringify(updatedAlumni, null, 2);

  if (existingContent === newContent) {
    console.log('No changes to alumni.json.');
    return;
  }

  let diffOutput = '';
  writeFileSync('existing.json', existingContent);
  const output = spawnSync('diff', ['--unified=0', 'existing.json', alumniJsonPath], {
    encoding: 'utf-8'
  });
  diffOutput = output.stdout.toString();
  console.log('Diff Output:', diffOutput);
  unlinkSync('existing.json');

  writeFileSync(alumniJsonPath, newContent);

  const gitBranch = 'dti-github-bot/update-alumni-json';
  const commitMessage = '[bot] Automatically update alumni.json with latest semester data';

  runCommand('git', 'config', '--global', 'user.name', 'dti-github-bot');
  runCommand('git', 'config', '--global', 'user.email', 'admin@cornelldti.org');
  runCommand('git', 'add', '.');
  runCommand('git', 'fetch', '--all');

  runCommand('git', 'stash', '--include-untracked');

  if (runCommand('git', 'checkout', 'main').status !== 0) {
    throw new Error('Failed to checkout main');
  }

  if (runCommand('git', 'rev-parse', '--verify', gitBranch).status === 0) {
    runCommand('git', 'branch', '-D', gitBranch);
  }

  const remoteBranchCheck = spawnSync('git', ['ls-remote', '--heads', 'origin', gitBranch], {
    encoding: 'utf-8'
  });
  if (remoteBranchCheck.stdout.includes(gitBranch)) {
    runCommand('git', 'push', 'origin', '--delete', gitBranch);
  }

  if (runCommand('git', 'checkout', '-b', gitBranch).status !== 0) {
    throw new Error(`Failed to create branch: ${gitBranch}`);
  }

  if (runCommand('git', 'commit', '-m', commitMessage).status === 0) {
    const pushResult = runCommand('git', 'push', '-f', 'origin', gitBranch);
    if (pushResult.status !== 0) {
      runCommand('git', 'push', '-f', '--set-upstream', 'origin', gitBranch);
    }
  } else {
    console.log('No changes to commit.');
  }

  const octokit = new Octokit({
    auth: `token ${process.env.BOT_TOKEN}`,
    userAgent: 'cornell-dti/big-diff-warning'
  });

  if (diffOutput.length > DIFF_OUTPUT_LIMIT) {
    diffOutput = '<Output is too long to put in the PR description. See PR diff for details.>';
  }

  const prBody = `## Diffs
  \`\`\`diff
  ${diffOutput}
  \`\`\`

  ## Summary

  This PR auto-generates the update for alumni.json using data from the last two semesters.
  Please review the changes carefully.

  ## Test Plan

  :eyes:`;

  const existingPR = (
    await octokit.pulls.list({
      owner: 'cornell-dti',
      repo: 'idol',
      state: 'open'
    })
  ).data.find((pr) => pr.title === commitMessage);

  if (existingPR == null) {
    await octokit.pulls.create({
      owner: 'cornell-dti',
      repo: 'idol',
      title: commitMessage,
      body: prBody,
      base: 'main',
      head: gitBranch
    });
  } else {
    await octokit.pulls.update({
      owner: 'cornell-dti',
      repo: 'idol',
      pull_number: existingPR.number,
      body: prBody
    });
  }
}

updateAlumniJson();
