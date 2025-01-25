import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

export default class InterviewSchedulerAPI {
  static async createNewInstance(instance: InterviewScheduler): Promise<string> {
    const response = APIWrapper.post(`${backendURL}/interview-scheduler`, instance);
    return response.then((val) => val.data.uuid);
  }

  static async getAllInstances(isApplicant: boolean): Promise<InterviewScheduler[]> {
    const response = APIWrapper.get(
      `${backendURL}/interview-scheduler${isApplicant ? '/applicant' : ''}`
    );
    return response.then((val) => val.data.instances);
  }

  static async getInstance(uuid: string, isApplicant: boolean): Promise<InterviewScheduler> {
    const response = APIWrapper.get(
      `${backendURL}/interview-scheduler${isApplicant ? '/applicant' : ''}/${uuid}`
    );
    return response.then((val) => val.data.instance);
  }

  static async updateInstance(instance: InterviewSchedulerEdit): Promise<InterviewScheduler> {
    const response = APIWrapper.put(`${backendURL}/interview-scheduler/${instance.uuid}`, instance);
    return response.then((val) => val.data.instance);
  }

  static async deleteInstance(uuid: string): Promise<void> {
    APIWrapper.delete(`${backendURL}/interview-scheduler/${uuid}`);
  }

  static async getSlots(uuid: string, isApplicant: boolean): Promise<InterviewSlot[]> {
    return APIWrapper.get(
      `${backendURL}/interview-scheduler${isApplicant ? '/applicant' : ''}/${uuid}/slots`
    ).then((val) => val.data.slots);
  }
}
