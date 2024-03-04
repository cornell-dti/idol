import { v4 as uuidv4 } from 'uuid';
import { memberCollection, shoutoutCollection } from '../firebase';
import { DBShoutout } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

/**
 * Returns a DBShoutout promise that consists of the shoutout and reference
 * to the person who gave the shoutout (based on their email).
 * @param shoutout - Shoutout object
 */
async function serializeShoutout(shoutout: Shoutout): Promise<DBShoutout> {
  return {
    ...shoutout,
    giver: memberCollection.doc(shoutout.giver.email)
  };
}

/**
 * Returns a Shoutout promise that consists of the dbShoutout and reference
 * to the person who gave the shoutout
 * @param dbShoutout - DBShoutout object
 */
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

  /**
   * Gets all of the shoutouts
   */
  async getAllShoutouts(): Promise<Shoutout[]> {
    return this.getDocuments();
  }

  /**
   * Gets a list of shoutouts
   * @param email -  email address
   * @param type - the type of the shoutout
   */
  async getShoutouts(email: string, type: 'given' | 'received'): Promise<Shoutout[]> {
    const givenOrReceived = type === 'given' ? 'giver' : 'receiver';
    return this.getDocuments([
      {
        field: givenOrReceived,
        comparisonOperator: '==',
        value: memberCollection.doc(email)
      }
    ]);
  }

  /**
   * Gets the shoutout object
   * @param uuid - uuid of the shoutout
   */
  async getShoutout(uuid: string): Promise<Shoutout | null> {
    return this.getDocument(uuid);
  }

  /**
   * Creates a shoutout
   * @param shoutout - newly created Shoutout object
   */
  async createShoutout(shoutout: Shoutout): Promise<Shoutout> {
    const shoutoutWithUUID = {
      ...shoutout,
      uuid: shoutout.uuid ? shoutout.uuid : uuidv4()
    };
    return this.createDocument(shoutoutWithUUID.uuid, shoutoutWithUUID);
  }

  /**
   * Edits a shoutout
   * @param uuid - uuid of the shoutout 
   * @param shoutout - shoutout object
   */
  async editShoutout(uuid: string, newMessage: string): Promise<Shoutout> {
    const shoutout = await this.getShoutout(uuid);
    if (!shoutout) {
      throw new Error('Shoutout not found...');
    }

    await this.collection.doc(uuid).update({ message: newMessage });

    const updatedDoc = await this.getDocument(uuid);
    if (!updatedDoc) {
      throw new Error('Failed to fetch updated shoutout...');
    }
    return updatedDoc;
  }


  /**
   * Updates a shoutout
   * @param shoutout - shoutout object
   */
  async updateShoutout(shoutout: Shoutout): Promise<Shoutout> {
    return this.updateDocument(shoutout.uuid, shoutout);
  }

  /**
   * Deletes a shoutout
   * @param uuid - uuid of the shoutout
   */
  async deleteShoutout(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }
}
