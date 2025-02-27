import InterviewScheulderDao from '../src/dao/InterviewSchedulerDao';
import { candidateDeciderCollection } from '../src/firebase';
import { fakeInterviewScheduler } from './data/createData';

const interviewSchedulerDao = new InterviewScheulderDao();

const mockIS = { ...fakeInterviewScheduler(), uuid: 'testUuid' };

beforeAll(async () => {
  await interviewSchedulerDao.createInstance(mockIS);
});

afterAll(async () => {
  await candidateDeciderCollection.doc(mockIS.uuid).delete();
});

test('Get all instances', () =>
  interviewSchedulerDao.getAllInstances().then((allInstances) => {
    expect(allInstances.some((instance) => instance === mockIS));
  }));

test('Get instance by uuid', () =>
  interviewSchedulerDao.getInstance('testUUid').then((attendance) => {
    expect(attendance === mockIS);
  }));

test('Delete instance', () => {
  interviewSchedulerDao.deleteInstance(mockIS.uuid);
  interviewSchedulerDao.getAllInstances().then((allInstances) => {
    expect(allInstances.every((instance) => instance !== mockIS));
  });
});
