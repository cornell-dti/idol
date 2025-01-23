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

  async createInstance(instance: InterviewScheduler): Promise<string> {
    const uuid = uuidv4();
    this.createDocument(uuid, instance);
    return uuid;
  }
}
