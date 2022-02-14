import TeamEventsDao from '../src/dao/TeamEventsDao';
import jaggerData from './data/jagger-profile.json';
import { teamEventsCollection } from '../src/firebase';
import { TeamEvent } from '../src/DataTypes';

const testTeamEventAttendence = {
  member: jaggerData,
  hoursAttended: 1,
  image: null
}

const test_event: TeamEvent = {
  date: 'now',
  hasHours: true,
  name: 'testevent1',
  numCredits: '1',
  attendees: [],
  requests: [testTeamEventAttendence],
  uuid: 'test'
};

/* clean database */
afterAll(async () => TeamEventsDao.deleteTeamEvent(test_event));

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
// test('Update existing event', async () => {
//   const updated_event: TeamEvent = {
//     ...test_event,
//     requests: [],
//     attendees: [testTeamEventAttendence]
//   };

//   // make sure event is in db first
//   const event_ref = teamEventsCollection.doc('test').get();

//   await event_ref.then(async (event) => {
//     if (!event.exists) {
//       await TeamEventsDao.createTeamEvent(test_event);
//     }

//     return TeamEventsDao.updateTeamEvent(updated_event).then(() => {
//       TeamEventsDao.getAllTeamEvents().then((events) => {
//         const target_event = events.find((event) => event.name === 'testevent1');
//         expect(target_event).toEqual(updated_event);
//       });
//     });
//   });
// });