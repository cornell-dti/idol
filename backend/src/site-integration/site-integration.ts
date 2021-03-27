import { Octokit } from '@octokit/rest';
import MembersDao from '../dao/MembersDao';
import { PermissionsManager } from '../permissions';
import { UnauthorizedError, PermissionError, BadRequestError, HandlerError } from '../errors';
import { Request } from 'express';
require('dotenv').config();

export const requestIDOLPullDispatch = async (req: Request) => {
  let check = await checkPermissions(req);
  const octokit = new Octokit({
    auth: `token ${process.env.BOT_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  let res = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
    owner: 'cornell-dti',
    repo: 'idol',
    event_type: 'pull-idol-changes'
  });
  return { updated: res.status == 204, res: res };
};

export const getIDOLChangesPR = async (req: Request) => {
  let check = await checkPermissions(req);
  let foundPR = await findBotPR();
  return { pr: foundPR };
};

export const acceptIDOLChanges = async (req: Request) => {
  let check = await checkPermissions(req);
  const octokit = new Octokit({
    auth: `token ${process.env.BOT_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  let foundPR = await findBotPR();
  const octokit2 = new Octokit({
    auth: `token ${process.env.BOT_2_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  let approveReview = await octokit2.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
    owner: 'cornell-dti',
    repo: 'idol',
    pull_number: foundPR.number,
    event: 'APPROVE'
  });
  if(approveReview.data.state !== 'APPROVED'){
    throw new PermissionError("Could not approve the IDOL changes pull request!");
  }
  let acceptedPR = await octokit.rest.pulls.merge({
    owner: 'cornell-dti',
    repo: 'idol',
    pull_number: foundPR.number,
    merge_method: 'squash'
  });
  return { pr: foundPR, merged: acceptedPR.data.merged };
};

export const rejectIDOLChanges = async (req: Request) => {
  let check = await checkPermissions(req);
  let foundPR = await findBotPR();
  const octokit2 = new Octokit({
    auth: `token ${process.env.BOT_2_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  let closedReview = await octokit2.rest.pulls.update({
    owner: 'cornell-dti',
    repo: 'idol',
    pull_number: foundPR.number,
    state: 'closed'
  });
  if(closedReview.data.state !== 'closed'){
    throw new PermissionError("Could not approve the IDOL changes pull request!");
  }
  return { pr: foundPR, closed: closedReview.data.state === 'closed' };
};

const findBotPR = async () => {
  const octokit = new Octokit({
    auth: `token ${process.env.BOT_TOKEN}`,
    userAgent: 'cornell-dti/idol-backend'
  });
  let allPulls = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: 'cornell-dti',
    repo: 'idol',
    event_type: 'pull-idol-changes'
  });
  let foundPR = allPulls.data.find((el) => {
    return el.title === "[bot] Automatically pull latest data from IDOL backend"
    && el.state === "open"
  });
  if(!foundPR){
    throw new BadRequestError("Unable to find a valid open IDOL member update pull request!");
  }
  return foundPR;
}

const checkPermissions = async (req: Request) => {
  const userEmail: string = req.session?.email as string;
  const user = await MembersDao.getMember(userEmail);
  if (!user) throw new UnauthorizedError(`No user with email: ${userEmail}`);
  const canEdit = await PermissionsManager.canDeploySite(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to trigger site deploys!`
    );
  }
}