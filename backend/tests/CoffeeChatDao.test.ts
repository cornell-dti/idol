/// <reference types="jest" />
/// <reference types="common-types" />
import CoffeeChatDao from '../src/dao/CoffeeChatDao';
import { fakeCoffeeChat, fakeIdolMember } from './data/createData';
import { coffeeChatCategoriesCollection, coffeeChatsCollection, memberCollection } from '../src/firebase';
import { DELETED_MEMBER } from '../src/utils/memberUtil';

const user = fakeIdolMember();
const user2 = fakeIdolMember();
const mockCC = { ...fakeCoffeeChat(), submitter: user };
const mockCC2 = { ...fakeCoffeeChat(), status: 'approved' as Status, submitter: user };
const mockCC3 = { ...fakeCoffeeChat(), submitter: user, otherMember: user2 };

const coffeeChatDao = new CoffeeChatDao();

beforeAll(async () => {
  await coffeeChatDao.createCoffeeChat(mockCC);
  await coffeeChatDao.createCoffeeChat(mockCC2);
  await coffeeChatDao.createCoffeeChat(mockCC3);
  // createCoffeeChat always stores status pending, so write the approved status back.
  await coffeeChatDao.updateCoffeeChat(mockCC2);
});

/* Cleanup database after running CoffeeChatDao tests */
afterAll(async () => {
  await coffeeChatsCollection.doc(mockCC.uuid).delete();
  await coffeeChatsCollection.doc(mockCC2.uuid).delete();
  await coffeeChatsCollection.doc(mockCC3.uuid).delete();
});

test('Get coffee chat by user', () =>
  coffeeChatDao.getCoffeeChatsByUser(user.email).then((coffeeChats) => {
    expect(coffeeChats.some((submission) => submission === mockCC));
    expect(coffeeChats.some((submission) => submission === mockCC2));
    expect(coffeeChats.some((submission) => submission === mockCC3));
  }));

test('Get coffee chat by user with status', () =>
  coffeeChatDao.getCoffeeChatsByUser(user.email, 'approved').then((coffeeChats) => {
    expect(coffeeChats.some((submission) => submission.uuid === mockCC.uuid)).toBe(false);
    expect(coffeeChats.some((submission) => submission.uuid === mockCC2.uuid)).toBe(true);
    expect(coffeeChats.some((submission) => submission.uuid === mockCC3.uuid)).toBe(false);
  }));

test('Get coffee chat by user with other member', () =>
  coffeeChatDao.getCoffeeChatsByUser(user.email, undefined, user2).then((coffeeChats) => {
    expect(coffeeChats.some((submission) => submission === mockCC)).toBe(false);
    expect(coffeeChats.some((submission) => submission === mockCC2)).toBe(false);
    expect(coffeeChats.some((submission) => submission === mockCC3));
  }));

describe('CoffeeChatDao category membership', () => {
  jest.setTimeout(30000);

  const runId = Date.now() * 10 + Math.floor(Math.random() * 1000);
  const ada: MemberDetails = { name: 'Ada Lovelace', netid: `ada-${runId}` };
  const grace: MemberDetails = { name: 'Grace Hopper', netid: `grace-${runId}` };
  const newbieCategory = `a newbie ${runId}`;
  const instrumentCategory = `plays an instrument ${runId}`;
  const animeCategory = `likes anime ${runId}`;
  const indices = [runId, runId + 1, runId + 2];
  const freshCategories = (): CoffeeChatCategory[] => [
    { name: newbieCategory, members: [ada], index: indices[0] },
    { name: instrumentCategory, members: [ada, grace], index: indices[1] },
    { name: animeCategory, members: [], index: indices[2] }
  ];

  beforeEach(async () => {
    await CoffeeChatDao.setMemberCategories(ada, []);
    await CoffeeChatDao.setMemberCategories(grace, []);
    await CoffeeChatDao.updateCategories(freshCategories());
  });

  afterAll(async () => {
    await CoffeeChatDao.setMemberCategories(ada, []);
    await CoffeeChatDao.setMemberCategories(grace, []);
    await Promise.all(
      indices.map((index) => coffeeChatCategoriesCollection.doc(String(index)).delete())
    );
  });

  test('getCategoryNamesForMember returns the categories that list the member, in board order', async () => {
    await expect(CoffeeChatDao.getCategoryNamesForMember(ada.netid)).resolves.toEqual([
      newbieCategory,
      instrumentCategory
    ]);
  });

  test('getCategoryNamesForMember matches netid without case sensitivity', async () => {
    await expect(CoffeeChatDao.getCategoryNamesForMember(ada.netid.toUpperCase())).resolves.toEqual(
      [newbieCategory, instrumentCategory]
    );
  });

  test('getCategoryNamesForMember returns an empty list when the member is on none', async () => {
    await expect(CoffeeChatDao.getCategoryNamesForMember(`missing-${runId}`)).resolves.toEqual([]);
  });

  test('setMemberCategories adds the member to selected categories and removes them from the rest', async () => {
    const saved = await CoffeeChatDao.setMemberCategories(ada, [animeCategory]);

    expect(saved).toEqual([animeCategory]);
    await expect(CoffeeChatDao.getCategoryNamesForMember(ada.netid)).resolves.toEqual([
      animeCategory
    ]);

    const categories = await CoffeeChatDao.getAllCategories();
    const instrument = categories.find((category) => category.index === indices[1]);
    expect(instrument?.members).toEqual([grace]);
  });

  test('selecting a category the member is already on does not duplicate them', async () => {
    await CoffeeChatDao.setMemberCategories(ada, [newbieCategory, instrumentCategory]);

    const categories = await CoffeeChatDao.getAllCategories();
    const newbie = categories.find((category) => category.index === indices[0]);
    expect(newbie?.members.filter((member) => member.netid === ada.netid)).toEqual([ada]);
  });

  test('a later submission replaces the earlier one', async () => {
    await CoffeeChatDao.setMemberCategories(grace, [newbieCategory, animeCategory]);
    const saved = await CoffeeChatDao.setMemberCategories(grace, [instrumentCategory]);

    expect(saved).toEqual([instrumentCategory]);
    await expect(CoffeeChatDao.getCategoryNamesForMember(grace.netid)).resolves.toEqual([
      instrumentCategory
    ]);
    await expect(CoffeeChatDao.getCategoryNamesForMember(ada.netid)).resolves.toEqual([
      newbieCategory,
      instrumentCategory
    ]);
describe('Coffee chats with deleted members', () => {
  const activeSubmitter = fakeIdolMember();
  const deletedOtherMember = fakeIdolMember();

  const chatWithDeletedOtherMember = {
    ...fakeCoffeeChat(),
    submitter: activeSubmitter,
    otherMember: deletedOtherMember
  };

  beforeAll(async () => {
    await memberCollection.doc(activeSubmitter.email).set(activeSubmitter);
    await coffeeChatDao.createCoffeeChat(chatWithDeletedOtherMember);
  });

  afterAll(async () => {
    await coffeeChatsCollection.doc(chatWithDeletedOtherMember.uuid).delete();
    await memberCollection.doc(activeSubmitter.email).delete();
  });

  test('Deleted other member resolves to DELETED_MEMBER', async () => {
    const chat = await coffeeChatDao.getCoffeeChat(chatWithDeletedOtherMember.uuid);
    expect(chat?.otherMember).toEqual(DELETED_MEMBER);
    expect(chat?.submitter.email).toBe(activeSubmitter.email);
  });

  test('Submitter still gets credit for chat with a deleted member', async () => {
    const chats = await coffeeChatDao.getCoffeeChatsByUser(activeSubmitter.email);
    const chat = chats.find((c) => c.uuid === chatWithDeletedOtherMember.uuid);
    expect(chat).toBeDefined();
    expect(chat?.otherMember).toEqual(DELETED_MEMBER);
  });

  test('Updating a chat with a deleted member keeps the original member reference', async () => {
    const chat = await coffeeChatDao.getCoffeeChat(chatWithDeletedOtherMember.uuid);
    await coffeeChatDao.updateCoffeeChat({ ...chat!, status: 'approved' });

    const stored = (await coffeeChatsCollection.doc(chatWithDeletedOtherMember.uuid).get()).data();
    expect(stored?.status).toBe('approved');
    expect((stored?.otherMember as FirebaseFirestore.DocumentReference).id).toBe(
      deletedOtherMember.email
    );
  });
});

describe('Coffee chats submitted by a member who was later deleted', () => {
  // Typically intended use does not require this, but is tested anyways
  const deletedSubmitter = fakeIdolMember();
  const activeOtherMember = fakeIdolMember();

  const chatWithDeletedSubmitter = {
    ...fakeCoffeeChat(),
    submitter: deletedSubmitter,
    otherMember: activeOtherMember
  };

  beforeAll(async () => {
    await memberCollection.doc(deletedSubmitter.email).set(deletedSubmitter);
    await memberCollection.doc(activeOtherMember.email).set(activeOtherMember);
    await coffeeChatDao.createCoffeeChat(chatWithDeletedSubmitter);
    await memberCollection.doc(deletedSubmitter.email).delete();
  });

  afterAll(async () => {
    await coffeeChatsCollection.doc(chatWithDeletedSubmitter.uuid).delete();
    await memberCollection.doc(activeOtherMember.email).delete();
  });

  test('Deleted submitter resolves to DELETED_MEMBER', async () => {
    const chat = await coffeeChatDao.getCoffeeChat(chatWithDeletedSubmitter.uuid);
    expect(chat?.submitter).toEqual(DELETED_MEMBER);
    expect(chat?.otherMember.email).toBe(activeOtherMember.email);
  });

  test('Chat with a deleted submitter is excluded from all coffee chats', async () => {
    const chats = await coffeeChatDao.getAllCoffeeChats();
    expect(chats.some((c) => c.uuid === chatWithDeletedSubmitter.uuid)).toBe(false);
  });

  test('Chat with a deleted submitter is excluded from their submissions', async () => {
    const chats = await coffeeChatDao.getCoffeeChatsByUser(deletedSubmitter.email);
    expect(chats.some((c) => c.uuid === chatWithDeletedSubmitter.uuid)).toBe(false);
  });
});
