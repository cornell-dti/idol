import { v4 as uuidv4 } from 'uuid';
import { teamEventsCollection, bucket } from '../firebase';
import { NotFoundError } from '../utils/errors';

export default class TeamEventsDao {
  static async getAllTeamEvents(): Promise<TeamEventInfo[]> {
    const eventRefs = await teamEventsCollection.get();
    return Promise.all(eventRefs.docs.map(async (eventRef) => eventRef.data()));
  }

  static async getTeamEvent(uuid: string): Promise<TeamEventInfo> {
    const eventDoc = teamEventsCollection.doc(uuid);
    const eventRef = await eventDoc.get();
    if (!eventRef.exists) throw new NotFoundError(`No form with uuid '${uuid}' found.`);
    const eventForm = eventRef.data();
    if (eventForm == null)
      throw new NotFoundError(`No form content in form with uuid '${uuid}' found.`);
    return eventForm;
  }

  static async deleteTeamEvent(teamEvent: TeamEventInfo): Promise<void> {
    const eventDoc = teamEventsCollection.doc(teamEvent.uuid);
    const eventRef = await eventDoc.get();
    if (!eventRef.exists) throw new NotFoundError(`No team event '${teamEvent.uuid}' exists.`);
    await eventDoc.delete();
  }

  static async createTeamEvent(event: TeamEventInfo): Promise<TeamEventInfo> {
    const teamEventRef: TeamEventInfo = {
      ...event,
      uuid: event.uuid ? event.uuid : uuidv4()
    };

    await teamEventsCollection.doc(teamEventRef.uuid).set(teamEventRef);
    return event;
  }

  static async updateTeamEvent(event: TeamEventInfo): Promise<TeamEventInfo> {
    const eventDoc = teamEventsCollection.doc(event.uuid);
    const eventRef = await eventDoc.get();
    if (!eventRef.exists) throw new NotFoundError(`No team event '${event.uuid}' exists.`);

    await teamEventsCollection.doc(event.uuid).update(event);
    return event;
  }

  /* Deletes all team event documents and proof images */
  static async deleteAllTeamEvents(): Promise<void> {
    const batch = teamEventsCollection.firestore.batch();
    const coll = await teamEventsCollection.get();

    coll.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    const proofImageFiles = await bucket.getFiles({ prefix: 'eventProofs/' });
    await Promise.all(proofImageFiles[0].map((file) => file.delete()));
  }

  static async getAllTeamEventInfo(): Promise<TeamEventInfo[]> {
    const docRefs = await teamEventsCollection
      .select('name', 'date', 'numCredits', 'hasHours', 'uuid')
      .get();
    return Promise.all(docRefs.docs.map(async (doc) => doc.data() as TeamEventInfo));
  }
}
