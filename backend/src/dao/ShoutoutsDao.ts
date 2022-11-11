import { v4 as uuidv4 } from 'uuid';
import { memberCollection, shoutoutCollection } from '../firebase';
import { Shoutout, DBShoutout } from '../types/DataTypes';
import { NotFoundError } from '../utils/errors';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

export default class ShoutoutsDao {
  static async getAllShoutouts(): Promise<Shoutout[]> {
    const shoutoutRefs = await shoutoutCollection.get();
    return Promise.all(
      shoutoutRefs.docs.map(async (doc) => {
        const dbShoutout = doc.data() as DBShoutout;
        const giver = await getMemberFromDocumentReference(dbShoutout.giver);
        return {
          ...dbShoutout,
          giver
        };
      })
    );
  }

  static async getShoutouts(email: string, type: 'given' | 'received'): Promise<Shoutout[]> {
    const givenOrReceived = type === 'given' ? 'giver' : 'receiver';
    const shoutoutRefs = await shoutoutCollection
      .where(givenOrReceived, '==', memberCollection.doc(email))
      .get();
    return Promise.all(
      shoutoutRefs.docs.map(async (shoutoutRef) => {
        const { giver, receiver, message, isAnon, timestamp, hidden, uuid } = shoutoutRef.data();
        return {
          giver: await getMemberFromDocumentReference(giver),
          receiver,
          message,
          isAnon,
          timestamp,
          hidden,
          uuid
        };
      })
    );
  }

  static async setShoutout(shoutout: {
    giver: IdolMember;
    receiver: string;
    message: string;
    isAnon: boolean;
    timestamp: number;
    hidden: boolean;
    uuid: string;
  }): Promise<Shoutout> {
    const shoutoutRef: DBShoutout = {
      ...shoutout,
      giver: memberCollection.doc(shoutout.giver.email),
      uuid: shoutout.uuid ? shoutout.uuid : uuidv4()
    };
    await shoutoutCollection.doc(shoutoutRef.uuid).set(shoutoutRef);
    return shoutout;
  }

  static async getInstance(uuid: string): Promise<Shoutout> {
    const doc = shoutoutCollection.doc(uuid);
    const shoutout = await doc.get();
    if (!shoutout.exists) throw new NotFoundError(`No shoutout '${uuid}' exists.`);

    const data = shoutout.data() as DBShoutout;

    const shoutoutRef: Shoutout = {
      ...data,
      giver: await getMemberFromDocumentReference(data.giver)
    };

    return shoutoutRef;
  }

  static async hideShoutout(shoutout: Shoutout): Promise<Shoutout> {
    const shoutoutRef: DBShoutout = {
      ...shoutout,
      giver: memberCollection.doc(shoutout.giver.email)
    };
    await shoutoutCollection.doc(shoutout.uuid).set(shoutoutRef);
    return shoutout;
  }
}
