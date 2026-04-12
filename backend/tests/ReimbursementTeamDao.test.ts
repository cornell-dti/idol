import ReimbursementTeamDao from '../src/dao/ReimbursementTeamDao';
import { fakeReimbursementTeam } from './data/createData';

const teamDao = new ReimbursementTeamDao();
const testTeam = fakeReimbursementTeam();

afterAll(async () => {
  await teamDao.deleteTeam(testTeam.teamId);
});

test('Create and update team totalSpent', async () => {
  // Create
  await teamDao.createTeam(testTeam);
  const fetchedTeam = await teamDao.getTeam(testTeam.teamId);
  expect(fetchedTeam).toEqual(testTeam);

  // Update totalSpent
  const initialSpent = testTeam.totalSpent;
  await teamDao.updateTotalSpent(testTeam.teamId, 250);
  const updatedTeam = await teamDao.getTeam(testTeam.teamId);
  expect(updatedTeam?.totalSpent).toBe(initialSpent + 250);
});
