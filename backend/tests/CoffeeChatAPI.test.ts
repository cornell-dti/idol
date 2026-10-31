/// <reference types="jest" />
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
  checkMemberMeetsCategory,
  runAutoChecker,
  getCoffeeChatCategoriesByUser,
  getCoffeeChatCategoryForm,
  submitCoffeeChatCategoryResponse
} from '../src/API/coffeeChatAPI';
import { coffeeChatCategoriesCollection, memberCollection } from '../src/firebase';
import { setMember } from '../src/API/memberAPI';
import { BadRequestError, PermissionError } from '../src/utils/errors';

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
        'Cannot create coffee chat with member. Coffee chats from current or previous semesters exist.'
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

describe('runAutoChecker tests', () => {
  const adminUser = fakeIdolLead();
  const submitter = fakeIdolMember();
  const otherMember = fakeIdolMember();
  const coffeeChat = { ...fakeCoffeeChat(), submitter, otherMember };

  beforeAll(() => {
    const mockIsLeadOrAdmin = jest.fn().mockResolvedValue(true);
    PermissionsManager.isLeadOrAdmin = mockIsLeadOrAdmin;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('runAutoChecker should throw error if coffee chat does not exist', async () => {
    const mockGetCoffeeChat = jest.fn().mockResolvedValue(null);
    CoffeeChatDao.prototype.getCoffeeChat = mockGetCoffeeChat;

    await expect(runAutoChecker('fake-uuid', adminUser)).rejects.toThrow(
      new BadRequestError(`Coffee chat with uuid: fake-uuid does not exist`)
    );
  });

  test('runAutoChecker should mark memberMeetsCategory as fail if archived chat exists', async () => {
    const mockGetCoffeeChat = jest.fn().mockResolvedValue(coffeeChat);
    const mockGetCoffeeChatsByUser = jest
      .fn()
      .mockResolvedValue([{ ...coffeeChat, isArchived: true }]);
    const mockUpdateCoffeeChat = jest.fn().mockResolvedValue({
      ...coffeeChat,
      memberMeetsCategory: 'fail',
      errorMessage: `An archived chat already exists between ${coffeeChat.submitter.firstName} and ${coffeeChat.otherMember.firstName}.`
    });

    CoffeeChatDao.prototype.getCoffeeChat = mockGetCoffeeChat;
    CoffeeChatDao.prototype.getCoffeeChatsByUser = mockGetCoffeeChatsByUser;
    CoffeeChatDao.prototype.updateCoffeeChat = mockUpdateCoffeeChat;

    const result = await runAutoChecker(coffeeChat.uuid, adminUser);
    expect(result.memberMeetsCategory).toBe('fail');
    expect(result.errorMessage).toContain('archived chat');
  });

  test('runAutoChecker should update coffee chat if no archived chat exists', async () => {
    const mockGetCoffeeChat = jest.fn().mockResolvedValue(coffeeChat);
    const mockGetCoffeeChatsByUser = jest.fn().mockResolvedValue([]);
    const mockUpdateCoffeeChat = jest.fn().mockResolvedValue(coffeeChat);
    CoffeeChatDao.prototype.getCoffeeChat = mockGetCoffeeChat;
    CoffeeChatDao.prototype.getCoffeeChatsByUser = mockGetCoffeeChatsByUser;
    CoffeeChatDao.prototype.updateCoffeeChat = mockUpdateCoffeeChat;

    const result = await runAutoChecker(coffeeChat.uuid, adminUser);
    expect(result).toBeDefined();
    expect(CoffeeChatDao.prototype.updateCoffeeChat).toBeCalled();
  });
});

describe('member coffee chat category responses', () => {
  jest.setTimeout(30000);

  const runId = Date.now() * 10 + Math.floor(Math.random() * 1000);
  const newbieCategory = `a newbie ${runId}`;
  const instrumentCategory = `plays an instrument ${runId}`;
  const indices = [runId, runId + 1];
  const admin = fakeIdolLead();
  const newbie = {
    ...fakeIdolMember(),
    netid: `newbie-${runId}`,
    firstName: 'New',
    lastName: 'Member',
    semesterJoined: 'Fall 2026'
  };
  const veteran = {
    ...fakeIdolMember(),
    netid: `veteran-${runId}`,
    firstName: 'Veteran',
    lastName: 'Member',
    semesterJoined: 'Fall 2024'
  };
  const details = (member: IdolMember): MemberDetails => ({
    name: `${member.firstName} ${member.lastName}`,
    netid: member.netid
  });
  const freshCategories = (): CoffeeChatCategory[] => [
    { name: newbieCategory, members: [], index: indices[0] },
    { name: instrumentCategory, members: [details(newbie)], index: indices[1] }
  ];
  const originalIsLeadOrAdmin = PermissionsManager.isLeadOrAdmin;

  beforeAll(async () => {
    PermissionsManager.isLeadOrAdmin = jest.fn().mockResolvedValue(true);
    await Promise.all([newbie, veteran].map((member) => setMember(member, admin)));
  });

  beforeEach(async () => {
    await CoffeeChatDao.deleteCategoryResponse(newbie.netid);
    await CoffeeChatDao.deleteCategoryResponse(veteran.netid);
    await CoffeeChatDao.setMemberCategories(details(newbie), []);
    await CoffeeChatDao.setMemberCategories(details(veteran), []);
    await CoffeeChatDao.updateCategories(freshCategories());
  });

  afterAll(async () => {
    try {
      await CoffeeChatDao.deleteCategoryResponse(newbie.netid);
      await CoffeeChatDao.deleteCategoryResponse(veteran.netid);
      await CoffeeChatDao.setMemberCategories(details(newbie), []);
      await CoffeeChatDao.setMemberCategories(details(veteran), []);
      await Promise.all(
        indices.map((index) => coffeeChatCategoriesCollection.doc(String(index)).delete())
      );
      await Promise.all(
        [newbie, veteran].map((member) => memberCollection.doc(member.email).delete())
      );
    } finally {
      PermissionsManager.isLeadOrAdmin = originalIsLeadOrAdmin;
    }
  });

  test('getCoffeeChatCategoriesByUser returns the categories that list this member', async () => {
    await expect(getCoffeeChatCategoriesByUser(newbie)).resolves.toEqual([instrumentCategory]);
    await expect(getCoffeeChatCategoriesByUser(veteran)).resolves.toEqual([]);
  });

  test('a new member can submit the categories they fit, including a newbie', async () => {
    const saved = await submitCoffeeChatCategoryResponse(
      [newbieCategory, instrumentCategory],
      newbie
    );

    expect(new Set(saved)).toEqual(new Set([newbieCategory, instrumentCategory]));
    const names = await getCoffeeChatCategoriesByUser(newbie);
    expect(new Set(names)).toEqual(new Set([newbieCategory, instrumentCategory]));
  });

  test('any member who selects a newbie meets that category', async () => {
    await submitCoffeeChatCategoryResponse([newbieCategory], veteran);

    const result = await checkMemberMeetsCategory(veteran.email, newbie.email, newbieCategory);
    expect(result).toEqual({ status: 'pass', message: '' });
  });

  test('a new member who does not select a newbie does not meet that category', async () => {
    await submitCoffeeChatCategoryResponse([instrumentCategory], newbie);

    const result = await checkMemberMeetsCategory(newbie.email, veteran.email, newbieCategory);
    expect(result).toEqual({
      status: 'fail',
      message: `New Member does not meet the category '${newbieCategory}'`
    });
  });

  test('a second submission is rejected and leaves the first response in place', async () => {
    await submitCoffeeChatCategoryResponse([newbieCategory, instrumentCategory], veteran);
    await expect(submitCoffeeChatCategoryResponse([], veteran)).rejects.toMatchObject({
      reason: 'You have already submitted your coffee chat categories.'
    });

    const names = await getCoffeeChatCategoriesByUser(veteran);
    expect(new Set(names)).toEqual(new Set([newbieCategory, instrumentCategory]));
    await expect(getCoffeeChatCategoryForm(veteran)).resolves.toMatchObject({ submitted: true });
  });

  test('submitting no categories still counts as the one submission', async () => {
    const saved = await submitCoffeeChatCategoryResponse([], veteran);
    expect(saved).toEqual([]);

    await expect(
      submitCoffeeChatCategoryResponse([instrumentCategory], veteran)
    ).rejects.toMatchObject({
      reason: 'You have already submitted your coffee chat categories.'
    });
    await expect(getCoffeeChatCategoriesByUser(veteran)).resolves.toEqual([]);
  });

  test('submit trims category names and ignores blanks', async () => {
    const saved = await submitCoffeeChatCategoryResponse(
      ['', '   ', `  ${instrumentCategory}  `],
      veteran
    );

    expect(saved).toEqual([instrumentCategory]);
  });

  test('submit rejects unknown category names without changing membership', async () => {
    const unknown = `not-a-category-${runId}`;
    await CoffeeChatDao.setMemberCategories(details(veteran), [newbieCategory, instrumentCategory]);
    await expect(
      submitCoffeeChatCategoryResponse([instrumentCategory, unknown], veteran)
    ).rejects.toMatchObject({
      reason: `Unknown coffee chat categories: ${unknown}`
    });
    const names = await getCoffeeChatCategoriesByUser(veteran);
    expect(new Set(names)).toEqual(new Set([newbieCategory, instrumentCategory]));
    await expect(CoffeeChatDao.hasSubmittedCategoryResponse(veteran.netid)).resolves.toBe(false);
  });

  test('submit rejects a payload that is not a list of category names', async () => {
    await expect(submitCoffeeChatCategoryResponse(newbieCategory, veteran)).rejects.toMatchObject({
      reason: 'Categories must be a list of category names.'
    });
    await expect(
      submitCoffeeChatCategoryResponse([newbieCategory, 1], veteran)
    ).rejects.toMatchObject({
      reason: 'Categories must be a list of category names.'
    });
  });
});
