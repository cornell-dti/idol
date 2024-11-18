import PermissionsManager from '../utils/permissionsManager';
import { NotFoundError, PermissionError } from '../utils/errors';
import ShoutoutsDao from '../dao/ShoutoutsDao';
import { deleteImage } from './imageAPI';

const shoutoutsDao = new ShoutoutsDao();

/**
 * Retrieves all shoutouts from the database.
 * @returns A promise that resolves to an array of Shoutout objects.
 */
export const getAllShoutouts = (): Promise<Shoutout[]> => shoutoutsDao.getAllShoutouts();

/**
 * Creates a shoutout, ensuring the giver has the correct permissions.
 * @throws {PermissionError} If the user attempting to give a shoutout is not the same as the giver specified in the shoutout.
 * @returns A promise that resolves to the created Shoutout object.
 */
export const giveShoutout = async (body: Shoutout, user: IdolMember): Promise<Shoutout> => {
  if (body.giver.email !== user.email) {
    throw new PermissionError(
      `User with email: ${user.email} can't post a shoutout from a different user!`
    );
  }
  return shoutoutsDao.createShoutout(body);
};

/**
 * Retrieves shoutouts based on the type (given or received) for a specific member.
 * @throws {PermissionError} If the user does not have permission to view the shoutouts.
 * @returns A promise that resolves to an array of Shoutout objects.
 */
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
  return shoutoutsDao.getShoutouts(memberEmail, type);
};

/**
 * Hides or unhides a shoutout based on the user's permissions.
 * @throws {PermissionError} If the user does not have permission to hide shoutouts.
 * @throws {NotFoundError} If no shoutout with the provided uuid exists.
 */
export const hideShoutout = async (
  uuid: string,
  hide: boolean,
  user: IdolMember
): Promise<void> => {
  const canEdit = await PermissionsManager.canHideShoutouts(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to hide shoutouts!`
    );
  }
  const shoutout = await shoutoutsDao.getShoutout(uuid);
  if (!shoutout) throw new NotFoundError(`Shoutout with uuid: ${uuid} does not exist!`);
  await shoutoutsDao.updateShoutout({ ...shoutout, hidden: hide });
};

/**
 * Deletes a shoutout, ensuring the user has the necessary permissions or ownership.
 * @throws {NotFoundError} If no shoutout with the provided uuid is found.
 * @throws {PermissionError} If the user is neither the giver of the shoutout nor an admin or lead.
 */
export const deleteShoutout = async (uuid: string, user: IdolMember): Promise<void> => {
  const shoutout = await shoutoutsDao.getShoutout(uuid);
  if (!shoutout) {
    throw new NotFoundError(`No shoutout with id '${uuid}' found.`);
  }
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && shoutout.giver.email !== user.email) {
    throw new PermissionError(
      `You are not a lead or admin, so you can't delete a shoutout from a different user!`
    );
  }
  if (shoutout.images && shoutout.images.length > 0) {
    await deleteImage(shoutout.images[0]);
  }
  await shoutoutsDao.deleteShoutout(uuid);
};
