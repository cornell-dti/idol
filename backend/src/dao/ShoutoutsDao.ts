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

  static async updateShoutout(shoutout: Shoutout): Promise<Shoutout> {
    const shoutoutDoc = shoutoutCollection.doc(shoutout.uuid);
    const ref = await shoutoutDoc.get();
    if (!ref.exists) throw new NotFoundError(`No shoutout '${shoutout.uuid}' exists.`);
    const shoutoutRef: DBShoutout = {
      ...shoutout,
      giver: memberCollection.doc(shoutout.giver.email)
    };
    await shoutoutCollection.doc(shoutout.uuid).update(shoutoutRef);
    return shoutout;
  }
}
