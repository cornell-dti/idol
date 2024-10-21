import isEqual from 'lodash.isequal';
import CoffeeChatDao from '../dao/CoffeeChatDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';

const coffeeChatDao = new CoffeeChatDao();

/**
 * Gets all coffee chats
 */
export const getAllCoffeeChats = (): Promise<CoffeeChat[]> => coffeeChatDao.getAllCoffeeChats();

/**
 * Gets all coffee chats for a user
 * @param user - user whose coffee chats should be fetched
 */
export const getCoffeeChatsByUser = async (user: IdolMember): Promise<CoffeeChat[]> => {
  const pendingChats = await coffeeChatDao.getCoffeeChatsByUser(user, 'pending');
  const approvedChats = await coffeeChatDao.getCoffeeChatsByUser(user, 'approved');
  const rejectedChats = await coffeeChatDao.getCoffeeChatsByUser(user, 'rejected');

  return [...pendingChats, ...approvedChats, ...rejectedChats];
};

/**
 * Creates a new coffee chat for member
 * @param coffeeChat - Newly created CoffeeChat object
 * A member can not coffee chat themselves.
 * A member can not coffee chat the same person from previous semesters.
 */
export const createCoffeeChat = async (coffeeChat: CoffeeChat): Promise<CoffeeChat> => {
  if (isEqual(coffeeChat.submitter, coffeeChat.otherMember)) {
    throw new Error('Cannot create coffee chat with yourself.');
  }

  const pendingChats = await coffeeChatDao.getCoffeeChatsByUser(coffeeChat.submitter, 'pending');
  const approvedChats = await coffeeChatDao.getCoffeeChatsByUser(coffeeChat.submitter, 'approved');
  const prevChats = [...pendingChats, ...approvedChats];
  const chatExists = prevChats.some((chat) => isEqual(coffeeChat.otherMember, chat.otherMember));

  if (chatExists) {
    throw new Error(
      'Cannot create coffee chat with member. Previous coffee chats from previous semesters exist.'
    );
  }

  await coffeeChatDao.createCoffeeChat(coffeeChat);
  return coffeeChat;
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
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete all coffee chats.`
    );
  }
  await CoffeeChatDao.clearAllCoffeeChats();
};
