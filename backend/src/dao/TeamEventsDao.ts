// todo
import { v4 as uuidv4 } from 'uuid';
import { TeamEvent, DBTeamEvent } from "../DataTypes";
import { memberCollection, teamEventsCollection } from "../firebase";
import { NotFoundError } from '../errors';

export default class TeamEventsDao {
  static async getAllTeamEvents(): Promise<TeamEvent[]> {
    return Promise.all(
      await teamEventsCollection.get().then((teamEventsRefs) =>
        teamEventsRefs.docs.map(async (doc) => {
          const dbTeamEvent = doc.data() as DBTeamEvent;
          //constants for team event data
          return {
            ...dbTeamEvent,
            //constants 
          };
        })
      )
    );
  }

  static async deleteTeamEvent(teamEvent: TeamEvent): Promise<TeamEvent> {
    const eventDoc = teamEventsCollection.doc(teamEvent.uuid);
    const eventRef = await eventDoc.get();
    if (!eventRef.exists) throw new NotFoundError(`No team event '${teamEvent.uuid}' exists.`)
    await eventDoc.delete();
  }

  static async createTeamEvent(event: TeamEvent): Promise<void> {
    const teamEventRef: DBTeamEvent = {
      uuid: event.uuid ? event.uuid : uuidv4(),
      name: event.name,
      attendees: event.attendees.map((mem) => memberCollection.doc(mem.email))
    };

    // assert

    await teamEventsCollection.doc(teamEventRef.uuid).set(teamEventRef);
    return;
  }
}