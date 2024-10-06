import CoffeeChatDao from '../src/dao/CoffeeChatDao'; // eslint-disable-line @typescript-eslint/no-unused-vars
import PermissionsManager from '../src/utils/permissionsManager';
import { fakeIdolMember, fakeCoffeeChat, fakeIdolLead } from './data/createData';
import {
  getAllCoffeeChats,
  getCoffeeChatsByUser,
  createCoffeeChat,
  updateCoffeeChat,
  deleteCoffeeChat,
  clearAllCoffeeChats
} from '../src/API/coffeeChatAPI';
import { PermissionError } from '../src/utils/errors';

describe('User is not lead or admin', () => {
  beforeAll(() => {
    const mockIsLeadOrAdmin = jest.fn().mockResolvedValue(false);
    const mockGetCoffeeChatsByUser = jest.fn().mockResolvedValue([coffeeChat]);

    PermissionsManager.isLeadOrAdmin = mockIsLeadOrAdmin;
    CoffeeChatDao.prototype.getCoffeeChatsByUser = mockGetCoffeeChatsByUser;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user = fakeIdolMember();
  const user2 = fakeIdolMember();
  const coffeeChat = { ...fakeCoffeeChat(), submitter: user, otherMember: user2 };
  createCoffeeChat(coffeeChat, user);

  test('createCoffeeChat should throw error if submitter does not match person making request', async () => {
    const chat = { ...coffeeChat, submitter: user2, otherMember: user };
    await expect(createCoffeeChat(chat, user)).rejects.toThrow(
      new Error(`User with email ${user.email} does not have permissions to create coffee chat.`)
    );
  });

  test('createCoffeeChat should throw error if creating a coffee chat with self', async () => {
    const selfChat = { ...coffeeChat, submitter: user, otherMember: user };
    await expect(createCoffeeChat(selfChat, user)).rejects.toThrow(
      new Error('Cannot create coffee chat with yourself.')
    );
  });

  test('createCoffeeChat should throw error if previous chats exist', async () => {
    await expect(createCoffeeChat(coffeeChat, user)).rejects.toThrow(
      new Error(
        'Cannot create coffee chat with member. Previous coffee chats from previous semesters exist.'
      )
    );
  });

  test('updateCoffeeChat should throw permission error', async () => {
    await expect(updateCoffeeChat(coffeeChat, user)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have permissions to update coffee chat.`
      )
    );
  });

  test('deleteCoffeeChat should throw permission error', async () => {
    const mockGetCoffeeChat = jest.fn().mockResolvedValue(coffeeChat);
    CoffeeChatDao.prototype.getCoffeeChat = mockGetCoffeeChat;

    await expect(deleteCoffeeChat('fake-uuid', user)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have sufficient permissions to delete coffee chat.`
      )
    );
  });

  test('clearAllCoffeeChats should throw permission error', async () => {
    await expect(clearAllCoffeeChats(user)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have sufficient permissions to delete all coffee chats.`
      )
    );
  });
});

describe('User is lead or admin', () => {
  const adminUser = fakeIdolLead();
  const submitter = fakeIdolMember();
  const otherMember = fakeIdolMember();

  beforeAll(() => {
    const mockIsLeadOrAdmin = jest.fn().mockResolvedValue(true);
    const mockGetAllCoffeeChats = jest.fn().mockResolvedValue([fakeCoffeeChat()]);
    const mockGetCoffeeChatsByUser = jest
      .fn()
      .mockImplementation((submitter, otherMember) => (!otherMember ? [fakeCoffeeChat()] : []));
    const mockCreateCoffeeChat = jest.fn().mockResolvedValue(fakeCoffeeChat());
    const mockUpdateCoffeeChat = jest.fn().mockResolvedValue(fakeCoffeeChat());
    const mockDeleteCoffeeChat = jest.fn().mockResolvedValue(undefined);

    PermissionsManager.isLeadOrAdmin = mockIsLeadOrAdmin;
    CoffeeChatDao.prototype.getAllCoffeeChats = mockGetAllCoffeeChats;
    CoffeeChatDao.prototype.getCoffeeChatsByUser = mockGetCoffeeChatsByUser;
    CoffeeChatDao.prototype.createCoffeeChat = mockCreateCoffeeChat;
    CoffeeChatDao.prototype.updateCoffeeChat = mockUpdateCoffeeChat;
    CoffeeChatDao.prototype.deleteCoffeeChat = mockDeleteCoffeeChat;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createCoffeeChat should allow an admin user to create coffee chat for other user', async () => {
    const newChat = { ...fakeCoffeeChat(), submitter, otherMember };
    const result = await createCoffeeChat(newChat, adminUser);
    expect(CoffeeChatDao.prototype.createCoffeeChat).toBeCalled();
    expect(result.submitter).toEqual(newChat.submitter);
    expect(result.otherMember).toEqual(newChat.otherMember);
  });

  test('getAllCoffeeChats should return all coffee chats', async () => {
    const coffeeChats = await getAllCoffeeChats();
    expect(coffeeChats.length).toBeGreaterThan(0);
    expect(CoffeeChatDao.prototype.getAllCoffeeChats).toBeCalled();
  });

  test('getCoffeeChatsByUser should return user coffee chats', async () => {
    const coffeeChats = await getCoffeeChatsByUser(adminUser);
    expect(coffeeChats.length).toBeGreaterThan(0);
    expect(CoffeeChatDao.prototype.getCoffeeChatsByUser).toBeCalled();
  });

  test('createCoffeeChat should successfully create a coffee chat', async () => {
    const coffeeChat = fakeCoffeeChat();
    const newChat = { ...coffeeChat, submitter: adminUser, otherMember: fakeIdolMember() };
    const result = await createCoffeeChat(newChat, adminUser);

    expect(CoffeeChatDao.prototype.createCoffeeChat).toBeCalled();
    expect(result.submitter).toEqual(newChat.submitter);
    expect(result.otherMember).toEqual(newChat.otherMember);
  });

  test('updateCoffeeChat should successfully update a coffee chat', async () => {
    const updatedChat = await updateCoffeeChat(fakeCoffeeChat(), adminUser);
    expect(CoffeeChatDao.prototype.updateCoffeeChat).toBeCalled();
    expect(updatedChat).toBeDefined();
  });

  test('deleteCoffeeChat should successfully delete a coffee chat', async () => {
    const coffeeChat = fakeCoffeeChat();
    const newChat = { ...coffeeChat, submitter: adminUser, otherMember: fakeIdolMember() };
    await createCoffeeChat(newChat, adminUser);

    await deleteCoffeeChat(newChat.uuid, adminUser);
    expect(CoffeeChatDao.prototype.deleteCoffeeChat).toBeCalled();
  });
});
