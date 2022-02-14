import { PermissionError } from '../src/errors';
import { teamEventsCollection } from '../src/firebase';
import {
  createTeamEvent,
  deleteTeamEvent,
  getAllTeamEvents,
  updateTeamEvent
} from '../src/team-eventsAPI';
import jaggerData from './data/jagger-profile.json';

const adminUser = { email: 'hl738@cornell.edu' } as IdolMember;
const nonAdminUser = { email: 'pk457@cornell.edu' } as IdolMember;

const testTeamEventAttendence = {
  member: jaggerData,
  hoursAttended: 1,
  image: null
};

const testTeamEvent = {
  name: 'test',
  date: '11/26/2020',
  numCredits: '1',
  hasHours: false,
  requests: [testTeamEventAttendence],
  attendees: [],
  uuid: 'test123'
};

afterAll(async () => deleteTeamEvent(testTeamEvent, adminUser));

test('created team event with permission', async () => {
  await createTeamEvent(testTeamEvent, adminUser).then((teamEvent) => {
    expect(teamEvent.name).toEqual('test');
  });
});

test('does not create team event because user does not have permission', async () => {
  expect(createTeamEvent(testTeamEvent, nonAdminUser)).rejects.toThrow(PermissionError);
});

const updatedTestTeamEvent = {
  ...testTeamEvent,
  requests: [],
  attendees: [testTeamEventAttendence]
};

test('does not get all team events because user does not have permission', async () => {
  expect(
    getAllTeamEvents(nonAdminUser).then((events) => {
      expect(events.pop.name).toEqual('test');
    })
  ).rejects.toThrow(PermissionError);
});

test('does not update team event because user does not have permission', async () => {
  const eventRef = teamEventsCollection.doc('test123').get();
  try {
    await eventRef.then(async (event) => {
      if (!event.exists) {
        await createTeamEvent(testTeamEvent, nonAdminUser);
      }
      return updateTeamEvent(updatedTestTeamEvent, nonAdminUser).then((event) => {
        expect(event).toEqual(updatedTestTeamEvent);
      });
    });
  } catch (error) {
    expect(error).rejects.toThrow(PermissionError);
  }
});

// test('update existing team event with permission', async () => {
//   const eventRef = teamEventsCollection.doc('test123').get();
//   await eventRef.then(async (event) => {
//     if (!event.exists) {
//       await createTeamEvent(testTeamEvent, adminUser);
//     }
//     return updateTeamEvent(updatedTestTeamEvent, adminUser).then(() => {
//       getAllTeamEvents(adminUser).then((events) => {
//         const firstTestEvent = events.find((event) => event.name === 'test');
//         expect(firstTestEvent).toEqual(updatedTestTeamEvent);
//       });
//     });
//   });
// });
