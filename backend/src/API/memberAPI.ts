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
 * @returns an object with the categories as the keys, each with value `MemberProfile[]`.
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

/**
 * Gets the properties of a member given their email.
 * @param email - the email of a member.
 * @returns the `MemberProperties` where the email matches the given email.
 */
export const getMemberProperties = async (email: string): Promise<MemberProperties | undefined> =>
  MembersDao.getMemberProperties(email);

/**
 * Checks if a member meets a category.
 * @param otherMemberEmail - the email of the member we are checking.
 * @param submitter - the member that submitted the coffee chat.
 * @param encodedCategory - the category we are checking with (encoded with base64).
 * @returns true if a member meets a category, false if not, undefined if not enough data to know.
 */
export const checkMemberMeetsCategory = async (
  otherMemberEmail: string,
  submitter: IdolMember,
  encodedCategory: string
): Promise<boolean | undefined> => {
  const otherMemberProperties = await getMemberProperties(otherMemberEmail);
  const submitterProperties = await getMemberProperties(submitter.email);
  const otherMember = await getMember(otherMemberEmail);
  const category = Buffer.from(encodedCategory, 'base64').toString('utf8');
  const haveNoCommonSubteams = (member1: IdolMember, member2: IdolMember): boolean =>
    member2.subteams.every((team) => !member1.subteams.includes(team)) &&
    member1.subteams.every((team) => !member2.subteams.includes(team));

  if (category === 'an alumni') {
    return (await allMembers()).every((member) => member.email !== otherMember?.email);
  }
  if (category === 'courseplan member') {
    return otherMember?.subteams.includes('courseplan');
  }
  if (category === 'a pm (not your team)') {
    return otherMember?.role === 'pm' && haveNoCommonSubteams(submitter, otherMember);
  }
  if (category === 'business member') {
    return otherMember?.role === 'business';
  }
  if (category === 'is/was a TA') {
    return otherMemberProperties ? otherMemberProperties.ta : undefined;
  }
  if (category === 'major/minor that is not cs/infosci') {
    return otherMemberProperties ? otherMemberProperties.notCsOrInfosci : undefined;
  }
  if (category === 'idol member') {
    return otherMember?.subteams.includes('idol');
  }
  if (category === 'a newbie') {
    return otherMemberProperties ? otherMemberProperties.newbie : undefined;
  }
  if (category === 'from a different college') {
    return otherMemberProperties && submitterProperties
      ? otherMemberProperties.college !== submitterProperties.college
      : undefined;
  }
  if (category === 'curaise member') {
    return otherMember?.subteams.includes('curaise');
  }
  if (category === 'cornellgo member') {
    return otherMember?.subteams.includes('cornellgo');
  }
  if (category === 'a tpm (not your team)') {
    return otherMember?.role === 'tpm' && haveNoCommonSubteams(submitter, otherMember);
  }
  if (category === 'carriage member') {
    return otherMember?.subteams.includes('carriage');
  }
  if (category === 'qmi member') {
    return otherMember?.subteams.includes('queuemein');
  }
  if (category === 'a lead (not your role)') {
    return (
      otherMember?.role === 'lead' &&
      (submitter.role !== 'lead'
        ? otherMemberProperties?.leadType !== submitter.role
        : otherMemberProperties?.leadType !== submitterProperties?.leadType)
    );
  }
  if (category === 'cuapts member') {
    return otherMember?.subteams.includes('cuapts');
  }
  return undefined;
};
