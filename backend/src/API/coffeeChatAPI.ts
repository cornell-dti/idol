import { Request } from 'express';
import CoffeeChatDao from '../dao/CoffeeChatDao';
import PermissionsManager from '../utils/permissionsManager';
import { BadRequestError, PermissionError } from '../utils/errors';
import { getMember, allApprovedMembers } from './memberAPI';
import { sendCoffeeChatReminder } from './mailAPI';
import { parseCoffeeChatCSV } from '../utils/coffeeChatCSVParser';

const coffeeChatDao = new CoffeeChatDao();

/**
 * Gets all coffee chats
 */
export const getAllCoffeeChats = (): Promise<CoffeeChat[]> => coffeeChatDao.getAllCoffeeChats();

/**
 * Gets all coffee chats for a user
 * @param user - user requesting to fetch coffee chats
 * @param email - email of user whose coffee chats should be fetched
 */
export const getCoffeeChatsByUser = async (
  user: IdolMember,
  email: string
): Promise<CoffeeChat[]> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && email !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to get coffee chats for user with email ${email}.`
    );
  }

  const coffeeChats = coffeeChatDao.getCoffeeChatsByUser(email);
  return coffeeChats;
};

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
    coffeeChat.submitter.email,
    'pending',
    coffeeChat.otherMember
  );
  const approvedChats = await coffeeChatDao.getCoffeeChatsByUser(
    coffeeChat.submitter.email,
    'approved',
    coffeeChat.otherMember
  );
  const prevChats = [
    ...pendingChats.filter((chat) => !chat.isArchived),
    ...approvedChats.filter((chat) => !chat.isArchived)
  ];
  const chatExists = prevChats.length > 0;

  if (chatExists) {
    throw new Error(
      'Cannot create coffee chat with member. Coffee chats from current or previous semesters exist.'
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

  if (!isLeadOrAdmin && coffeeChat.submitter.email !== user.email) {
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
 * Archives all coffee chats by setting the isArchived field to true.
 * @param user - The user making the request.
 * @throws PermissionError if the user does not have permissions.
 */
export const archiveCoffeeChats = async (user: IdolMember): Promise<void> => {
  const canArchive = await PermissionsManager.isLeadOrAdmin(user);
  if (!canArchive) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to archive coffee chats.`
    );
  }

  await CoffeeChatDao.archiveCoffeeChats();
};

/**
 * Gets the coffee chat bingo board
 */
export const getCoffeeChatBingoBoard = (): Promise<string[][]> =>
  CoffeeChatDao.getCoffeeChatBingoBoard();

/**
 * Gets coffee chat suggestions for a specific member, excluding themselves from each category
 * @param email - the email of the member requesting suggestions
 * @returns a CoffeeChatSuggestions object
 */
export const getCoffeeChatSuggestions = async (email: string): Promise<CoffeeChatSuggestions> => {
  const [member, suggestions] = await Promise.all([
    getMember(email),
    CoffeeChatDao.getCoffeeChatSuggestions()
  ]);

  if (!member) return suggestions;

  const selfNetid = member.netid.trim().toLowerCase();
  return Object.fromEntries(
    Object.entries(suggestions).map(([category, members]) => [
      category,
      members.filter((m) => m.netid.trim().toLowerCase() !== selfNetid)
    ])
  );
};

/**
 * Gets all coffee chat categories
 * @param user - the user making the request
 * @returns an array of sorted CoffeeChatCategory objects
 */
export const getCoffeeCategories = async (user: IdolMember): Promise<CoffeeChatCategory[]> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to view coffee chat categories.`
    );
  }
  return CoffeeChatDao.getAllCategories();
};

/**
 * Updates the members list for a single coffee chat category
 * @param index - the index of the category to update
 * @param members - the new members list for this category
 * @param user - the user making the request
 */
export const updateCategoryMembers = async (
  index: number,
  members: MemberDetails[],
  user: IdolMember
): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to update coffee chat categories.`
    );
  }
  await CoffeeChatDao.updateCategoryMembers(index, members);
};

/**
 * Parses a CSV string and updates all coffee chat categories
 * @param csvContent - CSV string
 * @param user - the user making the request
 */
export const uploadCoffeeChatCSV = async (csvContent: string, user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to upload coffee chat categories.`
    );
  }

  const members = await allApprovedMembers();
  const categories = parseCoffeeChatCSV(csvContent, [...members]);
  await CoffeeChatDao.updateCategories(categories);
};

/**
 * Checks if a member meets a category for the specified coffee chat.
 * @param uuid - the uuid of the coffee chats we are checking.
 * @param user - the IdolMember making the request.
 * @returns the updated coffee chat
 */
export const runAutoChecker = async (uuid: string, user: IdolMember): Promise<CoffeeChat> => {
  const canRunAutoChecker = await PermissionsManager.isLeadOrAdmin(user);
  if (!canRunAutoChecker)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to run auto checker`
    );

  const coffeeChat = await coffeeChatDao.getCoffeeChat(uuid);
  if (!coffeeChat) {
    throw new BadRequestError(`Coffee chat with uuid: ${uuid} does not exist`);
  }

  const archivedChats = await coffeeChatDao.getCoffeeChatsByUser(
    coffeeChat.submitter.email,
    'approved',
    coffeeChat.otherMember
  );

  const hasArchivedChat = archivedChats.some((chat) => chat.isArchived);

  let updatedCC: CoffeeChat;

  if (hasArchivedChat) {
    updatedCC = {
      ...coffeeChat,
      memberMeetsCategory: 'fail',
      errorMessage: `An archived chat already exists between ${coffeeChat.submitter.firstName} and ${coffeeChat.otherMember.firstName}.`
    };
  } else {
    const result = await checkMemberMeetsCategory(
      coffeeChat.otherMember.email,
      coffeeChat.submitter.email,
      coffeeChat.category
    );

    updatedCC = {
      ...coffeeChat,
      memberMeetsCategory: result.status,
      errorMessage: result.message
    };
  }

  await coffeeChatDao.updateCoffeeChat(updatedCC);
  return updatedCC;
};

/**
 * Checks if a member meets a category.
 * @param otherMemberEmail - the email of the member we are checking.
 * @param submitterEmail - the email of the member that submitted the coffee chat.
 * @param category - the category we are checking with.
 * @returns 'pass' if a member meets a category, 'fail' if not, 'no data' if the category doesn't exist.
 */
export const checkMemberMeetsCategory = async (
  otherMemberEmail: string,
  submitterEmail: string,
  category: string
): Promise<{ status: MemberMeetsCategoryStatus; message: string }> => {
  const [otherMember, submitter, categories] = await Promise.all([
    getMember(otherMemberEmail),
    getMember(submitterEmail),
    CoffeeChatDao.getAllCategories()
  ]);

  if (!otherMember || !submitter) return { status: 'no data', message: '' };

  const categoryDoc = categories.find((c) => c.name === category);
  if (!categoryDoc) return { status: 'no data', message: '' };

  const inCategory = categoryDoc.members.some(
    (m) => m.netid.trim().toLowerCase() === otherMember.netid.trim().toLowerCase()
  );
  const status: MemberMeetsCategoryStatus = inCategory ? 'pass' : 'fail';
  const message =
    status === 'fail'
      ? `${otherMember.firstName} ${otherMember.lastName} does not meet the category '${category}'`
      : '';

  return { status, message };
};

/**
 * Reminds a member about submitting coffee chats this semester.
 * @param req - the post request being made by the user
 * @param member - the member being notified
 * @param user - the user trying to notify the member
 * @throws PermissionError if the user does not have permissions to notify members
 * @returns the body of the request, which contains details about the member being notified
 */
export const notifyMemberCoffeeChat = async (
  req: Request,
  member: IdolMember,
  user: IdolMember
): Promise<unknown> => {
  const canNotify = await PermissionsManager.canNotifyMembers(user);
  if (!canNotify) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to notify members!`
    );
  }
  if (!member.email || member.email === '') {
    throw new BadRequestError("Couldn't notify member with undefined email!");
  }
  const responseBody = await sendCoffeeChatReminder(req, member);
  return responseBody.data;
};
