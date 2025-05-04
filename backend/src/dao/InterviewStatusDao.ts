import { v4 as uuidv4 } from 'uuid';
import { db, interviewStatusCollection } from '../firebase';
import BaseDao from './BaseDao';
import { deleteCollection } from '../utils/firebase-utils';

/**
 * Materializes InterviewStatus from DB format to application format.
 * @param dbInterviewStatus - DB representation of InterviewStatus
 */
async function materializeInterviewStatus(
  dbInterviewStatus: InterviewStatus
): Promise<InterviewStatus> {
  return dbInterviewStatus;
}

/**
 * Serializes InterviewStatus from application format to DB format.
 * @param interviewStatus - application representation of InterviewStatus
 */
async function serializeInterviewStatus(
  interviewStatus: InterviewStatus
): Promise<InterviewStatus> {
  return interviewStatus;
}

export default class InterviewStatusDao extends BaseDao<InterviewStatus, InterviewStatus> {
  constructor() {
    super(interviewStatusCollection, materializeInterviewStatus, serializeInterviewStatus);
  }

  /**
   * Creates a new Interview Status entry for a candidate.
   * @param interviewStatus - newly created InterviewStatus object
   * If provided, the uuid will be used and if not a new one will be generated.
   */
  async createInterviewStatus(interviewStatus: InterviewStatus): Promise<InterviewStatus> {
    const interviewStatusWithUUID = {
      ...interviewStatus,
      uuid: interviewStatus.uuid ? interviewStatus.uuid : uuidv4()
    };
    return this.createDocument(interviewStatusWithUUID.uuid, interviewStatusWithUUID);
  }

  /**
   * Updates an existing Interview Status entry.
   * @param interviewStatus - updated Interview Status object
   */
  async updateInterviewStatus(interviewStatus: InterviewStatus): Promise<InterviewStatus> {
    return this.updateDocument(interviewStatus.uuid!, interviewStatus);
  }

  /**
   * Deletes an Interview Status entry.
   * @param uuid - uuid of Interview Status entry
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
   * @param uuid - uuid of Interview Status entry
   */
  async getInterviewStatus(uuid: string): Promise<InterviewStatus | null> {
    return this.getDocument(uuid);
  }

  /**
   * Gets all Interview Status entries for all candidates.
   */
  async getAllInterviewStatuses(): Promise<InterviewStatus[]> {
    return this.getDocuments();
  }
}
