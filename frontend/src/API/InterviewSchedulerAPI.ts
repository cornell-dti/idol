import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

export default class InterviewSchedulerAPI {
  static async createNewInstance(instance: InterviewScheduler): Promise<string> {
    const response = APIWrapper.post(`${backendURL}/interview-scheduler`, instance);
    return response.then((val) => val.data.uuid);
  }
}
