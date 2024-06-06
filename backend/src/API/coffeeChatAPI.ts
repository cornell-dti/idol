import isEqual from 'lodash.isequal';
import _ from 'lodash';
import CoffeeChatDao from '../dao/CoffeeChatDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';

const coffeeChatDao = new CoffeeChatDao();

export const getAllCoffeeChats = (): Promise<CoffeeChat[]> => coffeeChatDao.getAllCoffeeChats();

export const getCoffeeChatsByUser = async (user: IdolMember): Promise<CoffeeChat[]> =>
  coffeeChatDao.getCoffeeChatsByUser(user);

export const createCoffeeChat = async (coffeeChat: CoffeeChat): Promise<CoffeeChat> => {
  const [member1, member2] = coffeeChat.members;

  if (isEqual(member1, member2)) {
    throw new Error('Cannot create coffee chat with yourself.');
  }

  const prevChats1 = await coffeeChatDao.getCoffeeChatsByUser(member1);
  const prevChats2 = await coffeeChatDao.getCoffeeChatsByUser(member2);

  const prevChats = [...prevChats1, ...prevChats2];

  const chatExists = prevChats.some((chat) => {
    const chatMembers = chat.members.map((m) => m.email).sort();
    const currentMembers = [member1.email, member2.email].sort();
    return _.isEqual(chatMembers, currentMembers);
  });
  if (chatExists) {
    throw new Error(
      'Cannot create coffee chat with member. Previous coffee chats from previous semesters exist.'
    );
  }

  await coffeeChatDao.createCoffeeChat(coffeeChat);
  return coffeeChat;
};

export const updateCoffeeChat = async (
  coffeeChat: CoffeeChat,
  user: IdolMember
): Promise<CoffeeChat> => {
  const canEditCoffeeChat = await PermissionsManager.canEditCoffeeChat(user);
  if (!canEditCoffeeChat) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to update team events attendance`
    );
  }

  await coffeeChatDao.updateCoffeeChat(coffeeChat);
  return coffeeChat;
};

export const deleteCoffeeChat = async (uuid: string, user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  const coffeeChat = await coffeeChatDao.getCoffeeChat(uuid);

  if (!coffeeChat) return;

  if (
    !isLeadOrAdmin &&
    (coffeeChat.members[0].email !== user.email || coffeeChat.members[1].email !== user.email)
  ) {
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete team events attendance`
    );
  }
  await coffeeChatDao.deleteCoffeeChat(uuid);
};

export const clearAllCoffeeChats = async (user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have sufficient permissions to delete all coffee chats.`
    );
  await CoffeeChatDao.clearAllCoffeeChats();
};
