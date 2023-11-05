import { Request } from 'express';
import MembersDao from '../dao/MembersDao';
import PermissionsManager from '../utils/permissionsManager';
import { BadRequestError, PermissionError } from '../utils/errors';
import { bucket } from '../firebase';
import { getNetIDFromEmail, computeMembersDiff } from '../utils/memberUtil';

const membersDao = new MembersDao();

export const allMembers = (): Promise<readonly IdolMember[]> => MembersDao.getAllMembers(false);

export const allApprovedMembers = (): Promise<readonly IdolMember[]> =>
  MembersDao.getAllMembers(true);

export const setMember = async (body: IdolMember, user: IdolMember): Promise<IdolMember> => {
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit members!`
    );
  }
  if (!body.email || body.email === '') {
    throw new BadRequestError("Couldn't edit member with undefined email!");
  }
  return membersDao.setMember(body.email, body);
};

export const getMember = async (email: string): Promise<IdolMember | undefined> =>
  MembersDao.getMember(email);

export const updateMember = async (
  req: Request,
  body: IdolMember,
  user: IdolMember
): Promise<unknown> => {
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

  return membersDao.updateMember(body.email, body);
};

export const deleteMember = async (email: string, user: IdolMember): Promise<void> => {
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to delete members!`
    );
  }
  if (!email || email === '') {
    throw new BadRequestError("Couldn't delete member with undefined email!");
  }
  await membersDao.deleteMember(email).then(() =>
    deleteImage(email).catch(() => {
      /* Ignore the error since the user might not have a profile picture. */
    })
  );
};

export const deleteImage = async (email: string): Promise<void> => {
  // Create a reference to the file to delete
  const netId: string = getNetIDFromEmail(email);
  const imageFile = bucket.file(`images/${netId}.jpg`);

  // Delete the file
  await imageFile.delete();
};

export const getUserInformationDifference = async (
  user: IdolMember
): Promise<readonly IdolMemberDiff[]> => {
  const canReview = await PermissionsManager.canReviewChanges(user);
  if (!canReview) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to review members information diff!`
    );
  }
  const [allApprovedMembersList, allLatestMembersList] = await Promise.all([
    allApprovedMembers(),
    allMembers()
  ]);
  return computeMembersDiff(allApprovedMembersList, allLatestMembersList);
};

export const reviewUserInformationChange = async (
  approved: readonly string[],
  rejected: readonly string[],
  user: IdolMember
): Promise<void> => {
  const canReview = await PermissionsManager.canReviewChanges(user);
  if (!canReview) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to review members information diff!`
    );
  }
  await Promise.all([
    MembersDao.approveMemberInformationChanges(approved),
    MembersDao.revertMemberInformationChanges(rejected)
  ]);
};
