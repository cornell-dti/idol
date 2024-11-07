import CoffeeChatDao from '../dao/CoffeeChatDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';
import { getMember, allMembers } from './memberAPI';

const coffeeChatDao = new CoffeeChatDao();

/**
 * Gets all coffee chats
 */
export const getAllCoffeeChats = (): Promise<CoffeeChat[]> => coffeeChatDao.getAllCoffeeChats();

/**
 * Gets all coffee chats for a user
 * @param user - user whose coffee chats should be fetched
 */
export const getCoffeeChatsByUser = async (user: IdolMember): Promise<CoffeeChat[]> =>
  coffeeChatDao.getCoffeeChatsByUser(user);

/**
 * Creates a new coffee chat for member
 * @param coffeeChat - Newly created CoffeeChat object
 * @param user - user who is submitting the coffee chat
 * A member can not coffee chat themselves.
 * A member can not coffee chat the same person from previous semesters.
 */
export const createCoffeeChat = async (
  coffeeChat: CoffeeChat,
  user: IdolMember
): Promise<CoffeeChat> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && coffeeChat.submitter.email !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to create coffee chat.`
    );
  }

  if (coffeeChat.submitter.email === coffeeChat.otherMember.email) {
    throw new Error('Cannot create coffee chat with yourself.');
  }

  const pendingChats = await coffeeChatDao.getCoffeeChatsByUser(
    coffeeChat.submitter,
    'pending',
    coffeeChat.otherMember
  );
  const approvedChats = await coffeeChatDao.getCoffeeChatsByUser(
    coffeeChat.submitter,
    'approved',
    coffeeChat.otherMember
  );
  const prevChats = [...pendingChats, ...approvedChats];
  const chatExists = prevChats.length > 0;

  if (chatExists) {
    throw new Error(
      'Cannot create coffee chat with member. Previous coffee chats from previous semesters exist.'
    );
  }

  const newCoffeeChat = await coffeeChatDao.createCoffeeChat(coffeeChat);
  return newCoffeeChat;
};

/**
 * Updates a coffee chat (if the user has permission)
 * @param coffeeChat - The updated CoffeeChat object
 * @param user - The user that is requesting to update the coffee chat
 */
export const updateCoffeeChat = async (
  coffeeChat: CoffeeChat,
  user: IdolMember
): Promise<CoffeeChat> => {
  const canEditCoffeeChat = await PermissionsManager.canEditCoffeeChat(user);
  if (!canEditCoffeeChat) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to update coffee chat.`
    );
  }

  await coffeeChatDao.updateCoffeeChat(coffeeChat);
  return coffeeChat;
};

/**
 * Deletes a coffee chat (if the user has permission)
 * @param uuid - DB uuid of CoffeeChat
 * @param user - The user that is requesting to delete a coffee chat
 */
export const deleteCoffeeChat = async (uuid: string, user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  const coffeeChat = await coffeeChatDao.getCoffeeChat(uuid);

  if (!coffeeChat) return;

  if (!isLeadOrAdmin && coffeeChat.submitter !== user) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete coffee chat.`
    );
  }
  await coffeeChatDao.deleteCoffeeChat(uuid);
};

/**
 * Deletes all coffee chats (if the user has permission)
 * @param user - The user that is requesting to delete all coffee chats
 */
export const clearAllCoffeeChats = async (user: IdolMember): Promise<void> => {
  const isClearAllCoffeeChatsDisabled = await PermissionsManager.isClearAllCoffeeChatsDisabled();
  if (isClearAllCoffeeChatsDisabled) {
    throw new PermissionError('Clearing all Coffee Chats is disabled');
  }
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete all coffee chats.`
    );
  }
  await CoffeeChatDao.clearAllCoffeeChats();
};

/**
 * Gets the coffee chat bingo board
 */
export const getCoffeeChatBingoBoard = (): Promise<string[][]> =>
  CoffeeChatDao.getCoffeeChatBingoBoard();

/**
 * Checks if a member meets a category.
 * @param otherMemberEmail - the email of the member we are checking.
 * @param submitterEmail - the email of the member that submitted the coffee chat.
 * @param encodedCategory - the category we are checking with (encoded).
 * @returns true if a member meets a category, false if not, undefined if not enough data to know.
 */
export const checkMemberMeetsCategory = async (
  otherMemberEmail: string,
  submitterEmail: string,
  encodedCategory: string
): Promise<{ status: boolean | undefined; message: string }> => {
  const otherMemberProperties = await CoffeeChatDao.getMemberProperties(otherMemberEmail);
  const submitterProperties = await CoffeeChatDao.getMemberProperties(submitterEmail);
  const otherMember = await getMember(otherMemberEmail);
  const submitter = await getMember(submitterEmail);
  const category = decodeURIComponent(encodedCategory);
  const haveNoCommonSubteams = (member1: IdolMember, member2: IdolMember): boolean =>
    member2.subteams.every((team) => !member1.subteams.includes(team)) &&
    member1.subteams.every((team) => !member2.subteams.includes(team));
  let status: boolean | undefined;
  let message: string = '';

  if (category === 'an alumni') {
    status = (await allMembers()).every((member) => member.email !== otherMember?.email);
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not an alumni`;
    }
  }
  if (category === 'courseplan member') {
    status = otherMember?.subteams.includes('courseplan');
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a CoursePlan member`;
    }
  }
  if (category === 'a pm (not your team)') {
    const isPm = otherMember?.role === 'pm';
    const notSameTeam = otherMember && submitter && haveNoCommonSubteams(submitter, otherMember);
    status = isPm && notSameTeam;
    if (status === false && !isPm) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a PM`;
    }
    if (status === false && !notSameTeam) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is a PM, but on the same team as ${submitter?.firstName} ${submitter?.lastName}`;
    }
    if (status === false && !isPm && !notSameTeam) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a PM and is on the same team as ${submitter?.firstName} ${submitter?.lastName}`;
    }
  }
  if (category === 'business member') {
    status = otherMember?.role === 'business';
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a business member`;
    }
  }
  if (category === 'is/was a TA') {
    status = otherMemberProperties ? otherMemberProperties.ta : undefined;
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} was never a TA`;
    }
  }
  if (category === 'major/minor that is not cs/infosci') {
    status = otherMemberProperties ? otherMemberProperties.notCsOrInfosci : undefined;
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is a CS or Infosci major`;
    }
  }
  if (category === 'idol member') {
    status = otherMember?.subteams.includes('idol');
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not an IDOL member`;
    }
  }
  if (category === 'a newbie') {
    status = otherMemberProperties ? otherMemberProperties.newbie : undefined;
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a newbie`;
    }
  }
  if (category === 'from a different college') {
    status =
      otherMemberProperties && submitterProperties
        ? otherMemberProperties.college !== submitterProperties.college
        : undefined;
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is from the same college as ${submitter?.firstName} ${submitter?.lastName} (${otherMemberProperties?.college})`;
    }
  }
  if (category === 'curaise member') {
    status = otherMember?.subteams.includes('curaise');
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a CURaise member`;
    }
  }
  if (category === 'cornellgo member') {
    status = otherMember?.subteams.includes('cornellgo');
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a CornellGo member`;
    }
  }
  if (category === 'a tpm (not your team)') {
    const isTpm = otherMember?.role === 'tpm';
    const notSameTeam = otherMember && submitter && haveNoCommonSubteams(submitter, otherMember);
    status = isTpm && notSameTeam;
    if (status === false && !isTpm) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a TPM`;
    }
    if (status === false && !notSameTeam) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is a TPM, but is on the same team as ${submitter?.firstName} ${submitter?.lastName}`;
    }
    if (status === false && !isTpm && !notSameTeam) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a TPM and is on the same team as ${submitter?.firstName} ${submitter?.lastName}`;
    }
  }
  if (category === 'carriage member') {
    status = otherMember?.subteams.includes('carriage');
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a Carriage member`;
    }
  }
  if (category === 'qmi member') {
    status = otherMember?.subteams.includes('queuemein');
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a QMI member`;
    }
  }
  if (category === 'a lead (not your role)') {
    const isLead = otherMember?.role === 'lead' && submitter?.role !== 'lead';
    const diffRole = isLead
      ? otherMemberProperties?.leadType !== submitter?.role
      : otherMemberProperties?.leadType !== submitterProperties?.leadType;
    status = isLead && diffRole;
    if (status === false && !isLead) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a lead`;
    }
    if (status === false && !diffRole) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is a lead, but from the same role (${submitter?.role}) as ${submitter?.firstName} ${submitter?.lastName}`;
    }
    if (status === false && !isLead && !diffRole) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a lead and is from the same role as ${submitter?.firstName} ${submitter?.lastName}`;
    }
  }
  if (category === 'cuapts member') {
    status = otherMember?.subteams.includes('cuapts');
    if (status === false) {
      message = `${otherMember?.firstName} ${otherMember?.lastName} is not a CUApts member`;
    }
  }
  return { status, message };
};
