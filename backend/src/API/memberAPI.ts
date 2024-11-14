import MembersDao from '../dao/MembersDao';
import PermissionsManager from '../utils/permissionsManager';
import { BadRequestError, PermissionError } from '../utils/errors';
import { getNetIDFromEmail, computeMembersDiff } from '../utils/memberUtil';
import { deleteImage } from './imageAPI';

const membersDao = new MembersDao();

/**
 * Gets all members on IDOL with their latest unapproved profile changes.
 * @returns an `IdolMember[]` containing all the current members on IDOL.
 */
export const allMembers = (): Promise<readonly IdolMember[]> => MembersDao.getAllMembers(false);

/**
 * Gets all members on IDOL whose profile changes have been appoved.
 * @returns - an `IdolMember` list containing the approved members on IDOL.
 */
export const allApprovedMembers = (): Promise<readonly IdolMember[]> =>
  MembersDao.getAllMembers(true);

/**
 * Creates a new IDOL member given their credentials.
 * @param member - the new `IdolMember` to create.
 * @param user - the `IdolMember` making the request.
 * @throws `PermissionError` if `user` does not have permission to edit members.
 * @throws `BadRequestError` if the email of the new `IdolMember` is undefined.
 * @returns the newly created `IdolMember`.
 */
export const setMember = async (member: IdolMember, user: IdolMember): Promise<IdolMember> => {
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit members!`
    );
  }
  if (!member.email || member.email === '') {
    throw new BadRequestError("Couldn't edit member with undefined email!");
  }
  return membersDao.setMember(member.email, member);
};

/**
 * Gets an IDOL member given their email.
 * @param email - the email of an IDOL member.
 * @returns the `IdolMember` whose email matches the given email.
 */
export const getMember = async (email: string): Promise<IdolMember | undefined> =>
  MembersDao.getMember(email);

/**
 * Updates a given member given their credentials.
 * @param member - the `IdolMember` containing the new credentials.
 * @param user - the `IdolMember` submitting the request.
 * @throws `PermissionError` if the `user` does not have permission to edit members or if they try to edit another member's information.
 * @throws `BadRequestError` if the member's email is undefined.
 * @returns the updated `IdolMember`.
 */
export const updateMember = async (member: IdolMember, user: IdolMember): Promise<unknown> => {
  const canEdit = await PermissionsManager.canEditMembers(user);
  if (!canEdit && user.email !== member.email) {
    // members are able to edit their own information
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit members!`
    );
  }
  if (!member.email || member.email === '') {
    throw new BadRequestError("Couldn't edit member with undefined email!");
  }
  if (
    !canEdit &&
    (member.role !== user.role ||
      member.firstName !== user.firstName ||
      member.lastName !== user.lastName)
  ) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit member name or roles!`
    );
  }

  return membersDao.updateMember(member.email, member);
};

/**
 * Deletes an IDOL member given their email.
 * @param email - the email of the IDOL member to delete.
 * @param user - the `IdolMember` submitting the request.
 */
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
  await membersDao.deleteMember(email).then(() => {
    const netId: string = getNetIDFromEmail(email);
    deleteImage(`images/${netId}`).catch(() => {
      /* Ignore the error since the user might not have a profile picture. */
    });
  });
};

/**
 * Gets the differences between a member's pending profile changes and their current profile.
 * @param user - the `IdolMember` submitting the request.
 * @throws `PermissionError` if `user` does not have permission to review member profile changes.
 * @returns an `IdolMemberDiff[]` containing all members' differences.
 */
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

/**
 * Submits the approved changes for each member and reverts members to their original data if the changes were rejected.
 * @param approved - the list of approved changes.
 * @param rejected - the list of rejected changes.
 * @param user - the user submitting the request.
 */
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

/**
 * Generates an archive of all IDOL members, separated into three categories: current, inactive, and alumni.
 * @param membershipChanges - an object with lists of NetIds corresponding to the status of IDOL members in the next semester.
 * @param user - the `IdolMember` submitting the request.
 * @param semesters - the number of previous semesters to look back, undefined if no limit.
 * @returns an object with the categories as the keys, each with value `IdolMember[]`.
 */
export const generateMemberArchive = async (
  membershipChanges: { [key: string]: string[] },
  user: IdolMember,
  semesters: number | undefined
): Promise<{ [key: string]: string[] }> => {
  const canEditMembers = await PermissionsManager.canEditMembers(user);
  if (!canEditMembers) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to generate an archive!`
    );
  }
  return MembersDao.generateArchive(membershipChanges, semesters);
};
