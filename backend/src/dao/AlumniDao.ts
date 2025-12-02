import { alumniCollection } from '../firebase';
import { DBAlumni } from '../types/DataTypes';
import BaseDao from './BaseDao';

export default class AlumniDao extends BaseDao<DBAlumni, DBAlumni> {
  constructor() {
    super(
      alumniCollection,
      async (dbAlumni) => dbAlumni,
      async (alumni) => alumni
    );
  }

  /**
   * Gets all alumni
   * @returns All alumni documents
   */
  async getAllAlumni(): Promise<DBAlumni[]> {
    return this.getDocuments();
  }

  /**
   * Gets an alumni from their uuid
   * @param uuid - The uuid
   * @returns The alumni document with a matching uuid
   */
  async getAlumni(uuid: string): Promise<DBAlumni | null> {
    return this.getDocument(uuid);
  }

  /**
   * Creates a new alumni document
   * @param alumni - The alumni data
   * @returns The newly created alumni document
   */
  async createAlumni(alumni: DBAlumni): Promise<DBAlumni> {
    return this.createDocument(alumni.uuid, alumni);
  }

  /**
   * Updates alumni information given their uuid
   * @param alumni - The updated alumni data
   * @returns The updated alumni document
   */
  async updateAlumni(alumni: DBAlumni): Promise<DBAlumni> {
    return this.updateDocument(alumni.uuid, alumni);
  }

  /**
   * Deletes an alumni document given their uuid
   * @param uuid - The uuid
   */
  async deleteAlumni(uuid: string): Promise<void> {
    return this.deleteDocument(uuid);
  }
}
