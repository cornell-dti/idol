import { alumniCollection } from '../firebase';
import BaseDao from './BaseDao';
import { BadRequestError } from '../utils/errors';

function validateDtiRole(r: AlumDtiRole[] | null | undefined): void {
  if (r != null && r !== undefined && r.length > 2) {
    throw new BadRequestError(
      `Too many roles! Please ensure there are a maximum of 2 roles associated with this alumni.`
    );
  }
}

function validateSubteams(s: string[] | null | undefined): void {
  if (s != null && s !== undefined && s.length > 2) {
    throw new BadRequestError(
      `Too many subteams! Please ensure there are a maximum of 2 subteams associated with this alumni.`
    );
  }
}

export default class AlumniDao extends BaseDao<Alumni, Alumni> {
  constructor() {
    super(
      alumniCollection,
      async (alumni) => alumni,
      async (alumni) => alumni
    );
  }

  /**
   * Gets all alumni
   * @returns An `Alumni` list with all current alumni
   * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`
   */
  async getAllAlumni(): Promise<Alumni[]> {
    return this.getDocuments();
  }

  /**
   * Gets an alumni from their uuid
   * @param uuid - The uuid
   * @returns The `Alumni` with a matching uuid (null if they don't exist)
   * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`
   */
  async getAlumni(uuid: string): Promise<Alumni | null> {
    return this.getDocument(uuid);
  }

  /**
   * Creates a new alumni document
   * @param alumni - The alumni data
   * @returns The newly created 'Alumni'
   * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`
   */
  async createAlumni(alumni: Alumni): Promise<Alumni> {
    validateDtiRole(alumni.dtiRoles);
    validateSubteams(alumni.subteams);
    return this.createDocument(alumni.uuid, alumni);
  }

  /**
   * Updates alumni information given their uuid
   * @param alumni - The updated alumni data
   * @returns The updated `Alumni`
   * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`
   */
  async updateAlumni(alumni: Alumni): Promise<Alumni> {
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
