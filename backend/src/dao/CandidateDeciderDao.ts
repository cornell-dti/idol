import { v4 as uuidv4 } from 'uuid';
import { candidateDeciderCollection, memberCollection } from '../firebase';
import { DBCandidateDeciderInstance } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

async function serializeCandidateDeciderInstance(
  instance: CandidateDeciderInstance
): Promise<DBCandidateDeciderInstance> {
  return {
    ...instance,
    authorizedMembers: instance.authorizedMembers.map((member) =>
      memberCollection.doc(member.email)
    ),
    candidates: instance.candidates
  };
}

async function materializeCandidateDeciderInstance(
  dbInstance: DBCandidateDeciderInstance
): Promise<CandidateDeciderInstance> {
  return {
    ...dbInstance,
    authorizedMembers: await Promise.all(
      dbInstance.authorizedMembers.map(async (member) => getMemberFromDocumentReference(member))
    ),
    candidates: await Promise.all(
      dbInstance.candidates.map(async (candidate) => ({
        ...candidate,
        ratings: [],
        comments: []
      }))
    )
  };
}

export default class CandidateDeciderDao extends BaseDao<
  CandidateDeciderInstance,
  DBCandidateDeciderInstance
> {
  constructor() {
    super(
      candidateDeciderCollection,
      materializeCandidateDeciderInstance,
      serializeCandidateDeciderInstance
    );
  }

  /**
   * Retrieves all CandidateDecider instances from the database.
   * @returns An array of CandidateDeciderInstance objects.
   */
  async getAllInstances(): Promise<CandidateDeciderInstance[]> {
    return this.getDocuments();
  }

  /**
   * Retrieves a specific CandidateDecider instance from the database.
   * @param uuid - The unique identifier of the desired CandidateDecider instance.
   * @returns A CandidateDeciderInstance object if found, or null.
   */
  async getInstance(uuid: string): Promise<CandidateDeciderInstance | null> {
    return this.getDocument(uuid);
  }

  /**
   * Creates a new CandidateDecider instance in the database.
   * @param instance - The CandidateDeciderInstance object to be created.
   * @returns A CandidateDeciderInfo object containing name, isOpen, and uuid of the created instance.
   */
  async createNewInstance(instance: CandidateDeciderInstance): Promise<CandidateDeciderInfo> {
    const instanceWithUUID = {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4()
    };
    const doc = await this.createDocument(instanceWithUUID.uuid, instanceWithUUID);
    return {
      name: doc.name,
      isOpen: doc.isOpen,
      uuid: doc.uuid
    };
  }

  /**
   * Deletes a specific CandidateDecider instance from the database.
   * @param uuid - The unique identifier of the CandidateDecider instance to be deleted.
   */
  async deleteInstance(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }

  /**
   * Updates a specific CandidateDecider instance in the database.
   * @param instance - The CandidateDeciderInstance object containing the updated data.
   * @returns The updated CandidateDeciderInstance object.
   */
  async updateInstance(instance: CandidateDeciderInstance): Promise<CandidateDeciderInstance> {
    return this.updateDocument(instance.uuid, instance);
  }
}
