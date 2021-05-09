import { getNetIDFromEmail, filterImagesResponse } from './util';
import MembersDao from './dao/MembersDao';
import { PermissionsManager } from './permissions';
import { BadRequestError, PermissionError, NotFoundError } from './errors';
import { bucket } from './firebase';

export const allMembers = (): Promise<readonly IdolMember[]> =>
  MembersDao.getAllMembers();

export const setMember = async (
  body: IdolMember,
  user: IdolMember
): Promise<IdolMember> => {
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit members!`
    );
  }
  if (!body.email || body.email === '') {
    throw new BadRequestError("Couldn't edit member with undefined email!");
  }
  return MembersDao.setMember(body.email, body);
};

export const updateMember = async (
  body: IdolMember,
  user: IdolMember
): Promise<IdolMember> => {
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit && user.email !== body.email) {
    // members are able to edit their own information
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit members!`
    );
  }
  if (!body.email || body.email === '') {
    throw new BadRequestError("Couldn't edit member with undefined email!");
  }
  if (
    !canEdit &&
    (body.role !== user.role ||
      body.firstName !== user.firstName ||
      body.lastName !== user.lastName)
  ) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit member name or roles!`
    );
  }
  return MembersDao.updateMember(body.email, body);
};

export const getMember = async (
  memberEmail: string,
  user: IdolMember
): Promise<IdolMember> => {
  const canEdit: boolean = await PermissionsManager.canEditMembers(user);
  if (!canEdit && memberEmail !== user.email) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to get members!`
    );
  }
  const member = await MembersDao.getMember(memberEmail);
  if (member == null) {
    throw new NotFoundError(`Member with email: ${memberEmail} does not exist`);
  }
  return member;
};

export const deleteMember = async (
  email: string,
  user: IdolMember
): Promise<void> => {
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to delete members!`
    );
  }
  if (!email || email === '') {
    throw new BadRequestError("Couldn't delete member with undefined email!");
  }
  await MembersDao.deleteMember(email).then(() => deleteImage(email));
};

export const deleteImage = async (email: string): Promise<void> => {
  // Create a reference to the file to delete
  const netId: string = getNetIDFromEmail(email);
  const imageFile = bucket.file(`images/${netId}.jpg`);

  // Delete the file
  imageFile
    .delete()
    .then(() => {
      // File deleted successfully
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
};
