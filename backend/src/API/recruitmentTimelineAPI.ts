import RecruitmentTimelineDao, { RecruitmentTimelineEvent } from '../dao/RecruitmentTimelineDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';

export const getAllRecruitmentTimelineEvents = async (
  user: IdolMember
): Promise<RecruitmentTimelineEvent[]> => {
  const canEditTimeline = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEditTimeline) {
    throw new PermissionError(
      `User with email ${user.email} cannot get recruitment timeline events`
    );
  }

  return RecruitmentTimelineDao.getAllRecruitmentTimelineEvents();
};

export const createTimelineEvent = async (
  event: RecruitmentTimelineEvent,
  user: IdolMember
): Promise<RecruitmentTimelineEvent> => {
  const canEditTimeline = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEditTimeline) {
    throw new PermissionError(
      `User with email ${user.email} cannot edit recruitment timeline events`
    );
  }

  return RecruitmentTimelineDao.createTimelineEvent(event);
};

export const deleteTimelineEvent = async (id: string, user: IdolMember): Promise<void> => {
  const canEditTimeline = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEditTimeline) {
    throw new PermissionError(
      `User with email ${user.email} cannot edit recruitment timeline events`
    );
  }

  await RecruitmentTimelineDao.deleteTimelineEvent(id);
};
