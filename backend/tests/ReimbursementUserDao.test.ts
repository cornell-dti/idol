import ReimbursementUserDao from '../src/dao/ReimbursementUserDao';
import { fakeReimbursementUser } from './data/createData';

const userDao = new ReimbursementUserDao();
const testUser = fakeReimbursementUser();

afterAll(async () => {
  await userDao.deleteUser(testUser.userId);
});

test('Create, read, and update reimbursement user', async () => {
  // Create
  await userDao.createUser(testUser);
  const fetchedUser = await userDao.getUser(testUser.userId);
  expect(fetchedUser).toEqual(testUser);

  // Update
  const updatedUser = { ...testUser, phoneNumber: '555-9999' };
  await userDao.updateUser(updatedUser);
  const refetchedUser = await userDao.getUser(testUser.userId);
  expect(refetchedUser?.phoneNumber).toBe('555-9999');
});
