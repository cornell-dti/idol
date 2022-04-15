import { PermissionError } from '../src/utils/errors';
import { teamEventsCollection } from '../src/firebase';
import {
  createTeamEvent,
  deleteTeamEvent,
  getAllTeamEvents,
  updateTeamEvent
} from '../src/API/teamEventsAPI';
import { fakeTeamEvent, fakeTeamEventAttendance } from './data/createData';

const adminUser = { email: 'hl738@cornell.edu' } as IdolMember;
const nonAdminUser = { email: 'pk457@cornell.edu' } as IdolMember;

const testTeamEvent = fakeTeamEvent();

afterAll(async () => deleteTeamEvent(testTeamEvent, adminUser));

test('created team event with permission', async () => {
  await createTeamEvent(testTeamEvent, adminUser).then((teamEvent) => {
    expect(teamEvent.name).toEqual('testteamevent');
  });
});

test('does not create team event because user does not have permission', async () => {
  expect(createTeamEvent(testTeamEvent, nonAdminUser)).rejects.toThrow(PermissionError);
});

const updatedTestTeamEvent = {
  ...testTeamEvent,
  requests: [],
  attendees: [fakeTeamEventAttendance()]
};

test('does not get all team events because user does not have permission', async () => {
  expect(
    getAllTeamEvents(nonAdminUser).then((events) => {
      expect(events.pop.name).toEqual('test');
    })
  ).rejects.toThrow(PermissionError);
});

test('does not update team event because user does not have permission', async () => {
  const eventRef = teamEventsCollection.doc('testteamevent').get();
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
