import CoffeeChatDao from '../dao/CoffeeChatDao';
import isEqual from 'lodash.isequal';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';
import _ from 'lodash';

const coffeeChatDao = new CoffeeChatDao();

//get all coffee chat instances
export const getAllCoffeeChats = (): Promise<CoffeeChat[]> => coffeeChatDao.getAllCoffeeChats();

//get coffee chat instances for user
export const getCoffeeChatsByUser = async (user: IdolMember): Promise<CoffeeChat[]> =>
  await coffeeChatDao.getCoffeeChatsByUser(user);

// create new coffee chat instance
export const createCoffeeChat = async (coffeeChat: CoffeeChat): Promise<CoffeeChat> => {
  const [member1, member2] = coffeeChat.members;
  console.log('Members:', member1, member2);

  if (isEqual(member1, member2)) {
    console.error('Cannot create coffee chat with yourself.');
    throw new Error('Cannot create coffee chat with yourself.');
  }

  const prevChats1 = await coffeeChatDao.getCoffeeChatsByUser(member1);
  const prevChats2 = await coffeeChatDao.getCoffeeChatsByUser(member2);

  console.log('Previous chats for member1:', prevChats1);
  console.log('Previous chats for member2:', prevChats2);

  const prevChats = [...prevChats1, ...prevChats2];
  console.log('Combined previous chats:', prevChats);

  const chatExists = prevChats.some((chat) => {
    const chatMembers = chat.members.map((m) => m.email).sort();
    const currentMembers = [member1.email, member2.email].sort();
    return _.isEqual(chatMembers, currentMembers);
  });

  // const chatExists = prevChats.some(
  //   (c) => isEqual(c.members, [member1, member2]) || isEqual(c.members, [member2, member1])
  // );

  if (chatExists) {
    console.error(
      'Cannot create coffee chat with member. Previous coffee chats from previous semesters exist.'
    );
    throw new Error(
      'Cannot create coffee chat with member. Previous coffee chats from previous semesters exist.'
    );
  }

  await coffeeChatDao.createCoffeeChat(coffeeChat);
  console.log('Coffee chat created successfully.');
  return coffeeChat;
};

// update coffee chat instance
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

//delete coffee chat instance

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

//delete all coffee chats
export const clearAllCoffeeChats = async (user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      'User with email ${user.email} does not have sufficient permissions to delete all coffee chats.'
    );
  await CoffeeChatDao.clearAllCoffeeChats();
};
