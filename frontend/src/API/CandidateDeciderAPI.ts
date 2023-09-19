import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

export default class CandidateDeciderAPI {
  static async getAllInstances(): Promise<CandidateDeciderInfo[]> {
    const response = APIWrapper.get(`${backendURL}/candidate-decider`);
    return response.then((val) => val.data.instances);
  }

  static async getInstance(uuid: string): Promise<CandidateDeciderInstance> {
    const response = APIWrapper.get(`${backendURL}/candidate-decider/${uuid}`);
    return response.then((val) => val.data.instance);
  }

  static async createNewInstance(
    instance: CandidateDeciderInstance
  ): Promise<CandidateDeciderInfo> {
    const response = APIWrapper.post(`${backendURL}/candidate-decider`, instance);
    return response.then((val) => val.data.instance);
  }

  static async updateInstance(instance: CandidateDeciderEdit): Promise<void> {
    APIWrapper.put(`${backendURL}/candidate-decider`, instance);
  }

  static async deleteInstance(uuid: string): Promise<void> {
    APIWrapper.delete(`${backendURL}/candidate-decider/${uuid}`);
  }

  static async updateRating(uuid: string, id: number, rating: number): Promise<void> {
    APIWrapper.post(`${backendURL}/candidate-decider/${uuid}/rating`, { uuid, id, rating });
  }

  static async updateComment(uuid: string, id: number, comment: string): Promise<void> {
    APIWrapper.post(`${backendURL}/candidate-decider/${uuid}/comment`, { uuid, id, comment });
  }
}
