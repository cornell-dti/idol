import PermissionsManager from '../utils/permissions';
import { PermissionError } from '../utils/errors';
import { Shoutout } from '../dataTypes';
import ShoutoutsDao from '../dao/ShoutoutsDao';

export const getAllShoutouts = (): Promise<Shoutout[]> => ShoutoutsDao.getAllShoutouts();

export const giveShoutout = async (
  body: {
    giver: IdolMember;
    receiver: IdolMember;
    message: string;
    isAnon: boolean;
  },
  user: IdolMember
): Promise<Shoutout> => {
  if (body.giver.email !== user.email) {
    throw new PermissionError(
      `User with email: ${user.email} can't post a shoutout from a different user!`
    );
  }
  return ShoutoutsDao.setShoutout(body);
};

export const getShoutouts = async (
  memberEmail: string,
  type: 'given' | 'received',
  user: IdolMember
): Promise<Shoutout[]> => {
  const canEdit: boolean = await PermissionsManager.canGetShoutouts(user);
  if (!canEdit && memberEmail !== user.email) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to get shoutouts!`
    );
  }
  return ShoutoutsDao.getShoutouts(memberEmail, type);
};
