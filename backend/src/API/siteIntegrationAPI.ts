import { Octokit } from '@octokit/rest';
import { PRResponse } from '../types/GithubTypes';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError, BadRequestError } from '../utils/errors';

require('dotenv').config();

/**
 * Triggers a dispatch event to pull changes from the IDOL backend.
 * @param {IdolMember} user - The user requesting the pull dispatch.
 * @returns {Promise<{updated: boolean}>} - A promise that resolves to an object indicating if the update was successful.
 * @throws {PermissionError} - If the user lacks permission to trigger the dispatch.
 */
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

/**
 * Retrieves the latest Pull Request with changes from the IDOL backend.
 * @param {IdolMember} user - The user requesting the pull request details.
 * @returns {Promise<{pr: PRResponse}>} - A promise that resolves to an object containing the pull request details.
 * @throws {PermissionError} - If the user lacks permission to access the pull request.
 */
export const getIDOLChangesPR = async (user: IdolMember): Promise<{ pr: PRResponse }> => {
  await checkPermissions(user);
  const foundPR = await findBotPR();
  return { pr: foundPR };
};

/**
 * Accepts and merges the IDOL backend changes pull request.
 * @param {IdolMember} user - The user attempting to accept the changes.
 * @returns {Promise<{pr: PRResponse; merged: boolean}>} - A promise that resolves to an object containing the pull request details and a boolean indicating if the merge was successful.
 * @throws {PermissionError} - If the user lacks permission to merge the pull request.
 */
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

/**
 * Finds an open pull request created by a bot for updating IDOL backend data.
 * @returns {Promise<PRResponse>} - A promise that resolves to the found pull request details.
 * @throws {BadRequestError} - If no valid open pull request is found.
 */
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

/**
 * Checks if the user has permission to deploy the site.
 * @param {IdolMember} user - The user whose permissions are being checked.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {PermissionError} - If the user does not have permission to deploy the site.
 */
const checkPermissions = async (user: IdolMember): Promise<void> => {
  const canEdit = await PermissionsManager.canDeploySite(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to trigger site deploys!`
    );
  }
};
