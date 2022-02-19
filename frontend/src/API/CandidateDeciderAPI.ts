import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

export default class CandidateDeciderAPI {
  static async getAllInstances(): Promise<CandidateDeciderInfo[]> {
    const response = APIWrapper.get(`${backendURL}/getAllCandidateDeciderInstances`);
    return response.then((val) => val.data.instances);
  }

  static async createNewInstance(
    instance: CandidateDeciderInstance
  ): Promise<CandidateDeciderInfo> {
    const response = APIWrapper.post(`${backendURL}/createNewCandidateDeciderInstance`, instance);
    return response.then((val) => val.data.instance);
  }

  static async toggleInstance(uuid: string): Promise<void> {
    APIWrapper.post(`${backendURL}/toggleCandidateDeciderInstance`, { uuid });
  }

  static async deleteInstance(uuid: string): Promise<void> {
    APIWrapper.post(`${backendURL}/deleteCandidateDeciderInstance`, { uuid });
  }
}
