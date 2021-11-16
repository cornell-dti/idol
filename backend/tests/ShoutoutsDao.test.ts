import MembersDao from '../src/dao/MembersDao';
import ShoutoutsDao from '../src/dao/ShoutoutsDao';
import { approvedMemberCollection } from '../src/firebase';
import mockUsers from './data/mock-users.json';

const mockShoutout1 = {
  giver: mockUsers.mu1,
  receiver: mockUsers.mu2,
  message: 'Mock Shoutout',
  isAnon: false
};

/* Adding mock users for testing sign-ins */
beforeAll(async () => {
  await MembersDao.setMember(mockUsers.mu1.email, mockUsers.mu1);
  await MembersDao.setMember(mockUsers.mu2.email, mockUsers.mu2);
});

/* Cleanup database after running tests */
/* TODO: clean shoutout database */
afterAll(async () => {
  Promise.all(
    Object.keys(mockUsers).map(async (netid) => {
      const mockUser = mockUsers[netid];
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
  const shoutoutsReceived = await ShoutoutsDao.getShoutouts(mockUsers.mu2.email, 'received');
  expect(shoutoutsReceived).toContainEqual(mockShoutout1);
});

test('Get sent shoutout', async () => {
  const shoutoutsSent = await ShoutoutsDao.getShoutouts(mockUsers.mu1.email, 'given');
  expect(shoutoutsSent).toContainEqual(mockShoutout1);
});
