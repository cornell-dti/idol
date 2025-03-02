import { v4 as uuidv4 } from 'uuid';
import { interviewSchedulerCollection } from '../firebase';
import BaseDao from './BaseDao';

export default class InterviewSchedulerDao extends BaseDao<InterviewScheduler, InterviewScheduler> {
  /**
   * Initializes DAO with the interview scheduler collection.
   */
  constructor() {
    super(
      interviewSchedulerCollection,
      async (interviewScheduler) => interviewScheduler,
      async (interviewScheduler) => interviewScheduler
    );
  }

  /**
   * Gets all instances of Interview Scheduler
   * @returns a promise that resolves to an array of Interview Scheduler objects
   */
  async getAllInstances(): Promise<InterviewScheduler[]> {
    return this.getDocuments();
  }

  /**
   * Gets a specific instance of Interview Scheduler with uuid
   * @param uuid the uuid of a Interview Scheduler instance
   * @returns a promise resolving to a specific instance if found and null otherwise 
   */
  async getInstance(uuid: string): Promise<InterviewScheduler | null> {
    return this.getDocument(uuid);
  }

  /**
   * Creates an instance of Interview Scheduler with uuid and assigns one if not provided
   * @param instance the Interview Scheduler instance to create
   * @returns uuid of created instance
   */
  async createInstance(instance: InterviewScheduler): Promise<string> {
    const instanceWithUUID = {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4()
    };
    const doc = await this.createDocument(instanceWithUUID.uuid, instanceWithUUID);
    return doc.uuid;
  }

  /**
   * Updates an instance of Interview Scheduler
   * @param instance the instance to update
   * @returns a promise resolving to the updated instance
   */
  async updateInstance(instance: InterviewScheduler): Promise<InterviewScheduler> {
    return this.updateDocument(instance.uuid, instance);
  }
  
  /**
   * Deletes an instance of Interview Scheduler
   * @param uuid the uuid of the instance to delete
   */
  async deleteInstance(uuid: string): Promise<void> {
    this.deleteDocument(uuid);
  }
}
