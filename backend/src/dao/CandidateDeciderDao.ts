import { v4 as uuidv4 } from 'uuid';
import { candidateDeciderCollection, db, memberCollection } from '../firebase';
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
    candidates: instance.candidates.map((candidate) => ({
      ...candidate,
      ratings: candidate.ratings.map((rating) => ({
        ...rating,
        reviewer: memberCollection.doc(rating.reviewer.email)
      })),
      comments: candidate.comments.map((comment) => ({
        ...comment,
        reviewer: memberCollection.doc(comment.reviewer.email)
      }))
    }))
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
        ratings: await Promise.all(
          candidate.ratings.map(async (rating) => ({
            ...rating,
            reviewer: await getMemberFromDocumentReference(rating.reviewer)
          }))
        ),
        comments: await Promise.all(
          candidate.comments.map(async (comment) => ({
            ...comment,
            reviewer: await getMemberFromDocumentReference(comment.reviewer)
          }))
        )
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

  /**
   * Updates a specific CandidateDecider instance in the database with a rating
   * and comment. This implementation uses a transaction in order to prevent
   * race conditions from multiple users making multiple rating/comment updates.
   * @param instance - CandidateDeciderInstance object containing the updated data.
   * @param user - user who created the review
   * @param id - id associated with the candidate
   * @param rating - rating submitted by the user
   * @param comment - comment submitted by the user
   * @returns The updated CandidateDeciderInstance object.
   */
  async updateInstanceWithTransaction(
    instance: CandidateDeciderInstance,
    user: IdolMember,
    id: number,
    rating: Rating,
    comment: string
  ): Promise<CandidateDeciderInstance> {
    const candidateDeciderRef = this.collection.doc(instance.uuid);
    const newInstance: CandidateDeciderInstance = await db.runTransaction(async (t) => {
      const doc = await t.get(candidateDeciderRef);

      const dbCandidateDeciderInstance = doc.data() as DBCandidateDeciderInstance;
      const candidateDeciderInstance = await materializeCandidateDeciderInstance(
        dbCandidateDeciderInstance
      );
      const candidates = candidateDeciderInstance.candidates.map((cd) =>
        cd.id !== id
          ? cd
          : {
              ...cd,
              ratings: [
                ...cd.ratings.filter((rt) => rt.reviewer.email !== user.email),
                { reviewer: user, rating }
              ],
              comments: [
                ...cd.comments.filter((cmt) => cmt.reviewer.email !== user.email),
                { reviewer: user, comment }
              ]
            }
      );
      t.update(candidateDeciderRef, {
        candidates: candidates.map((candidate) => ({
          ...candidate,
          ratings: candidate.ratings.map((rating) => ({
            ...rating,
            reviewer: memberCollection.doc(rating.reviewer.email)
          })),
          comments: candidate.comments.map((comment) => ({
            ...comment,
            reviewer: memberCollection.doc(comment.reviewer.email)
          }))
        }))
      });

      return { ...candidateDeciderInstance, candidates };
    });
    return newInstance;
  }
}
