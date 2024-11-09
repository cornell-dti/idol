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

describe('User is not lead or admin', () => {
  beforeAll(() => {
    const mockIsLeadOrAdmin = jest.fn().mockResolvedValue(false);
    const mockGetCoffeeChatsByUser = jest.fn().mockResolvedValue([coffeeChat]);
    PermissionsManager.isLeadOrAdmin = mockIsLeadOrAdmin;
    PermissionsManager.isClearAllCoffeeChatsDisabled = jest.fn().mockResolvedValue(false);
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

  afterEach(() => {
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
    const coffeeChats = await getCoffeeChatsByUser(adminUser);
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
  const user1 = { ...fakeIdolMember(), subteams: ['team1'], role: 'developer' };
  const user2 = { ...fakeIdolMember(), role: 'pm', subteams: ['team2'] };
  const user3 = { ...fakeIdolMember(), role: 'pm', subteams: ['team1'] };
  const user4 = { ...fakeIdolMember(), role: 'business' };
  const user5 = { ...fakeIdolMember(), role: 'tpm', subteams: ['team3'] };
  const user6 = { ...fakeIdolMember(), role: 'tpm', subteams: ['team1'] };
  const user7 = { ...fakeIdolMember(), role: 'lead' };
  const memberProperties7 = { leadType: 'pm' };
  const user8 = { ...fakeIdolMember(), role: 'lead' };
  const memberProperties8 = { leadType: 'developer' };
  const user9 = { ...fakeIdolMember(), role: 'lead' };
  const user10 = { ...fakeIdolMember(), role: 'lead' };

  beforeAll(async () => {
    const users = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10];
    await Promise.all(users.map((user) => setMember(user, admin)));
    await CoffeeChatDao.createMemberProperties(user7.email, memberProperties7);
    await CoffeeChatDao.createMemberProperties(user8.email, memberProperties8);
  });

  afterAll(async () => {
    const users = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10];
    await Promise.all(users.map((user) => deleteMember(user.email, admin)));
    await CoffeeChatDao.deleteMemberProperties(user7.email);
    await CoffeeChatDao.deleteMemberProperties(user8.email);
  });

  test('pm that is not on same team', async () => {
    const result = await checkMemberMeetsCategory(user2.email, user1.email, 'a pm (not your team)');
    expect(result.status).toBe('pass');
    expect(result.message).toBe('');
  });

  test('pm that is on same team', async () => {
    const result = await checkMemberMeetsCategory(user3.email, user1.email, 'a pm (not your team)');
    expect(result.status).toBe('fail');
    expect(result.message).toBe(
      `${user3.firstName} ${user3.lastName} is a PM, but is on the same team as ${user1.firstName} ${user1.lastName}`
    );
  });

  test('not a pm', async () => {
    const result = await checkMemberMeetsCategory(user4.email, user1.email, 'a pm (not your team)');
    expect(result.status).toBe('fail');
    expect(result.message).toBe(`${user4.firstName} ${user4.lastName} is not a PM`);
  });

  test('tpm that is not on same team', async () => {
    const result = await checkMemberMeetsCategory(
      user5.email,
      user1.email,
      'a tpm (not your team)'
    );
    expect(result.status).toBe('pass');
    expect(result.message).toBe('');
  });

  test('tpm that is on same team', async () => {
    const result = await checkMemberMeetsCategory(
      user6.email,
      user1.email,
      'a tpm (not your team)'
    );
    expect(result.status).toBe('fail');
    expect(result.message).toBe(
      `${user6.firstName} ${user6.lastName} is a TPM, but is on the same team as ${user1.firstName} ${user1.lastName}`
    );
  });

  test('not a tpm', async () => {
    const result = await checkMemberMeetsCategory(
      user4.email,
      user1.email,
      'a tpm (not your team)'
    );
    expect(result.status).toBe('fail');
    expect(result.message).toBe(`${user4.firstName} ${user4.lastName} is not a TPM`);
  });

  test('a lead that is not same role', async () => {
    const result = await checkMemberMeetsCategory(
      user7.email,
      user1.email,
      'a lead (not your role)'
    );
    expect(result.status).toBe('pass');
    expect(result.message).toBe('');
  });

  test('a lead that is the same role', async () => {
    const result = await checkMemberMeetsCategory(
      user8.email,
      user1.email,
      'a lead (not your role)'
    );
    expect(result.status).toBe('fail');
    expect(result.message).toBe(
      `${user8.firstName} ${user8.lastName} is a lead, but from the same role (${memberProperties8.leadType}) as ${user1.firstName} ${user1.lastName}`
    );
  });

  test('not a lead', async () => {
    const result = await checkMemberMeetsCategory(
      user4.email,
      user1.email,
      'a lead (not your role)'
    );
    expect(result.status).toBe('fail');
    expect(result.message).toBe(`${user4.firstName} ${user4.lastName} is not a lead`);
  });

  test('should pass but otherMemberProperties undefined', async () => {
    const result = await checkMemberMeetsCategory(
      user9.email,
      user1.email,
      'a lead (not your role)'
    );
    expect(result.status).toBe('no data');
    expect(result.message).toBe('');
  });

  test('should pass but submitterProperties undefined', async () => {
    const result = await checkMemberMeetsCategory(
      user7.email,
      user9.email,
      'a lead (not your role)'
    );
    expect(result.status).toBe('no data');
    expect(result.message).toBe('');
  });

  test('both submitterProperties and otherMemberProperties undefined', async () => {
    const result = await checkMemberMeetsCategory(
      user9.email,
      user10.email,
      'a lead (not your role)'
    );
    expect(result.status).toBe('no data');
    expect(result.message).toBe('');
  });
});
