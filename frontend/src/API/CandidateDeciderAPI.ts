import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

export default class CandidateDeciderAPI {
  static async getAllInstances(): Promise<CandidateDeciderInfo[]> {
    const response = APIWrapper.get(`${backendURL}/candidate-decider`);
    return response.then((val) => val.data.instances);
  }

  static async hasCandidateDeciderInstance(user: IdolMember): Promise<boolean> {
    const response = APIWrapper.get(`${backendURL}/candidate-decider-instance/`);
    // console.log(`info: ${(await response).data.hasInstance}`)
    return response.then((val) => val.data.hasInstance);
  }

  static async getInstance(uuid: string): Promise<CandidateDeciderInstance> {
    const response = APIWrapper.get(`${backendURL}/candidate-decider/${uuid}`);
    return response.then((val) => val.data.instance);
  }

  static async getReviews(uuid: string): Promise<CandidateDeciderReview[]> {
    const response = APIWrapper.get(`${backendURL}/candidate-decider/${uuid}/review`);
    return response.then((val) => val.data.reviews);
  }

  static async createNewInstance(
    instance: CandidateDeciderInstance
  ): Promise<CandidateDeciderInfo> {
    const response = APIWrapper.post(`${backendURL}/candidate-decider`, instance);
    return response.then((val) => val.data.instance);
  }

  static async updateInstance(instance: CandidateDeciderEdit): Promise<CandidateDeciderInstance> {
    return APIWrapper.put(`${backendURL}/candidate-decider`, instance).then(
      (val) => val.data.instance
    );
  }

  static async deleteInstance(uuid: string): Promise<void> {
    APIWrapper.delete(`${backendURL}/candidate-decider/${uuid}`);
  }

  static async updateRatingAndComment(
    uuid: string,
    id: number,
    rating: number,
    comment: string
  ): Promise<void> {
    APIWrapper.put(`${backendURL}/candidate-decider/rating-and-comment`, {
      uuid,
      id,
      rating,
      comment
    });
  }
}
