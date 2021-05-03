import { PermissionsManager } from './permissions';
import { PermissionError } from './errors';
import { Shoutout } from './DataTypes';
import ShoutoutsDao from './dao/ShoutoutsDao';

export const giveShoutout = async (
  body: Shoutout,
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
  const shoutouts = await ShoutoutsDao.getShoutouts(memberEmail, type);
  return shoutouts;
};
