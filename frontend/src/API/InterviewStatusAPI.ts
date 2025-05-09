import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

export interface InterviewStatusResponseObj {
  interviewStatus: InterviewStatus;
  error?: string;
}

export class InterviewStatusAPI {
  /**
   * Fetch all interview statuses from the backend.
   */
  public static getAllInterviewStatuses(): Promise<InterviewStatus[]> {
    const res = APIWrapper.get(`${backendURL}/interview-status`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't fetch all interview statuses",
          contentMsg: `Error was: ${val.error}`
        });
        return [];
      }
      return val.instances as InterviewStatus[];
    });
  }

  /**
   * Fetch a specific interview status by its UUID.
   * @param uuid - UUID of the interview status document
   */
  public static getInterviewStatus(uuid: string): Promise<InterviewStatus> {
    const res = APIWrapper.get(`${backendURL}/interview-status/${uuid}`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't fetch interview status",
          contentMsg: `Error was: ${val.error}`
        });
      }
      return val.interviewStatus as InterviewStatus;
    });
  }

  /**
   * Update an existing interview status record.
   * @param interviewStatusData - update data for the interview status
   */
  public static updateInterviewStatus(
    interviewStatusData: InterviewStatus
  ): Promise<InterviewStatusResponseObj> {
    return APIWrapper.put(`${backendURL}/interview-status`, interviewStatusData).then(
      (res) => res.data
    );
  }

  /**
   * Create a new interview status record.
   * @param interviewStatusData - data for the new interview status
   * @return the created InterviewStatus (with uuid)
   */
  public static createInterviewStatus(
    interviewStatusData: InterviewStatus
  ): Promise<InterviewStatus> {
    return APIWrapper.post(`${backendURL}/interview-status`, interviewStatusData).then(
      (res) => res.data.newStatus
    );
  }

  /**
   * Delete an interview status record by its UUID.
   * @param uuid - UUID of the document to delete
   */
  public static async deleteInterviewStatus(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/interview-status/${uuid}`);
  }

  /**
   * Clears all interview statuses.
   */
  public static async clearAllInterviewStatuses(): Promise<void> {
    await APIWrapper.delete(`${backendURL}/interview-status`);
  }
}
