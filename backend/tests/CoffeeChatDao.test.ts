import CoffeeChatDao from '../src/dao/CoffeeChatDao';
import { fakeCoffeeChat, fakeIdolMember } from './data/createData';
import { coffeeChatsCollection } from '../src/firebase';

const user = fakeIdolMember();
const user2 = fakeIdolMember();
const mockCC = { ...fakeCoffeeChat(), submitter: user };
const mockCC2 = { ...fakeCoffeeChat(), status: 'accepted' as Status, submitter: user };
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
  coffeeChatDao.getCoffeeChatsByUser(user.email, 'accepted' as Status).then((coffeeChats) => {
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
