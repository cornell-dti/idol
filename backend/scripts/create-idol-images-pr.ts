/* eslint-disable no-console */
import { Octokit } from '@octokit/rest';
import { spawnSync } from 'child_process';

function runCommand(program: string, ...programArguments: readonly string[]) {
  const programArgumentsQuoted = programArguments
    .map((it) => (it.includes(' ') ? `"${it}"` : it))
    .join(' ');
  console.log(`> ${program} ${programArgumentsQuoted}`);
  return spawnSync(program, programArguments, { stdio: 'inherit' });
}

const main = async () => {
  console.log('Creating PR...');

  // Create commit
  runCommand('git', 'config', '--global', 'user.name', 'dti-github-bot');
  runCommand('git', 'config', '--global', 'user.email', 'admin@cornelldti.org');
  const gitBranch = 'dti-github-bot/pull-from-idol-images';
  const commitMessage = '[bot] Automatically pull images from IDOL';
  runCommand('git', 'add', '../new-dti-website-redesign/public/team/teamHeadshots');
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
  const prBody = `
  ## Summary

  This is a PR auto-generated from running \`yarn workspace backend run pull-from-idol-images\` and
  \`yarn workspace backend run create-idol-images-pr\`.

  It updates the new-dti-website-redesign with latest images from IDOL.

  Please verify that the images look fine on the website and that the image sizes aren't too large.`;
  const existingPR = (
    await octokit.pulls.list({
      owner: 'cornell-dti',
      repo: 'idol',
      state: 'open'
    })
  ).data.find((pr) => pr.title === commitMessage);
  try {
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
  } catch (e) {
    console.log('No changes made.');
  }
};

main();
