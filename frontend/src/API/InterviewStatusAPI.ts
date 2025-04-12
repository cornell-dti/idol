import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
export type InterviewStatus = {
<<<<<<< Updated upstream
  uuid?: string;
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
export interface InterviewStatus extends DBInterviewStatus = {
  uuid: string;
};

export interface DBInterviewStatus = {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
  uuid: string;
>>>>>>> Stashed changes
  name: string;
  netid: string;
  role: string;
  round: string;
  status: 'Accepted' | 'Rejected' | 'Waitlisted' | 'Undecided';
};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
=======

>>>>>>> Stashed changes
=======

>>>>>>> Stashed changes
export type InterviewStatusResponseObj = {
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
        throw new Error(val.error);
      }
      return val.interviewStatus as InterviewStatus;
    });
  }

  /**
   * Update an existing interview status record.
   * @param interviewStatusData - update data for the interview status
   */
  public static updateInterviewStatus(interviewStatusData: InterviewStatus): Promise<InterviewStatusResponseObj> {
    return APIWrapper.put(`${backendURL}/interview-status`, interviewStatusData).then((res) => res.data);
  }

  /**
   * Create a new interview status record.
   * @param interviewStatusData - data for the new interview status
   */
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  public static createInterviewStatus(interviewStatusData: InterviewStatus): Promise<InterviewStatusResponseObj> {
=======
  public static createInterviewStatus(interviewStatusData: DBInterviewStatus): Promise<InterviewStatusResponseObj> {
>>>>>>> Stashed changes
=======
  public static createInterviewStatus(interviewStatusData: DBInterviewStatus): Promise<InterviewStatusResponseObj> {
>>>>>>> Stashed changes
=======
  public static createInterviewStatus(interviewStatusData: DBInterviewStatus): Promise<InterviewStatusResponseObj> {
>>>>>>> Stashed changes
    return APIWrapper.post(`${backendURL}/interview-status`, interviewStatusData).then((res) => res.data);
  }

  /**
   * Delete an interview status record by its UUID.
   * @param uuid - UUID of the document to delete
   */
  public static async deleteInterviewStatus(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/interview-status/${uuid}`);
  }

  /**
   * Fetch all interview statuses for a specific round.
   * @param round - name of the round
   */
  public static getInterviewStatusesByRound(round: string): Promise<InterviewStatus[]> {
    const res = APIWrapper.get(`${backendURL}/interview-status?round=${round}`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Coudn't fetch interview statuses for this round",
          contentMsg: `Error was: ${val.error}`
        });
        return [];
      }
      return val.interviewStatuses as InterviewStatus[];
    });
  }

  /**
   * Fetch all interview statuses for a specific netid.
   * @param netid - netID of the applicant
   * @returns 
   */
  public static getInterviewStatusesByNetId(netid: string): Promise<InterviewStatus[]> {
    const res = APIWrapper.get(`${backendURL}/interview-status?netid=${netid}`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Coudn't fetch interview statuses for this netid",
          contentMsg: `Error was: ${val.error}`
        });
        return [];
      }
      return val.interviewStatuses as InterviewStatus[];
    });
  }

  /**
   * Fetch all interview statuses for a specific role.
   * @param role - role of the applicant
   * @returns 
   */
  public static getInterviewStatusesByRole(role: string): Promise<InterviewStatus[]> {
    const res = APIWrapper.get(`${backendURL}/interview-status?role=${role}`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Coudn't fetch interview statuses for this role",
          contentMsg: `Error was: ${val.error}`
        });
        return [];
      }
      return val.interviewStatuses as InterviewStatus[];
    });
  }

  /**
   * Clears all interview statuses.
   */
  public static async clearAllInterviewStatuses(): Promise<void> {
    await APIWrapper.delete(`${backendURL}/interview-status`);
  }
}
