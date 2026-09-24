import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import { Emitters } from '../utils';

export default class ReimbursementAPI {
  public static getMyRequests(): Promise<ReimbursementRequest[]> {
    return APIWrapper.get(`${backendURL}/reimbursement-request/me`)
      .then((res) => res.data)
      .then((val) => {
        if (val.error) {
          Emitters.generalError.emit({
            headerMsg: "Couldn't get your reimbursement requests",
            contentMsg: `Error was: ${val.error}`
          });
          return [];
        }
        return val.requests as ReimbursementRequest[];
      });
  }

  public static getAllTeams(): Promise<ReimbursementTeam[]> {
    return APIWrapper.get(`${backendURL}/reimbursement-team`)
      .then((res) => res.data)
      .then((val) => {
        if (val.error) {
          Emitters.generalError.emit({
            headerMsg: "Couldn't get reimbursement teams",
            contentMsg: `Error was: ${val.error}`
          });
          return [];
        }
        return val.teams as ReimbursementTeam[];
      });
  }

  public static createRequest(
    request: Partial<ReimbursementRequest>
  ): Promise<ReimbursementRequest> {
    return APIWrapper.post(`${backendURL}/reimbursement-request`, request).then((res) => {
      if (res.data?.error) throw new Error(res.data.error);
      return res.data.request as ReimbursementRequest;
    });
  }

  public static updateRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
    return APIWrapper.put(`${backendURL}/reimbursement-request`, request).then((res) => {
      if (res.data?.error) throw new Error(res.data.error);
      return res.data.request as ReimbursementRequest;
    });
  }

  public static async deleteRequest(requestId: string): Promise<void> {
    const res = await APIWrapper.delete(`${backendURL}/reimbursement-request/${requestId}`);
    if (res.data?.error) throw new Error(res.data.error);
  }

  public static addMessage(requestId: string, content: string): Promise<ReimbursementRequest> {
    return APIWrapper.post(`${backendURL}/reimbursement-request/${requestId}/message`, {
      content
    }).then((res) => {
      if (res.data?.error) throw new Error(res.data.error);
      return res.data.request as ReimbursementRequest;
    });
  }
}
