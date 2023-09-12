import { NotFoundError, PermissionError } from '../utils/errors';
import ShoutoutsDao from '../dao/ShoutoutsDao';

const shoutoutsDao = new ShoutoutsDao();

export const getAllShoutouts = (): Promise<Shoutout[]> => shoutoutsDao.getAllShoutouts();

export const giveShoutout = async (body: Shoutout, user: IdolMember): Promise<Shoutout> => {
  if (body.giver.email !== user.email) {
    throw new PermissionError(
      `User with email: ${user.email} can't post a shoutout from a different user!`
    );
  }
  return shoutoutsDao.createShoutout(body);
};

export const getShoutouts = async (
  memberEmail: string,
  type: 'given' | 'received',
  user: IdolMember
): Promise<Shoutout[]> => shoutoutsDao.getShoutouts(memberEmail, type);

export const hideShoutout = async (
  uuid: string,
  hide: boolean,
  user: IdolMember
): Promise<void> => {
  const shoutout = await shoutoutsDao.getShoutout(uuid);
  if (!shoutout) throw new NotFoundError(`Shoutout with uuid: ${uuid} does not exist!`);
  await shoutoutsDao.updateShoutout({ ...shoutout, hidden: hide });
};

export const deleteShoutout = async (uuid: string, user: IdolMember): Promise<void> => {
  const shoutout = await shoutoutsDao.getShoutout(uuid);
  if (!shoutout) {
    throw new NotFoundError(`No shoutout with id '${uuid}' found.`);
  }
  await shoutoutsDao.deleteShoutout(uuid);
};
