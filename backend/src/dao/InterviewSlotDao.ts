import { v4 as uuidv4 } from 'uuid';
import { db, interviewSlotCollection, memberCollection } from '../firebase';
import { DBInterviewSlot } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

async function serializeInterviewSlot(instance: InterviewSlot): Promise<DBInterviewSlot> {
  return {
    ...instance,
    lead: instance.lead ? memberCollection.doc(instance.lead.email) : null,
    members: instance.members.map((member) => (member ? memberCollection.doc(member.email) : null))
  };
}

async function materializeInterviewSlot(dbInstance: DBInterviewSlot): Promise<InterviewSlot> {
  return {
    ...dbInstance,
    lead: dbInstance.lead ? await getMemberFromDocumentReference(dbInstance.lead) : null,
    members: await Promise.all(
      dbInstance.members.map((member) => (member ? getMemberFromDocumentReference(member) : null))
    )
  };
}

export default class InterviewSlotDao extends BaseDao<InterviewSlot, DBInterviewSlot> {
  constructor() {
    super(interviewSlotCollection, materializeInterviewSlot, serializeInterviewSlot);
  }

  async getSlotsForScheduler(uuid: string): Promise<InterviewSlot[]> {
    return this.getDocuments([
      { field: 'interviewSchedulerUuid', comparisonOperator: '==', value: uuid }
    ]);
  }

  async getSlot(uuid: string): Promise<InterviewSlot | null> {
    return this.getDocument(uuid);
  }

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

  async updateSlot(updatedSlot: InterviewSlot, adminBypass: boolean): Promise<boolean> {
    const wasUpdated: boolean = await db.runTransaction(async (t) => {
      const query = this.collection.where('uuid', '==', updatedSlot.uuid);
      const snapshot = await t.get(query);
      const oldSlot = await materializeInterviewSlot(snapshot.docs[0].data());

      if (
        !adminBypass &&
        oldSlot.applicant &&
        updatedSlot.applicant &&
        oldSlot.applicant.email !== updatedSlot.applicant.email
      ) {
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

  async deleteSlot(uuid: string): Promise<void> {
    return this.deleteDocument(uuid);
  }
}
