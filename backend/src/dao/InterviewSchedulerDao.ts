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
}
