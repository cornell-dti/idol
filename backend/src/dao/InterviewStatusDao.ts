import { v4 as uuidv4 } from 'uuid';
import { db, interviewStatusCollection } from '../firebase';
import { DBInterviewStatus } from '../types/DataTypes';
import BaseDao from './BaseDao';
import { deleteCollection } from '../utils/firebase-utils';

/**
 * Materializes InterviewStatus from DB format to application format
 * @param dbInterviewStatus - DB representation of InterviewStatus
 */
async function materializeInterviewStatus(
  dbInterviewStatus: DBInterviewStatus
): Promise<InterviewStatus> {
  return dbInterviewStatus;
}

/**
 * Serializes InterviewStatus from application format to DB format
 * @param interviewStatus - Application representation of InterviewStatus
 */
async function serializeInterviewStatus(
  interviewStatus: InterviewStatus
): Promise<DBInterviewStatus> {
  return interviewStatus;
}

export default class InterviewStatusDao extends BaseDao<
  InterviewStatus,
  DBInterviewStatus
> {
  constructor() {
    super(
      interviewStatusCollection,
      materializeInterviewStatus,
      serializeInterviewStatus
    );
  }

  /**
   * Creates a new Interview Status entry for a candidate.
   * @param interviewStatus - Newly created InterviewStatus object.
   * If provided, the object uuid will be used. If not, a new one will be generated.
   */
  async createInterviewStatus(
    interviewStatus: InterviewStatus
  ): Promise<InterviewStatus> {
    const interviewStatusWithUUID = {
      ...interviewStatus,
      uuid: interviewStatus.uuid ? interviewStatus.uuid : uuidv4()
    };
    return this.createDocument(interviewStatusWithUUID.uuid, interviewStatusWithUUID);
  }

  /**
   * Updates an existing Interview Status entry.
   * @param interviewStatus - Updated Interview Status object.
   */
  async updateInterviewStatus(
    interviewStatus: InterviewStatus
  ): Promise<InterviewStatus> {
    return this.updateDocument(interviewStatus.uuid, interviewStatus);
  }

  /**
   * Deletes an Interview Status entry.
   * @param uuid - DB uuid of Interview Status entry.
   */
  async deleteInterviewStatus(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }

  /**
   * Deletes all Interview Statuses
   */
  static async deleteAllInterviewStatuses(): Promise<void> {
    await deleteCollection(db, 'interview-status', 500);
  }

  /**
   * Gets an Interview Status entry by its uuid.
   * @param uuid - DB uuid of Interview Status entry.
   */
  async getInterviewStatus(uuid: string): Promise<InterviewStatus | null> {
    return this.getDocument(uuid);
  }

  /**
   * Gets all Interview Status entries for a given netid.
   * @param netid - NetID of the candidate whose interview status should be fetched.
   */
  async getInterviewStatusesByNetId(netid: string): Promise<InterviewStatus[]> {
    return this.getDocuments([
      {
        field: 'netid',
        comparisonOperator: '==',
        value: netid,
      }
    ]);
  }

  /**
   * Gets all Interview Status entries for a specific round.
   * @param round - Round name
   */
  async getInterviewStatusesByRound(round: string): Promise<InterviewStatus[]> {
    return this.getDocuments([
      {
        field: 'round',
        comparisonOperator: '==',
        value: round,
      }
    ]);
  }

  /**
   * Gets all Interview Status entries with a specific status.
   * @param status - Status ("Waitlisted", "Accepted", "Rejected", "Undecided")
   */
  async getInterviewStatusesByStatus(status: string): Promise<InterviewStatus[]> {
    return this.getDocuments([
      {
        field: 'status',
        comparisonOperator: '==',
        value: status,
      }
    ]);
  }

  /**
   * Gets all Interview Status entries with a specific role.
   * @param status - role ("Developer", "Product Manager", "Designer", "Bussiness")
   */
  async getInterviewStatusesByRole(role: string): Promise<InterviewStatus[]> {
    return this.getDocuments([
      {
        field: 'role',
        comparisonOperator: '==',
        value: role,
      }
    ]);
  }

  /**
   * Gets all Interview Status entries for all candidates.
   */
  async getAllInterviewStatuses(): Promise<InterviewStatus[]> {
    return this.getDocuments();
  }
}
