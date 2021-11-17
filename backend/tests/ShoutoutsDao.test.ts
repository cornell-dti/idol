import MembersDao from '../src/dao/MembersDao';
import ShoutoutsDao from '../src/dao/ShoutoutsDao';
import { approvedMemberCollection } from '../src/firebase';
import shoutoutData from './data/mock-shoutouts.json';

const mockShoutout1 = {
  giver: shoutoutData.users.muser1,
  receiver: shoutoutData.users.muser2,
  message: 'Mock Shoutout',
  isAnon: false
};

/* Adding mock users for testing sign-ins */
beforeAll(async () => {
  await MembersDao.setMember(shoutoutData.users.muser1.email, shoutoutData.users.muser1);
  await MembersDao.setMember(shoutoutData.users.muser2.email, shoutoutData.users.muser2);
});

/* Cleanup database after running tests */
/* TODO: clean shoutout database */
afterAll(async () => {
  Promise.all(
    Object.keys(shoutoutData.users).map(async (netid) => {
      const mockUser = shoutoutData.users[netid];
      await MembersDao.deleteMember(mockUser.email);
      await approvedMemberCollection.doc(mockUser.email).delete();
      return mockUser;
    })
  );
});

test('Send shoutout', async () => {
  await ShoutoutsDao.setShoutout(mockShoutout1);
  const allShoutouts = await ShoutoutsDao.getAllShoutouts();
  expect(allShoutouts).toContainEqual(mockShoutout1);
});

test('Get received shoutouts', async () => {
  const shoutoutsReceived = await ShoutoutsDao.getShoutouts(
    shoutoutData.users.muser2.email,
    'received'
  );
  expect(shoutoutsReceived).toContainEqual(mockShoutout1);
});

test('Get sent shoutout', async () => {
  const shoutoutsSent = await ShoutoutsDao.getShoutouts(shoutoutData.users.muser1.email, 'given');
  expect(shoutoutsSent).toContainEqual(mockShoutout1);
});
