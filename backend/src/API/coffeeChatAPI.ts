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
 * @param submitter - the member that submitted the coffee chat.
 * @param encodedCategory - the category we are checking with (encoded with base64).
 * @returns true if a member meets a category, false if not, undefined if not enough data to know.
 */
export const checkMemberMeetsCategory = async (
  otherMemberEmail: string,
  submitter: IdolMember,
  encodedCategory: string
): Promise<boolean | undefined> => {
  const otherMemberProperties = await CoffeeChatDao.getMemberProperties(otherMemberEmail);
  const submitterProperties = await CoffeeChatDao.getMemberProperties(submitter.email);
  const otherMember = await getMember(otherMemberEmail);
  const category = decodeURIComponent(encodedCategory);
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
