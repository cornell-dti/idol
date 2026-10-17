import { Octokit } from '@octokit/rest';
import { createPatch } from 'diff';
import RecruitmentTimelineDao from '../dao/RecruitmentTimelineDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';
import { serializeRecruitmentTimelineEvents } from '../utils/recruitmentTimelineWebsite';

const WEBSITE_REPOSITORY = {
  owner: 'cornell-dti',
  repo: 'idol',
  path: 'new-dti-website-redesign/src/app/apply/events.json',
  ref: 'main'
};
const MAX_DISPATCH_CONTENT_BYTES = 60_000;

export type RecruitmentTimelineWebsitePreview = {
  diff: string;
  hasChanges: boolean;
};

export type RecruitmentTimelineWebsitePRRequest = {
  dispatched: boolean;
};

const getWebsiteEventsFile = async (): Promise<string> => {
  const octokit = new Octokit({ auth: process.env.BOT_TOKEN });
  const response = await octokit.repos.getContent(WEBSITE_REPOSITORY);
  if (Array.isArray(response.data) || !('content' in response.data)) {
    throw new Error('The public recruitment timeline events file could not be found.');
  }

  return Buffer.from(response.data.content, 'base64').toString('utf8');
};

export const previewRecruitmentTimelineWebsiteChanges = async (
  user: IdolMember
): Promise<RecruitmentTimelineWebsitePreview> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} cannot preview recruitment timeline website changes`
    );
  }

  const [events, currentFile] = await Promise.all([
    RecruitmentTimelineDao.getAllRecruitmentTimelineEvents(),
    getWebsiteEventsFile()
  ]);
  const nextFile = serializeRecruitmentTimelineEvents(events);

  return {
    hasChanges: currentFile !== nextFile,
    diff: createPatch(WEBSITE_REPOSITORY.path, currentFile, nextFile, 'main', 'Firebase')
  };
};

export const requestRecruitmentTimelineWebsitePR = async (
  user: IdolMember
): Promise<RecruitmentTimelineWebsitePRRequest> => {
  if (!(await PermissionsManager.canDeploySite(user))) {
    throw new PermissionError(
      `User with email ${user.email} cannot create recruitment timeline website pull requests`
    );
  }

  const events = await RecruitmentTimelineDao.getAllRecruitmentTimelineEvents();
  const websiteEventsContent = serializeRecruitmentTimelineEvents(events);
  if (Buffer.byteLength(websiteEventsContent, 'utf8') > MAX_DISPATCH_CONTENT_BYTES) {
    throw new Error(
      'Recruitment timeline data is too large to send to the website update workflow.'
    );
  }

  const octokit = new Octokit({ auth: process.env.BOT_TOKEN });
  const response = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
    owner: WEBSITE_REPOSITORY.owner,
    repo: WEBSITE_REPOSITORY.repo,
    event_type: 'update-recruitment-timeline',
    client_payload: { content: websiteEventsContent }
  });

  return { dispatched: response.status === 204 };
};
