#!/usr/bin/env node

/* eslint-disable no-console */

import { spawnSync } from 'child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

async function getIdolMembers(): Promise<readonly IdolMember[]> {
  const { members } = await fetch(
    'https://idol.cornelldti.org/.netlify/functions/api/member?type=approved'
  ).then((response) => response.json() as Promise<{ members: readonly IdolMember[] }>);
  return members.filter((it) => it.email.endsWith('@cornell.edu'));
}

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

function runCommand(program: string, ...programArguments: readonly string[]) {
  const programArgumentsQuoted = programArguments
    .map((it) => (it.includes(' ') ? `"${it}"` : it))
    .join(' ');
  console.log(`> ${program} ${programArgumentsQuoted}`);
  return spawnSync(program, programArguments, { stdio: 'inherit' });
}

async function main(): Promise<void> {
  // Create new json
  const idolMembers = await getIdolMembers();
  const novaMembers = idolMembers.map(convertIdolMemberToNovaMember);
  const jsonPath = join('src', 'data', 'all-members.json');
  const content = `${JSON.stringify(novaMembers, undefined, 2)}\n`;

  // Change detection
  const existingContent = readFileSync(jsonPath).toString();
  writeFileSync(jsonPath, content);
  if (existingContent === content) {
    console.log('No changes.');
    return;
  }

  let diffOutput = '';

  writeFileSync('existing.json', existingContent);
  const output = spawnSync('diff', ['--unified=0', 'existing.json', jsonPath], {
    encoding: 'utf-8'
  });
  diffOutput = output.stdout.toString();
  unlinkSync('existing.json');
  // Just log diff when not on CI
  if (!process.env.CI) {
    console.log(`\n${diffOutput}`);
    return;
  }

  // Create commit
  runCommand('git', 'config', '--global', 'user.name', 'dti-github-bot');
  runCommand('git', 'config', '--global', 'user.email', 'admin@cornelldti.org');
  const gitBranch = 'dti-github-bot/pull-from-idol';
  const commitMessage = '[bot] Automatically pull latest data from IDOL backend';
  runCommand('git', 'add', '.');
  runCommand('git', 'fetch', '--all');
  runCommand('git', 'checkout', 'main');
  runCommand('git', 'checkout', '-b', gitBranch);
  if (runCommand('git', 'commit', '-m', commitMessage).status === 0) {
    if (runCommand('git', 'push', '-f', 'origin', gitBranch).status !== 0) {
      runCommand('git', 'push', '-f', '--set-upstream', 'origin', gitBranch);
    }
  }

  // Create PR
  const octokit = new Octokit({
    auth: `token ${process.env.BOT_TOKEN}`,
    userAgent: 'cornell-dti/big-diff-warning'
  });
  const prBody = `## Diffs
  \`\`\`diff
  ${diffOutput}
  \`\`\`

  ## Summary

  This is a PR auto-generated from \`yarn workspace dti-website pull-from-idol\`.
  It updates the members JSON with latest **approved** data from IDOL backend.
  Please review it carefully again to ensure nothing bad is here.

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

main();
