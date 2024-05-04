import CoffeeChatDao from '../dao/CoffeeChatDao';
import isEqual from 'lodash.isequal';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';

const coffeeChatDao = new CoffeeChatDao();

//get all coffee chat instances
export const getAllCoffeeChats = (): Promise<CoffeeChat[]> => coffeeChatDao.getAllCoffeeChats();

//get coffee chat instances for user
export const getCoffeeChatsByUser = async (user: IdolMember): Promise<CoffeeChat[]> =>
  coffeeChatDao.getCoffeeChatsByUser(user);

// create new coffee chat instance
export const createCoffeeChat = async (coffeeChat: CoffeeChat): Promise<CoffeeChat> => {
  const [member1, member2] = coffeeChat.members;

  if (isEqual(member1, member2)) {
    throw new Error('Cannot create coffee chat with yourself.');
  }
  const prevChats1 = await coffeeChatDao.getCoffeeChatsByUser(member1);
  const prevChats2 = await coffeeChatDao.getCoffeeChatsByUser(member2);
  const prevChats = [...prevChats1, ...prevChats2];
  if (
    prevChats.some(
      (c) => isEqual(c.members, [member1, member2]) || isEqual(c.members, [member2, member1])
    )
  ) {
    throw new Error(
      'Cannot create coffee chat with member. Previous coffee chats from previous semesters exist.'
    );
  }
  await coffeeChatDao.createCoffeeChat(coffeeChat);
  return coffeeChat;
};

// update coffee chat instance
export const updateCoffeeChat = async (coffeeChat: CoffeeChat): Promise<CoffeeChat> => {
  await coffeeChatDao.updateCoffeeChat(coffeeChat);
  return coffeeChat;
};

//delete all coffee chats
export const clearAllCoffeeChats = async (user: IdolMember): Promise<void> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      'User with email ${user.email} does not have sufficient permissions to delete all coffee chats.'
    );
  await CoffeeChatDao.deleteAllCoffeeChat();
};
