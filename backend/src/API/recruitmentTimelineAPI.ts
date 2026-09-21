import RecruitmentTimelineDao, {
  RecruitmentTimelineEvent
} from '../dao/RecruitmentTimelineDao';
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
