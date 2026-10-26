import ReimbursementRequestDao from '../src/dao/ReimbursementRequestDao';
import ReimbursementTeamDao from '../src/dao/ReimbursementTeamDao';
import PermissionsManager from '../src/utils/permissionsManager';
import { fakeIdolLead, fakeReimbursementRequest } from './data/createData';
import { updateReimbursementRequestStatus } from '../src/API/reimbursementAPI';

describe('updateReimbursementRequestStatus totalSpent effects', () => {
  const user = fakeIdolLead();
  const updateTotalSpentMock = jest.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    PermissionsManager.isLeadOrAdmin = jest.fn().mockResolvedValue(true);
    ReimbursementTeamDao.prototype.updateTotalSpent = updateTotalSpentMock;
  });

  beforeEach(() => {
    updateTotalSpentMock.mockClear();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('increments totalSpent when transitioning to settled', async () => {
    const existing = { ...fakeReimbursementRequest(), status: 'approved', amount: 75 };
    ReimbursementRequestDao.prototype.getRequest = jest.fn().mockResolvedValue(existing);
    ReimbursementRequestDao.prototype.updateStatus = jest.fn().mockResolvedValue(existing);

    await updateReimbursementRequestStatus(existing.requestId, 'settled', '', user);
    expect(updateTotalSpentMock).toHaveBeenCalledWith(existing.teamId, 75);
  });

  test('decrements totalSpent when transitioning out of settled', async () => {
    const existing = { ...fakeReimbursementRequest(), status: 'settled', amount: 75 };
    ReimbursementRequestDao.prototype.getRequest = jest.fn().mockResolvedValue(existing);
    ReimbursementRequestDao.prototype.updateStatus = jest.fn().mockResolvedValue(existing);

    await updateReimbursementRequestStatus(existing.requestId, 'approved', '', user);
    expect(updateTotalSpentMock).toHaveBeenCalledWith(existing.teamId, -75);
  });

  test('does not touch totalSpent for non-settled transitions', async () => {
    const existing = { ...fakeReimbursementRequest(), status: 'pending', amount: 75 };
    ReimbursementRequestDao.prototype.getRequest = jest.fn().mockResolvedValue(existing);
    ReimbursementRequestDao.prototype.updateStatus = jest.fn().mockResolvedValue(existing);

    await updateReimbursementRequestStatus(existing.requestId, 'approved', '', user);
    expect(updateTotalSpentMock).not.toHaveBeenCalled();
  });
});
