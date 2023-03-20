import { v4 as uuidv4 } from 'uuid';
import { memberCollection, shoutoutCollection } from '../firebase';
import { DBShoutout } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

async function serializeShoutout(shoutout: Shoutout): Promise<DBShoutout> {
  return {
    ...shoutout,
    giver: memberCollection.doc(shoutout.giver.email)
  };
}

async function materializeShoutout(dbShoutout: DBShoutout): Promise<Shoutout> {
  return {
    ...dbShoutout,
    giver: await getMemberFromDocumentReference(dbShoutout.giver)
  };
}

export default class ShoutoutsDao extends BaseDao<Shoutout, DBShoutout> {
  constructor() {
    super(shoutoutCollection, materializeShoutout, serializeShoutout);
  }

  async getAllShoutouts(): Promise<Shoutout[]> {
    return this.getAllDocuments();
  }

  async getShoutouts(email: string, type: 'given' | 'received'): Promise<Shoutout[]> {
    const givenOrReceived = type === 'given' ? 'giver' : 'receiver';
    const shoutoutRefs = await this.collection
      .where(givenOrReceived, '==', memberCollection.doc(email))
      .get();
    return Promise.all(
      shoutoutRefs.docs.map(async (shoutoutRef) => materializeShoutout(shoutoutRef.data()))
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
