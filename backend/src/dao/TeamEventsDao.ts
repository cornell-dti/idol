import { v4 as uuidv4 } from 'uuid';
import { TeamEvent, DBTeamEvent } from "../DataTypes";
import { memberCollection, teamEventsCollection } from "../firebase";
import { NotFoundError } from '../errors';

export default class TeamEventsDao {
  static async getAllTeamEvents(): Promise<TeamEvent[]> {
    const eventRefs = await teamEventsCollection.get();
    
    return Promise.all(
      eventRefs.docs.map(async (eventRef) => {
        const { uuid, name, attendees } = eventRef.data();
        return {
          uuid,
          name,
          attendees: await Promise.all(
            attendees.map((ref) => ref.get().then((doc) => doc.data() as IdolMember))
          )
        };
      })
    );
  }

  static async deleteTeamEvent(teamEvent: TeamEvent): Promise<void> {
    const eventDoc = teamEventsCollection.doc(teamEvent.uuid);
    const eventRef = await eventDoc.get();
    if (!eventRef.exists) throw new NotFoundError(`No team event '${teamEvent.uuid}' exists.`)
    await eventDoc.delete();
  }

  static async createTeamEvent(event: TeamEvent): Promise<TeamEvent> {
    const teamEventRef: DBTeamEvent = {
      uuid: event.uuid ? event.uuid : uuidv4(),
      name: event.name,
      attendees: event.attendees.map((mem) => memberCollection.doc(mem.email))
    };

    // assert

    await teamEventsCollection.doc(teamEventRef.uuid).set(teamEventRef);
    return event;
  }

  static async updateTeamEvent(event: TeamEvent): Promise<TeamEvent> {
    const eventDoc = teamEventsCollection.doc(event.uuid);
    const eventRef = await eventDoc.get();
    if (!eventRef.exists) throw new NotFoundError(`No team event '${event.uuid}' exists.`)

    const teamEventRef: DBTeamEvent = {
      ...event,
      attendees: event.attendees.map((mem) => memberCollection.doc(mem.email))
    };

    await eventDoc.update(teamEventRef);
    return event;
  }
}