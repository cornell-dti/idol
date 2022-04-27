import TeamEventsDao from '../src/dao/TeamEventsDao';
import { teamEventsCollection } from '../src/firebase';
import { TeamEvent } from '../src/types/DataTypes';
import { fakeTeamEventAttendance, fakeTeamEvent } from './data/createData';

const testTeamEventAttendence = fakeTeamEventAttendance();

const test_event: TeamEvent = {
  ...fakeTeamEvent(),
  requests: [testTeamEventAttendence]
};

/* clean database */
afterAll(async () => TeamEventsDao.deleteTeamEvent(test_event));

TeamEventsDao.createTeamEvent(test_event);

test('Add new event', async () => {
  TeamEventsDao.getAllTeamEvents().then((events) => {
    const target_event = events.find((event) => event.name === 'testevent1');
    expect(target_event).toEqual(test_event);
  });
});

/* for /createTeamEvent and /getAllTeamEvents */
test('Add new event', async () => {
  await TeamEventsDao.createTeamEvent(test_event).then(() => {
    TeamEventsDao.getAllTeamEvents().then((events) => {
      const target_event = events.find((event) => event.name === 'testevent1');
      expect(target_event).toEqual(test_event);
    });
  });
});

/* for /updateTeamEvent */
test('Update existing event', async () => {
  const updated_event: TeamEvent = {
    ...test_event,
    requests: [],
    attendees: [testTeamEventAttendence]
  };

  // make sure event is in db first
  const event_ref = teamEventsCollection.doc('test').get();

  await event_ref.then(async (event) => {
    if (!event.exists) {
      await TeamEventsDao.createTeamEvent(test_event);
    }

    return TeamEventsDao.updateTeamEvent(updated_event).then(() => {
      TeamEventsDao.getAllTeamEvents().then((events) => {
        const target_event = events.find((event) => event.name === 'testevent1');
        expect(target_event).toEqual(updated_event);
      });
    });
  });
});
