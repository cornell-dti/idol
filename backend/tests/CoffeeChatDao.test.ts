import CoffeeChatDao from '../src/dao/CoffeeChatDao';
import { fakeCoffeeChat, fakeIdolMember } from './data/createData';
import { coffeeChatsCollection, memberCollection } from '../src/firebase';
import { DELETED_MEMBER } from '../src/utils/memberUtil';

const user = fakeIdolMember();
const user2 = fakeIdolMember();
const mockCC = { ...fakeCoffeeChat(), submitter: user };
const mockCC2 = { ...fakeCoffeeChat(), status: 'accepted', submitter: user };
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
  coffeeChatDao.getCoffeeChatsByUser(user.email, 'accepted').then((coffeeChats) => {
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
