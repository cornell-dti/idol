import CandidateDeciderDao from '../src/dao/CandidateDeciderDao';
import { candidateDeciderCollection } from '../src/firebase';
import { fakeCandidateDeciderInstance } from './data/createData';

const candidateDeciderDao = new CandidateDeciderDao();

const mockCDI = { ...fakeCandidateDeciderInstance(), uuid: 'testUuid' };
const newMockCDI = { ...fakeCandidateDeciderInstance(), uuid: 'testUuid', isOpen: true };

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
