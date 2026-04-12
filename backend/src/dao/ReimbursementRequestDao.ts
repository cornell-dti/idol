import { reimbursementRequestCollection } from '../firebase';
import BaseDao from './BaseDao';

export default class ReimbursementRequestDao extends BaseDao<
  ReimbursementRequest,
  ReimbursementRequest
> {
  constructor() {
    super(
      reimbursementRequestCollection,
      async (request) => request,
      async (request) => request
    );
  }

  /**
   * Gets all reimbursement requests
   * @returns A `ReimbursementRequest` list with all requests
   */
  async getAllRequests(): Promise<ReimbursementRequest[]> {
    return this.getDocuments();
  }

  /**
   * Gets a reimbursement request by its requestId
   * @param requestId - The request ID
   * @returns The `ReimbursementRequest` with a matching requestId (null if it doesn't exist)
   */
  async getRequest(requestId: string): Promise<ReimbursementRequest | null> {
    return this.getDocument(requestId);
  }

  /**
   * Gets all requests submitted by a specific requester
   * @param requesterId - The requester user ID
   * @returns List of `ReimbursementRequest` submitted by the requester
   */
  async getRequestsByRequester(requesterId: string): Promise<ReimbursementRequest[]> {
    return this.getDocuments([
      { field: 'requesterId', comparisonOperator: '==', value: requesterId }
    ]);
  }

  /**
   * Gets all requests for a specific team
   * @param teamId - The team ID
   * @returns List of `ReimbursementRequest` for the team
   */
  async getRequestsByTeam(teamId: string): Promise<ReimbursementRequest[]> {
    return this.getDocuments([{ field: 'teamId', comparisonOperator: '==', value: teamId }]);
  }

  /**
   * Gets all requests with a specific status
   * @param status - The request status
   * @returns List of `ReimbursementRequest` with the specified status
   */
  async getRequestsByStatus(status: ReimbursementRequestStatus): Promise<ReimbursementRequest[]> {
    return this.getDocuments([{ field: 'status', comparisonOperator: '==', value: status }]);
  }

  /**
   * Gets all requests for a team with a specific status
   * @param teamId - The team ID
   * @param status - The request status
   * @returns List of `ReimbursementRequest` for the team with the specified status
   */
  async getRequestsByTeamAndStatus(
    teamId: string,
    status: ReimbursementRequestStatus
  ): Promise<ReimbursementRequest[]> {
    return this.getDocuments([
      { field: 'teamId', comparisonOperator: '==', value: teamId },
      { field: 'status', comparisonOperator: '==', value: status }
    ]);
  }

  /**
   * Creates a new reimbursement request
   * @param request - The request data
   * @returns The newly created `ReimbursementRequest`
   */
  async createRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
    return this.createDocument(request.requestId, request);
  }

  /**
   * Updates a reimbursement request
   * @param request - The updated request data
   * @returns The updated `ReimbursementRequest`
   */
  async updateRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
    return this.updateDocument(request.requestId, request);
  }

  /**
   * Deletes a reimbursement request
   * @param requestId - The request ID
   */
  async deleteRequest(requestId: string): Promise<void> {
    return this.deleteDocument(requestId);
  }

  /**
   * Adds a message to a reimbursement request
   * @param requestId - The request ID
   * @param message - The message to add
   * @returns The updated `ReimbursementRequest`
   */
  async addMessage(
    requestId: string,
    message: ReimbursementMessageEntry
  ): Promise<ReimbursementRequest> {
    const request = await this.getRequest(requestId);
    if (!request) {
      throw new Error(`Request with ID ${requestId} not found`);
    }
    const updatedRequest = {
      ...request,
      messages: [...request.messages, message]
    };
    return this.updateRequest(updatedRequest);
  }

  /**
   * Updates the status of a reimbursement request and logs the change
   * @param requestId - The request ID
   * @param newStatus - The new status
   * @param changedBy - The user ID who changed the status
   * @param note - Optional note about the status change
   * @returns The updated `ReimbursementRequest`
   */
  async updateStatus(
    requestId: string,
    newStatus: ReimbursementRequestStatus,
    changedBy: string,
    note: string = ''
  ): Promise<ReimbursementRequest> {
    const request = await this.getRequest(requestId);
    if (!request) {
      throw new Error(`Request with ID ${requestId} not found`);
    }

    const statusLogEntry: ReimbursementStatusLogEntry = {
      status: newStatus,
      changedBy,
      changedAt: Date.now(),
      note
    };

    const updatedRequest: ReimbursementRequest = {
      ...request,
      status: newStatus,
      statusLog: [...request.statusLog, statusLogEntry],
      resolvedAt: newStatus === 'settled' ? Date.now() : request.resolvedAt
    };

    return this.updateRequest(updatedRequest);
  }
}
