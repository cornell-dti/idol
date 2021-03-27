import { Octokit } from '@octokit/rest';
import MembersDao from '../dao/MembersDao';
import { PermissionsManager } from '../permissions';
import { UnauthorizedError, PermissionError } from '../errors';
import { Request } from 'express';
require('dotenv').config();

export const requestIDOLPullDispatch = async (req: Request) => {
  const userEmail: string = req.session?.email as string;
  const user = await MembersDao.getMember(userEmail);
  if (!user) throw new UnauthorizedError(`No user with email: ${userEmail}`);
  const canEdit = await PermissionsManager.canDeploySite(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${userEmail} does not have permission to trigger site deploys!`
    );
  }
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
