import PermissionsManager from '../utils/permissionsManager';
import { NotFoundError, PermissionError } from '../utils/errors';
import { Shoutout } from '../types/DataTypes';
import ShoutoutsDao from '../dao/ShoutoutsDao';

export const getAllShoutouts = (): Promise<Shoutout[]> => ShoutoutsDao.getAllShoutouts();

export const giveShoutout = async (body: Shoutout, user: IdolMember): Promise<Shoutout> => {
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

export const hideShoutout = async (uuid: string, user: IdolMember): Promise<void> => {
  const canEdit = await PermissionsManager.canHideShoutouts(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to hide shoutouts!`
    );
  }
  const shoutout = await ShoutoutsDao.getShoutout(uuid);
  if (!shoutout) throw new NotFoundError(`Shoutout with uuid: ${uuid} does not exist!`);
  await ShoutoutsDao.updateShoutout({ ...shoutout, hidden: true });
};
