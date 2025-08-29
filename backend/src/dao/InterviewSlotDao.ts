import { v4 as uuidv4 } from 'uuid';
import { db, interviewSlotCollection, memberCollection } from '../firebase';
import { DBInterviewSlot } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

/**
 * Serializes an InterviewSlot instance into a format suitable for Firestore storage.
 * @param {InterviewSlot} instance - The InterviewSlot instance to serialize.
 * @returns {Promise<DBInterviewSlot>} - The serialized InterviewSlot object.
 */
async function serializeInterviewSlot(instance: InterviewSlot): Promise<DBInterviewSlot> {
  return {
    ...instance,
    lead: instance.lead ? memberCollection.doc(instance.lead.email) : null,
    members: instance.members.map((member) => (member ? memberCollection.doc(member.email) : null))
  };
}

/**
 * Converts a Firestore document into an InterviewSlot instance by retrieving references.
 * @param {DBInterviewSlot} dbInstance - The Firestore document to materialize.
 * @returns {Promise<InterviewSlot>} - The materialized InterviewSlot object.
 */
async function materializeInterviewSlot(dbInstance: DBInterviewSlot): Promise<InterviewSlot> {
  return {
    ...dbInstance,
    lead: dbInstance.lead ? await getMemberFromDocumentReference(dbInstance.lead) : null,
    members: await Promise.all(
      dbInstance.members.map((member) => (member ? getMemberFromDocumentReference(member) : null))
    )
  };
}

/**
 * DAO class for managing InterviewSlot objects in Firestore.
 */
export default class InterviewSlotDao extends BaseDao<InterviewSlot, DBInterviewSlot> {
  constructor() {
    super(interviewSlotCollection, materializeInterviewSlot, serializeInterviewSlot);
  }

  /**
   * Retrieves all interview slots associated with a given scheduler UUID.
   * @param {string} uuid - The UUID of the interview scheduler.
   * @returns {Promise<InterviewSlot[]>} - A list of InterviewSlot objects.
   */
  async getSlotsForScheduler(uuid: string): Promise<InterviewSlot[]> {
    return this.getDocuments([
      { field: 'interviewSchedulerUuid', comparisonOperator: '==', value: uuid }
    ]);
  }

  /**
   * Retrieves a specific interview slot by its UUID.
   * @param {string} uuid - The UUID of the interview slot.
   * @returns {Promise<InterviewSlot | null>} - The InterviewSlot object if found, otherwise null.
   */
  async getSlot(uuid: string): Promise<InterviewSlot | null> {
    return this.getDocument(uuid);
  }

  /**
   * Adds multiple interview slots to the database.
   * @param {InterviewSlot[]} slots - The list of InterviewSlot objects to add.
   * @returns {Promise<InterviewSlot[]>} - The list of created InterviewSlot objects.
   */
  async addSlots(slots: InterviewSlot[]): Promise<InterviewSlot[]> {
    return Promise.all(
      slots.map((slot) => {
        const uuid = uuidv4();
        return this.createDocument(uuid, {
          ...slot,
          uuid
        });
      })
    );
  }

  /**
   * Updates an interview slot serially. Ensures that users may not override each other's changes.
   * Only leads may override other members' changes.
   * @param {InterviewSlot} updatedSlot - The updated InterviewSlot object.
   * @param {boolean} adminBypass - Whether to bypass applicant change restriction.
   * @param {string} email - The email of the user making the update.
   * @returns {Promise<boolean>} - True if the update was successful, false otherwise.
   */
  async updateSlot(
    updatedSlot: InterviewSlot,
    adminBypass: boolean,
    email: string
  ): Promise<boolean> {
    const wasUpdated: boolean = await db.runTransaction(async (t) => {
      const query = this.collection.where('uuid', '==', updatedSlot.uuid);
      const snapshot = await t.get(query);
      const oldSlot = await materializeInterviewSlot(snapshot.docs[0].data());

      const isOverridingApplicant =
        oldSlot.applicant !== null &&
        (updatedSlot.applicant === null
          ? oldSlot.applicant.email !== email
          : oldSlot.applicant.email !== updatedSlot.applicant.email);

      const isOverridingMembers = updatedSlot.members.some((member, i) => {
        if (oldSlot.members[i] === null) return false;
        if (member === null) return oldSlot.members[i]?.email !== email;
        return member.email !== oldSlot.members[i]?.email;
      });

      if (!adminBypass && (isOverridingApplicant || isOverridingMembers)) {
        return false;
      }

      const dbSlot = await serializeInterviewSlot({
        ...oldSlot,
        ...updatedSlot
      });
      t.update(this.collection.doc(dbSlot.uuid), dbSlot);
      return true;
    });

    return wasUpdated;
  }

  /**
   * Deletes an interview slot from the database.
   * @param {string} uuid - The UUID of the interview slot to delete.
   * @returns {Promise<void>} - Resolves when the deletion is complete.
   */
  async deleteSlot(uuid: string): Promise<void> {
    return this.deleteDocument(uuid);
  }
}
