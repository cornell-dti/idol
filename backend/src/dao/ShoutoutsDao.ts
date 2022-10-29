import { memberCollection, shoutoutCollection } from '../firebase';
import { Shoutout, DBShoutout } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

export default class ShoutoutsDao {
  static async getAllShoutouts(): Promise<Shoutout[]> {
    return Promise.all(
      await shoutoutCollection.get().then((shoutoutRefs) =>
        shoutoutRefs.docs.map(async (doc) => {
          const dbShoutout = doc.data() as DBShoutout;
          const giver = await getMemberFromDocumentReference(dbShoutout.giver);
          return {
            ...dbShoutout,
            giver
          };
        })
      )
    );
  }

  static async getShoutouts(email: string, type: 'given' | 'received'): Promise<Shoutout[]> {
    const givenOrReceived = type === 'given' ? 'giver' : 'receiver';
    const shoutoutRefs = await shoutoutCollection
      .where(givenOrReceived, '==', memberCollection.doc(email))
      .get();
    return Promise.all(
      shoutoutRefs.docs.map(async (shoutoutRef) => {
        const { giver, receiver, message, isAnon } = shoutoutRef.data();
        return {
          giver: await getMemberFromDocumentReference(giver),
          receiver,
          message,
          isAnon
        };
      })
    );
  }

  static async setShoutout(shoutout: {
    giver: IdolMember;
    receiver: string;
    message: string;
    isAnon: boolean;
  }): Promise<Shoutout> {
    const shoutoutRef: DBShoutout = {
      ...shoutout,
      giver: memberCollection.doc(shoutout.giver.email)
    };
    await shoutoutCollection.doc().set(shoutoutRef);
    return shoutout;
  }
}
