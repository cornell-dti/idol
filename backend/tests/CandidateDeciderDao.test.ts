import CandidateDeciderDao from '../src/dao/CandidateDeciderDao';
import { candidateDeciderCollection } from '../src/firebase';
import { fakeCandidateDeciderInstance, fakeRating, fakeIdolMember } from './data/createData';

const candidateDeciderDao = new CandidateDeciderDao();

const mockUser = { ...fakeIdolMember() };
const mockCDI = { ...fakeCandidateDeciderInstance(), uuid: 'testUuid' };
const newMockCDI = { ...fakeCandidateDeciderInstance(), uuid: 'testUuid', isOpen: true };
const mockComment = 'testComment';
const mockRating = fakeRating();

beforeAll(async () => {
  await candidateDeciderDao.createNewInstance(mockCDI);
});

afterAll(async () => {
  await candidateDeciderCollection.doc(mockCDI.uuid).delete();
});

test('Get all instances', () =>
  candidateDeciderDao.getAllInstances().then((allInstances) => {
    expect(allInstances.some((instance) => instance === mockCDI));
  }));

test('Get instance by uuid', () =>
  candidateDeciderDao.getInstance('testUUid').then((attendance) => {
    expect(attendance === mockCDI);
  }));

test('Update instance', () =>
  candidateDeciderDao.updateInstance(newMockCDI).then((instance) => {
    expect(instance.uuid === mockCDI.uuid);
    expect(instance.isOpen);
  }));

test('Delete instance', () => {
  candidateDeciderDao.deleteInstance(mockCDI.uuid);
  candidateDeciderDao.getAllInstances().then((allInstances) => {
    expect(allInstances.every((instance) => instance !== mockCDI));
  });
});

test('Update instance with transaction', async () => {
  const promises: Promise<CandidateDeciderInstance>[] = [];

  // Execute multiple concurrent update operations
  const mockIDs = [1, 2, 3, 4, 5];
  for (const mockID of mockIDs) {
    promises.push(
      candidateDeciderDao.updateInstanceWithTransaction(
        mockCDI,
        mockUser,
        mockID,
        mockRating,
        mockComment
      )
    );
  }

  const results = await Promise.all(promises);

  // Verify proper number of candidates are rated
  expect(results[4].candidates.length === 5);
});
