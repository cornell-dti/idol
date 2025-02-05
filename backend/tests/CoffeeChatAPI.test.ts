import CoffeeChatDao from '../src/dao/CoffeeChatDao'; // eslint-disable-line @typescript-eslint/no-unused-vars
import PermissionsManager from '../src/utils/permissionsManager';
import { fakeIdolMember, fakeCoffeeChat, fakeIdolLead } from './data/createData';
import {
  getAllCoffeeChats,
  getCoffeeChatsByUser,
  createCoffeeChat,
  updateCoffeeChat,
  deleteCoffeeChat,
  clearAllCoffeeChats,
  checkMemberMeetsCategory
} from '../src/API/coffeeChatAPI';
import { setMember, deleteMember } from '../src/API/memberAPI';
import { PermissionError } from '../src/utils/errors';

const user = fakeIdolMember();
const user2 = fakeIdolMember();
const coffeeChat = { ...fakeCoffeeChat(), submitter: user, otherMember: user2 };

describe('User is not lead or admin', () => {
  beforeAll(() => {
    const mockIsLeadOrAdmin = jest.fn().mockResolvedValue(false);
    const mockGetCoffeeChatsByUser = jest.fn().mockResolvedValue([coffeeChat]);
    PermissionsManager.isLeadOrAdmin = mockIsLeadOrAdmin;
    PermissionsManager.isClearAllCoffeeChatsDisabled = jest.fn().mockResolvedValue(false);
    CoffeeChatDao.prototype.getCoffeeChatsByUser = mockGetCoffeeChatsByUser;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('createCoffeeChat should throw error if submitter does not match person making request', async () => {
    const chat = { ...coffeeChat, submitter: user2, otherMember: user };
    await expect(createCoffeeChat(chat, user)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have permissions to create coffee chat.`
      )
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

    await expect(deleteCoffeeChat('fake-uuid', user2)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have sufficient permissions to delete coffee chat.`
      )
    );
  });

  test('deleteCoffeeChat should pass if submitter is making the request', async () => {
    const mockGetCoffeeChat = jest.fn().mockResolvedValue(coffeeChat);
    CoffeeChatDao.prototype.getCoffeeChat = mockGetCoffeeChat;

    await expect(deleteCoffeeChat('fake-uuid', user)).resolves.not.toThrow();
  });

  test('clearAllCoffeeChats should throw permission error', async () => {
    await expect(clearAllCoffeeChats(user)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have sufficient permissions to delete all coffee chats.`
      )
    );
  });

  test('clearAllCoffeeChats is disabled', async () => {
    PermissionsManager.isClearAllCoffeeChatsDisabled = jest.fn().mockResolvedValue(true);
    await expect(clearAllCoffeeChats(user)).rejects.toThrow(
      new PermissionError('Clearing all Coffee Chats is disabled')
    );
  });

  test('getCoffeeChatsByUser user can fetch own coffee chats', async () => {
    const coffeeChats = await getCoffeeChatsByUser(user, user.email);
    expect(coffeeChats.length).toBeGreaterThan(0);
    expect(CoffeeChatDao.prototype.getCoffeeChatsByUser).toBeCalled();
  });

  test("getCoffeeChatsByUser should throw error if non-admin requests for other user's coffee chats", async () => {
    expect(getCoffeeChatsByUser(user, user2.email)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have permissions to get coffee chats for user with email ${user2.email}.`
      )
    );
  });
});

describe('User is lead or admin', () => {
  const adminUser = fakeIdolLead();
  const submitter = fakeIdolMember();
  const otherMember = fakeIdolMember();
  const mockCoffeeChat = fakeCoffeeChat();

  beforeAll(() => {
    const mockIsLeadOrAdmin = jest.fn().mockResolvedValue(true);
    const mockGetAllCoffeeChats = jest.fn().mockResolvedValue([fakeCoffeeChat()]);
    const mockGetCoffeeChatsByUser = jest
      .fn()
      .mockImplementation((submitter, otherMember) => (!otherMember ? [fakeCoffeeChat()] : []));
    const mockCreateCoffeeChat = jest.fn().mockResolvedValue(mockCoffeeChat);
    const mockUpdateCoffeeChat = jest.fn().mockResolvedValue(fakeCoffeeChat());
    const mockDeleteCoffeeChat = jest.fn().mockResolvedValue(undefined);

    PermissionsManager.isLeadOrAdmin = mockIsLeadOrAdmin;
    CoffeeChatDao.prototype.getAllCoffeeChats = mockGetAllCoffeeChats;
    CoffeeChatDao.prototype.getCoffeeChatsByUser = mockGetCoffeeChatsByUser;
    CoffeeChatDao.prototype.createCoffeeChat = mockCreateCoffeeChat;
    CoffeeChatDao.prototype.updateCoffeeChat = mockUpdateCoffeeChat;
    CoffeeChatDao.prototype.deleteCoffeeChat = mockDeleteCoffeeChat;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('createCoffeeChat should allow an admin user to create coffee chat for other user', async () => {
    const result = await createCoffeeChat(
      { ...fakeCoffeeChat(), submitter, otherMember },
      adminUser
    );
    expect(CoffeeChatDao.prototype.createCoffeeChat).toBeCalled();
    expect(result.submitter).toEqual(mockCoffeeChat.submitter);
    expect(result.otherMember).toEqual(mockCoffeeChat.otherMember);
  });

  test('getAllCoffeeChats should return all coffee chats', async () => {
    const coffeeChats = await getAllCoffeeChats();
    expect(coffeeChats.length).toBeGreaterThan(0);
    expect(CoffeeChatDao.prototype.getAllCoffeeChats).toBeCalled();
  });

  test('getCoffeeChatsByUser should return user coffee chats', async () => {
    const coffeeChats = await getCoffeeChatsByUser(adminUser, user.email);
    expect(coffeeChats.length).toBeGreaterThan(0);
    expect(CoffeeChatDao.prototype.getCoffeeChatsByUser).toBeCalled();
  });

  test('createCoffeeChat should successfully create a coffee chat', async () => {
    const coffeeChat = fakeCoffeeChat();
    const result = await createCoffeeChat(
      { ...coffeeChat, submitter: adminUser, otherMember: fakeIdolMember() },
      adminUser
    );

    expect(CoffeeChatDao.prototype.createCoffeeChat).toBeCalled();
    expect(result.submitter).toEqual(mockCoffeeChat.submitter);
    expect(result.otherMember).toEqual(mockCoffeeChat.otherMember);
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

describe('More complicated member meets category checks', () => {
  const admin = { ...fakeIdolLead() };
  const user1 = fakeIdolMember();
  const user2 = { ...fakeIdolMember(), role: 'dev-advisor' as Role };
  const user3 = { ...fakeIdolMember(), role: 'tpm' as Role };
  const user4 = { ...fakeIdolMember(), semesterJoined: 'Spring 2025' };

  beforeAll(async () => {
    const users = [user1, user2, user3, user4];
    await Promise.all(users.map((user) => setMember(user, admin)));
  });

  afterAll(async () => {
    const users = [user1, user2, user3, user4];
    await Promise.all(users.map((user) => deleteMember(user.email, admin)));
  });

  test('is an advisor', async () => {
    const result = await checkMemberMeetsCategory(user1.email, user2.email, 'is an advisor');
    expect(result.status).toBe('pass');
    expect(result.message).toBe('');
  });

  test('is not an advisor', async () => {
    const result = await checkMemberMeetsCategory(user1.email, user3.email, 'is an advisor');
    expect(result.status).toBe('fail');
    expect(result.message).toBe(`${user3.firstName} ${user3.lastName} is not an advisor`);
  });

  test('is newbie', async () => {
    const result = await checkMemberMeetsCategory(user1.email, user3.email, 'a newbie');
    expect(result.status).toBe('pass');
    expect(result.message).toBe('');
  });
  
  test('is newbie', async () => {
    const result = await checkMemberMeetsCategory(user1.email, user2.email, 'a newbie');
    expect(result.status).toBe('fail');
    expect(result.message).toBe(`${user2.firstName} ${user2.lastName} is not an advisor`);
  });
});
