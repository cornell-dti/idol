import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

export default class CandidateDeciderAPI {
  static async getAllInstances(): Promise<CandidateDeciderInfo[]> {
    const response = APIWrapper.get(`${backendURL}/getAllCandidateDeciderInstances`);
    return response.then((val) => {
      return val.data.instances;
    });
  }

  static async createNewInstance(instance: CandidateDeciderInstance) {
    return APIWrapper.post(`${backendURL}/createNewCandidateDeciderInstance`, instance).then(
      (res) => res.data.instances
    );
  }

  static async toggleInstance(uuid: string): Promise<void> {
    APIWrapper.post(`${backendURL}/toggleCandidateDeciderInstance`, { uuid });
  }

  static async deleteInstance(uuid: string): Promise<void> {
    APIWrapper.post(`${backendURL}/deleteCandidateDeciderInstance`, { uuid });
  }
}
