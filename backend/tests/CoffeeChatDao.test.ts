/// <reference types="jest" />
import CoffeeChatDao from '../src/dao/CoffeeChatDao';
import { fakeCoffeeChat, fakeIdolMember } from './data/createData';
import { coffeeChatCategoriesCollection, coffeeChatsCollection } from '../src/firebase';

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
    expect(coffeeChats.some((submission) => submission === mockCC)).toBe(false);
    expect(coffeeChats.some((submission) => submission === mockCC2));
    expect(coffeeChats.some((submission) => submission === mockCC3)).toBe(false);
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
  const newbieCategory = 'a newbie';
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
  });
});
