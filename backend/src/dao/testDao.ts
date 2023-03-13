import { fakeIdolMember } from '../../tests/data/createData';
import TeamEventAttendanceDao from './TeamEventAttendanceDao';

const testAttendance: TeamEventAttendance = {
  member: fakeIdolMember(),
  image: 'img-bucket',
  eventUuid: 'event-uuid',
  pending: true,
  uuid: ''
};

TeamEventAttendanceDao.createTeamEventAttendance(testAttendance).then((res) => console.log(res));
