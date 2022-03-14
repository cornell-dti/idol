import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

export default class CandidateDeciderAPI {
  static async getAllInstances(): Promise<CandidateDeciderInfo[]> {
    const response = APIWrapper.get(`${backendURL}/getAllCandidateDeciderInstances`);
    return response.then((val) => val.data.instances);
  }

  static async getInstance(uuid: string): Promise<CandidateDeciderInstance> {
    const response = APIWrapper.get(`${backendURL}/getCandidateDeciderInstance/${uuid}`);
    return response.then((val) => val.data.instance);
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

  static async updateRating(uuid: string, id: number, rating: number): Promise<void> {
    APIWrapper.post(`${backendURL}/updateCandidateDeciderRating`, { uuid, id, rating });
  }

  static async updateComment(uuid: string, id: number, comment: string): Promise<void> {
    APIWrapper.post(`${backendURL}/updateCandidateDeciderComment`, { uuid, id, comment });
  }
}
