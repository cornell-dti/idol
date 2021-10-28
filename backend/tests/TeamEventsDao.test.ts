import TeamEventsDao from '../src/dao/TeamEventsDao';
import { TeamEvent } from '../src/DataTypes';

const test_user: IdolMember = {
  email: 'aa753@cornell.edu',
  role: 'lead'
} as IdolMember;

const test_event_1: TeamEvent = {
  uuid: '788d2998-7c37-4795-8ab7-9084765afeee',
  name: 'test1',
  date: 'now',
  hasHours: true,
  numCredits: '1',
  membersPending: [test_user],
  membersApproved: []
};

const test_event_2: TeamEvent = {
  ...test_event_1,
  membersPending: [],
  membersApproved: [test_user]
};

/* Cleanup database after running tests */
afterAll(async () => TeamEventsDao.deleteTeamEvent(test_event_1));

test('Add new event', () => {
  TeamEventsDao.createTeamEvent(test_event_1).then(() => {
    TeamEventsDao.getAllTeamEvents().then((event) => {
      expect(event).toEqual(test_event_1);
    });
  });
});

test('Update event', () => {
  TeamEventsDao.updateTeamEvent(test_event_2).then(() => {
    TeamEventsDao.getAllTeamEvents().then((event) => {
      expect(event).toEqual(test_event_2);
    });
  });
});
