import { v4 as uuidv4 } from 'uuid';
import { TeamEvent, DBTeamEvent } from '../DataTypes';
import { memberCollection, teamEventsCollection } from '../firebase';
import { NotFoundError } from '../errors';

export default class TeamEventsDao {
  static async getAllTeamEvents(): Promise<TeamEvent[]> {
    const eventRefs = await teamEventsCollection.get();

    return Promise.all(
      eventRefs.docs.map(async (eventRef) => {
        const { name, date, numCredits, hasHours, requests, attendees, uuid } = eventRef.data();
        return {
          name,
          date,
          numCredits,
          hasHours,
          requests: await Promise.all(
            requests.map((ref) => ({
              ...ref,
              member: ref.member.get().then((doc) => doc.data()) as unknown as IdolMember
            }))
          ),
          attendees: await Promise.all(
            attendees.map((ref) => ({
              ...ref,
              member: ref.member.get().then((doc) => doc.data()) as unknown as IdolMember
            }))
          ),
          uuid
        };
      })
    );
  }

  static async deleteTeamEvent(teamEvent: TeamEvent): Promise<void> {
    const eventDoc = teamEventsCollection.doc(teamEvent.uuid);
    const eventRef = await eventDoc.get();
    if (!eventRef.exists) throw new NotFoundError(`No team event '${teamEvent.uuid}' exists.`);
    await eventDoc.delete();
  }

  static async createTeamEvent(event: TeamEvent): Promise<TeamEvent> {
    const teamEventRef: DBTeamEvent = {
      uuid: event.uuid ? event.uuid : uuidv4(),
      name: event.name,
      date: event.date,
      numCredits: event.numCredits,
      hasHours: event.hasHours,
      requests: event.requests.map((req) => ({
        ...req,
        member: memberCollection.doc(req.member.email)
      })),
      attendees: event.attendees.map((att) => ({
        ...att,
        member: memberCollection.doc(att.member.email)
      }))
    };

    await teamEventsCollection.doc(teamEventRef.uuid).set(teamEventRef);
    return event;
  }

  static async updateTeamEvent(event: TeamEvent): Promise<TeamEvent> {
    const eventDoc = teamEventsCollection.doc(event.uuid);
    const eventRef = await eventDoc.get();
    if (!eventRef.exists) throw new NotFoundError(`No team event '${event.uuid}' exists.`);

    const teamEventRef: DBTeamEvent = {
      uuid: event.uuid,
      name: event.name,
      date: event.date,
      numCredits: event.numCredits,
      hasHours: event.hasHours,
      requests: event.requests.map((req) => ({
        ...req,
        member: memberCollection.doc(req.member.email)
      })),
      attendees: event.attendees.map((att) => ({
        ...att,
        member: memberCollection.doc(att.member.email)
      }))
    };

    await teamEventsCollection.doc(event.uuid).update(teamEventRef);
    return event;
  }
}
