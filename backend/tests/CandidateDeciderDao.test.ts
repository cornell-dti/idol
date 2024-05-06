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

test('Update instance with transaction', async () => {
  const promises: Promise<CandidateDeciderInstance>[] = [];

  // Execute concurrent update operations
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
  expect(results[4].candidates.length === 5).toBe(true);

  // Execute concurrent update operations on same ID
  const mockData = [
    { id: 1, rating: 1, comment: 'oldComment' },
    { id: 1, rating: 2, comment: 'newComment' }
  ];
  for (const data of mockData) {
    promises.push(
      candidateDeciderDao.updateInstanceWithTransaction(
        mockCDI,
        mockUser,
        data.id,
        data.rating,
        data.comment
      )
    );
  }

  const newResults = await Promise.all(promises);

  // Verify latest update persists for updates to the same ID
  newResults[6].candidates.forEach((candidate) => {
    if (candidate.id === 1) {
      expect(candidate.rating).toBe(2);
      expect(candidate.comment).toBe('newComment');
    }
  });
});

test('Delete instance', () => {
  candidateDeciderDao.deleteInstance(mockCDI.uuid);
  candidateDeciderDao.getAllInstances().then((allInstances) => {
    expect(allInstances.every((instance) => instance !== mockCDI));
  });
});
