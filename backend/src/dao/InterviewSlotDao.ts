import { interviewSlotCollection, memberCollection } from '../firebase';
import { DBInterviewSlot } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

async function serializeInterviewSlot(instance: InterviewSlot): Promise<DBInterviewSlot> {
  return {
    ...instance,
    lead: memberCollection.doc(instance.lead.email)
  };
}

async function materializeInterviewSlot(dbInstance: DBInterviewSlot): Promise<InterviewSlot> {
  return {
    ...dbInstance,
    lead: await getMemberFromDocumentReference(dbInstance.lead)
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
}
