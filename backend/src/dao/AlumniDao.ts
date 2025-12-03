import { alumniCollection } from '../firebase';
import { DBAlumni } from '../types/DataTypes';
import BaseDao from './BaseDao';
import { ALUM_DTI_ROLES, ALUM_JOB_CATEGORY } from '../../../common-types/constants';
import { BadRequestError } from '../utils/errors';

function validateDtiRole(r: string): AlumDtiRole {
  const dr = r as AlumDtiRole;
  if (!ALUM_DTI_ROLES.includes(dr)) {
    throw new BadRequestError(`Role ${r} is invalid.`);
  }
  return dr;
}

function validateJobCategory(j: string): AlumJobCategory {
  const jc = j as AlumJobCategory;
  if (!ALUM_JOB_CATEGORY.includes(jc)) {
    throw new BadRequestError(`Job category ${j} is invalid.`);
  }
  return jc;
}

function dbAlumniToAlumni(db: DBAlumni): Alumni {
  return {
    ...db,
    dtiRoles: db.dtiRoles ? db.dtiRoles.map(validateDtiRole) : null,
    jobCategory: validateJobCategory(db.jobCategory)
  } as Alumni;
}

function alumniToDbAlumni(alum: Alumni): DBAlumni {
  return {
    ...alum,
    dtiRoles: alum.dtiRoles ? [...alum.dtiRoles] : null,
    jobCategory: alum.jobCategory
  } as DBAlumni;
}

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
   * @returns An `Alumni` list with all current alumni
   * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`
   */
  async getAllAlumni(): Promise<Alumni[]> {
    return this.getDocuments().then((vals) => vals.map((val) => dbAlumniToAlumni(val)));
  }

  /**
   * Gets an alumni from their uuid
   * @param uuid - The uuid
   * @returns The `Alumni` with a matching uuid (null if they don't exist)
   * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`
   */
  async getAlumni(uuid: string): Promise<Alumni | null> {
    return this.getDocument(uuid).then((val) => {
      if (val == null) {
        return null;
      }
      return dbAlumniToAlumni(val);
    });
  }

  /**
   * Creates a new alumni document
   * @param alumni - The alumni data
   * @returns The newly created 'Alumni'
   * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`
   */
  async createAlumni(alumni: Alumni): Promise<Alumni> {
    const dbAlumni = alumniToDbAlumni(alumni);
    return this.createDocument(dbAlumni.uuid, dbAlumni).then((val) => dbAlumniToAlumni(val));
  }

  /**
   * Updates alumni information given their uuid
   * @param alumni - The updated alumni data
   * @returns The updated `Alumni`
   * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`
   */
  async updateAlumni(alumni: Alumni): Promise<Alumni> {
    const dbAlumni = alumniToDbAlumni(alumni);
    return this.updateDocument(dbAlumni.uuid, dbAlumni).then((val) => dbAlumniToAlumni(val));
  }

  /**
   * Deletes an alumni document given their uuid
   * @param uuid - The uuid
   */
  async deleteAlumni(uuid: string): Promise<void> {
    return this.deleteDocument(uuid);
  }
}
