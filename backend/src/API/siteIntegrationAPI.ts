import { Octokit } from '@octokit/rest';
import { PRResponse } from '../types/GithubTypes';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError, BadRequestError } from '../utils/errors';

require('dotenv').config();

export const requestIDOLPullDispatch = async (user: IdolMember): Promise<{ updated: boolean }> => {
  await checkPermissions(user);
  const octokit = new Octokit({
    auth: `token ${process.env.BOT_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  const result = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
    owner: 'cornell-dti',
    repo: 'idol',
    event_type: 'pull-idol-changes'
  });
  return { updated: result.status === 204 };
};

export const getIDOLChangesPR = async (user: IdolMember): Promise<{ pr: PRResponse }> => {
  await checkPermissions(user);
  const foundPR = await findBotPR();
  return { pr: foundPR };
};

export const acceptIDOLChanges = async (
  user: IdolMember
): Promise<{ pr: PRResponse; merged: boolean }> => {
  await checkPermissions(user);
  const octokit = new Octokit({
    auth: `token ${process.env.BOT_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  const foundPR = await findBotPR();
  const octokit2 = new Octokit({
    auth: `token ${process.env.BOT_2_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  const approveReview = await octokit2.request(
    'POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
    {
      owner: 'cornell-dti',
      repo: 'idol',
      pull_number: foundPR.number,
      event: 'APPROVE'
    }
  );
  if (approveReview.data.state !== 'APPROVED') {
    throw new PermissionError('Could not approve the IDOL changes pull request!');
  }
  const acceptedPR = await octokit.rest.pulls.merge({
    owner: 'cornell-dti',
    repo: 'idol',
    pull_number: foundPR.number,
    merge_method: 'squash'
  });
  return { pr: foundPR, merged: acceptedPR.data.merged };
};

export const rejectIDOLChanges = async (
  user: IdolMember
): Promise<{ pr: PRResponse; closed: boolean }> => {
  await checkPermissions(user);
  const foundPR = await findBotPR();
  const octokit2 = new Octokit({
    auth: `token ${process.env.BOT_2_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  const closedReview = await octokit2.rest.pulls.update({
    owner: 'cornell-dti',
    repo: 'idol',
    pull_number: foundPR.number,
    state: 'closed'
  });
  if (closedReview.data.state !== 'closed') {
    throw new PermissionError('Could not approve the IDOL changes pull request!');
  }
  return { pr: foundPR, closed: closedReview.data.state === 'closed' };
};

const findBotPR = async (): Promise<PRResponse> => {
  const octokit = new Octokit({
    auth: `token ${process.env.BOT_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  const allPulls = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: 'cornell-dti',
    repo: 'idol',
    event_type: 'pull-idol-changes'
  });
  const foundPR = allPulls.data.find(
    (el) =>
      el.title === '[bot] Automatically pull latest data from IDOL backend' && el.state === 'open'
  );
  if (!foundPR) {
    throw new BadRequestError('Unable to find a valid open IDOL member update pull request!');
  }
  return foundPR;
};

const checkPermissions = async (user: IdolMember): Promise<void> => {
  const canEdit = await PermissionsManager.canDeploySite(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to trigger site deploys!`
    );
  }
};
