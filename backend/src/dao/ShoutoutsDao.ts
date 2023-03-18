import { v4 as uuidv4 } from 'uuid';
import { memberCollection, shoutoutCollection } from '../firebase';
import { DBShoutout } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

async function shoutoutToDBShoutout(shoutout: Shoutout): Promise<DBShoutout> {
  return {
    ...shoutout,
    giver: memberCollection.doc(shoutout.giver.email)
  };
}

async function dbShoutoutToShoutout(dbShoutout: DBShoutout): Promise<Shoutout> {
  return {
    ...dbShoutout,
    giver: await getMemberFromDocumentReference(dbShoutout.giver)
  };
}

export default class ShoutoutsDao extends BaseDao<Shoutout, DBShoutout> {
  constructor() {
    super(shoutoutCollection, dbShoutoutToShoutout, shoutoutToDBShoutout);
  }

  async getAllShoutouts(): Promise<Shoutout[]> {
    return this.getAllDocuments();
  }

  static async getShoutouts(email: string, type: 'given' | 'received'): Promise<Shoutout[]> {
    const givenOrReceived = type === 'given' ? 'giver' : 'receiver';
    const shoutoutRefs = await shoutoutCollection
      .where(givenOrReceived, '==', memberCollection.doc(email))
      .get();
    return Promise.all(
      shoutoutRefs.docs.map(async (shoutoutRef) => dbShoutoutToShoutout(shoutoutRef.data()))
    );
  }

  async getShoutout(uuid: string): Promise<Shoutout | null> {
    return this.getDocument(uuid);
  }

  async createShoutout(shoutout: Shoutout): Promise<Shoutout> {
    const shoutoutWithUUID = {
      ...shoutout,
      uuid: shoutout.uuid ? shoutout.uuid : uuidv4()
    };
    return this.createDocument(shoutoutWithUUID.uuid, shoutoutWithUUID);
  }

  async updateShoutout(shoutout: Shoutout): Promise<Shoutout> {
    return this.updateDocument(shoutout.uuid, shoutout);
  }

  async deleteShoutout(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }
}
