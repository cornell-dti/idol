/* eslint-disable no-console */
import { spawnSync } from 'child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Octokit } from '@octokit/rest';

const EVENTS_PATH = join('src', 'app', 'apply', 'events.json');
const BOT_BRANCH = 'dti-github-bot/update-recruitment-timeline';
const COMMIT_MESSAGE = '[bot] Update recruitment timeline from IDOL';

const runCommand = (program: string, ...programArguments: readonly string[]) => {
  const programArgumentsQuoted = programArguments
    .map((argument) => (argument.includes(' ') ? `"${argument}"` : argument))
    .join(' ');
  console.log(`> ${program} ${programArgumentsQuoted}`);
  return spawnSync(program, programArguments, { stdio: 'inherit' });
};

const getTimelineContent = (): string => {
  const content = process.env.RECRUITMENT_TIMELINE_CONTENT;
  if (!content) throw new Error('The recruitment timeline workflow did not receive event content.');

  const parsed = JSON.parse(content) as { events?: unknown };
  if (!Array.isArray(parsed.events)) {
    throw new Error('The recruitment timeline workflow received invalid event content.');
  }

  return `${JSON.stringify(parsed, null, 2)}\n`;
};

const getDiff = (existingContent: string, nextContent: string): string => {
  const existingPath = join(process.cwd(), 'events-before-update.json');
  writeFileSync(existingPath, existingContent);
  writeFileSync(EVENTS_PATH, nextContent);
  const output = spawnSync('diff', ['--unified=0', existingPath, EVENTS_PATH], {
    encoding: 'utf8'
  });
  unlinkSync(existingPath);

  return output.stdout.toString();
};

const main = async (): Promise<void> => {
  if (!process.env.CI) {
    console.log('This script only creates a pull request in GitHub Actions.');
    return;
  }

  runCommand('git', 'fetch', 'origin', 'main');
  runCommand('git', 'checkout', '-B', BOT_BRANCH, 'origin/main');

  const nextContent = getTimelineContent();
  const existingContent = readFileSync(EVENTS_PATH, 'utf8');
  if (existingContent === nextContent) {
    console.log('No recruitment timeline changes.');
    return;
  }

  const diff = getDiff(existingContent, nextContent);
  runCommand('git', 'config', '--global', 'user.name', 'dti-github-bot');
  runCommand('git', 'config', '--global', 'user.email', 'admin@cornelldti.org');
  runCommand('git', 'add', EVENTS_PATH);
  runCommand('git', 'commit', '-m', COMMIT_MESSAGE);
  runCommand('git', 'push', '--force', 'origin', BOT_BRANCH);

  const octokit = new Octokit({ auth: process.env.BOT_TOKEN });
  const existingPR = (
    await octokit.pulls.list({ owner: 'cornell-dti', repo: 'idol', state: 'open' })
  ).data.find((pr) => pr.title === COMMIT_MESSAGE);
  const body = `## Recruitment timeline changes

\`\`\`diff
${diff}
\`\`\`

This PR was generated from the Recruitment Timeline admin page. Please review the timeline and deploy preview before merging.`;

  if (existingPR) {
    await octokit.pulls.update({
      owner: 'cornell-dti',
      repo: 'idol',
      pull_number: existingPR.number,
      body
    });
  } else {
    await octokit.pulls.create({
      owner: 'cornell-dti',
      repo: 'idol',
      title: COMMIT_MESSAGE,
      body,
      base: 'main',
      head: BOT_BRANCH
    });
  }
};

main();
