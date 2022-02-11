import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

export default class CandidateDeciderAPI {
  static async getAllInstances(): Promise<CandidateDeciderInstance[]> {
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
}
