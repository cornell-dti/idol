import TeamEventAttendanceDao from '../src/dao/TeamEventAttendanceDao';
import { teamEventAttendanceCollection, memberCollection } from '../src/firebase';
import { fakeTeamEventAttendance, fakeIdolMember } from './data/createData';

const teamEventAttendanceDao = new TeamEventAttendanceDao();

const mockEmail = 'test@cornell.edu';
const mockMember = { ...fakeIdolMember(), email: mockEmail };
const mockTEA = { ...fakeTeamEventAttendance(), member: mockMember, uuid: 'testUuid' };

beforeAll(async () => {
  await teamEventAttendanceDao.createTeamEventAttendance(mockTEA);
  await memberCollection.doc(mockEmail).set(mockMember);
});

afterAll(async () => {
  await teamEventAttendanceCollection.doc(mockTEA.uuid).delete();
  await memberCollection.doc(mockEmail).delete();
});

test('Get all instances', () =>
  teamEventAttendanceDao.getAllTeamEventAttendance().then((allAttendances) => {
    expect(allAttendances.some((attendance) => attendance === mockTEA));
  }));

test('Get instance by member', () =>
  teamEventAttendanceDao.getTeamEventAttendanceByUser(mockMember).then((attendances) => {
    expect(attendances.some((attendance) => attendance === mockTEA));
    expect(attendances[0].status === 'pending');
  }));

test('Get instance by uuid', () =>
  teamEventAttendanceDao.getTeamEventAttendance('testUUid').then((attendance) => {
    expect(attendance === mockTEA);
  }));

test('Delete instance', () => {
  teamEventAttendanceDao.deleteTeamEventAttendance(mockTEA.uuid);
  teamEventAttendanceDao.getAllTeamEventAttendance().then((allAttendances) => {
    expect(allAttendances.every((attendance) => attendance !== mockTEA));
  });
});
