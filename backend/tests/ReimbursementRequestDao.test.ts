import ReimbursementRequestDao from '../src/dao/ReimbursementRequestDao';
import { fakeReimbursementRequest } from './data/createData';

const requestDao = new ReimbursementRequestDao();
const testRequest = {
  ...fakeReimbursementRequest(),
  status: 'pending' as ReimbursementRequestStatus
};

afterAll(async () => {
  await requestDao.deleteRequest(testRequest.requestId);
});

test('Create request and update status with message', async () => {
  // Create
  await requestDao.createRequest(testRequest);
  const fetchedRequest = await requestDao.getRequest(testRequest.requestId);
  expect(fetchedRequest).toEqual(testRequest);

  // Add message
  const message: ReimbursementMessageEntry = {
    authorId: 'admin-123',
    authorRole: 'admin',
    content: 'Looks good!',
    sentAt: Date.now()
  };
  await requestDao.addMessage(testRequest.requestId, message);

  // Update status
  const updated = await requestDao.updateStatus(
    testRequest.requestId,
    'approved',
    'admin-123',
    'Approved'
  );
  expect(updated.status).toBe('approved');
  expect(updated.messages.length).toBe(1);
});
