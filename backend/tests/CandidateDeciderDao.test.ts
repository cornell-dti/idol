import CandidateDeciderDao from '../src/dao/CandidateDeciderDao';
import { candidateDeciderCollection, memberCollection } from '../src/firebase';
import { fakeIdolMember, fakeCandidateDeciderInstance } from './data/createData';

const candidateDeciderDao = new CandidateDeciderDao();

const mockEmail = 'test123@cornell.edu';
const mockUser = { ...fakeIdolMember(), email: mockEmail };
const mockCDI = { ...fakeCandidateDeciderInstance(), uuid: 'testUuid' };
const newMockCDI = { ...fakeCandidateDeciderInstance(), uuid: 'testUuid', isOpen: true };
const mockComment = 'testComment';
const mockRating = 10;

beforeAll(async () => {
  await candidateDeciderDao.createNewInstance(mockCDI);
  await memberCollection.doc(mockEmail).set(mockUser);
});

afterAll(async () => {
  await candidateDeciderCollection.doc(mockCDI.uuid).delete();
  await memberCollection.doc(mockEmail).delete();
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

test('Update instance with transaction (different ID)', async () => {
  const promises: Promise<CandidateDeciderInstance>[] = [];

  // Execute concurrent update operations
  const mockIDs = [1, 2, 3];
  for (const mockID of mockIDs) {
    promises.push(
      candidateDeciderDao.updateInstanceWithTransaction(
        mockCDI,
        mockUser,
        mockID,
        mockRating + mockID,
        mockComment + mockID
      )
    );
  }

  // Verify all candidates are updated properly
  Promise.all(promises).then((results) => {
    expect(
      results[results.length - 1].candidates.every(
        (c) => c.comments[0].comment === `testComment${c.id}` && c.ratings[0].rating === 10 + c.id
      )
    ).toBe(true);
  });
});

test('Update instance with transaction (same ID)', async () => {
  const promises: Promise<CandidateDeciderInstance>[] = [];

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

  // Verify latest update persists for updates to the same ID
  Promise.all(promises).then((results) => {
    results[results.length - 1].candidates.forEach((candidate) => {
      if (candidate.id === 1) {
        expect(candidate.ratings[0].rating).toBe(2);
        expect(candidate.comments[0].comment).toBe('newComment');
      }
    });
  });
});

test('Delete instance', () => {
  candidateDeciderDao.deleteInstance(mockCDI.uuid);
  candidateDeciderDao.getAllInstances().then((allInstances) => {
    expect(allInstances.every((instance) => instance !== mockCDI));
  });
});
