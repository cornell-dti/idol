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
const nonAdminUser = { email: 'aa2235@cornell.edu' } as IdolMember;

const testTeamEvent = {
  name: 'test',
  date: '11/26/2020',
  numCredits: '1',
  hasHours: false,
  membersPending: [jaggerData],
  membersApproved: [],
  uuid: 'test123'
};

afterAll(async () => deleteTeamEvent(testTeamEvent, adminUser));

test('created team event with permission', async () => {
  await createTeamEvent(testTeamEvent, adminUser).then((teamEvent) => {
    expect(teamEvent.name).toEqual('test');
  });
});

test('does not create team event because user does not have permission', async () => {
  try {
    await createTeamEvent(testTeamEvent, nonAdminUser);
    throw new Error();
  } catch (error) {
    expect(error).toEqual(new PermissionError('does not have permissions to create team event'));
  }
});

const updatedTestTeamEvent = {
  ...testTeamEvent,
  membersPending: [],
  membersApproved: [jaggerData]
};

test('update existing team event with permission', async () => {
  const eventRef = teamEventsCollection.doc('test123').get();
  await eventRef.then(async (event) => {
    if (!event.exists) {
      await createTeamEvent(testTeamEvent, adminUser);
    }
    return updateTeamEvent(updatedTestTeamEvent, adminUser).then(() => {
      getAllTeamEvents(adminUser).then((events) => {
        const firstTestEvent = events.find((event) => event.name === 'test');
        expect(firstTestEvent).toEqual(updatedTestTeamEvent);
      });
    });
  });
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
    throw new Error();
  } catch (error) {
    expect(error).toEqual(new PermissionError("You don't have permission to update a team event!"));
  }
});

test('does not get all team events because user does not have permission', async () => {
  try {
    await getAllTeamEvents(nonAdminUser).then((events) => {
      expect(events.pop.name).toEqual('test');
    });
    throw new Error();
  } catch (error) {
    expect(error).toEqual(new PermissionError('does not have permissions'));
  }
});
