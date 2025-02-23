import { v4 as uuidv4 } from 'uuid';
import { interviewSchedulerCollection } from '../firebase';
import BaseDao from './BaseDao';

export default class InterviewSchedulerDao extends BaseDao<InterviewScheduler, InterviewScheduler> {
  constructor() {
    super(
      interviewSchedulerCollection,
      async (interviewScheduler) => interviewScheduler,
      async (interviewScheduler) => interviewScheduler
    );
  }

  async getAllInstances(): Promise<InterviewScheduler[]> {
    return this.getDocuments();
  }

  async getInstance(uuid: string): Promise<InterviewScheduler | null> {
    return this.getDocument(uuid);
  }

  async createInstance(instance: InterviewScheduler): Promise<string> {
    const instanceWithUUID = {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4()
    };
    const doc = await this.createDocument(instanceWithUUID.uuid, instanceWithUUID);
    return doc.uuid;
  }

  async updateInstance(instance: InterviewScheduler): Promise<InterviewScheduler> {
    return this.updateDocument(instance.uuid, instance);
  }

  async deleteInstance(uuid: string): Promise<void> {
    this.deleteDocument(uuid);
  }
}
