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

  static async getAllInstances(): Promise<CandidateDeciderInfo[]> {
    const instanceRefs = await candidateDeciderCollection.get();

    return Promise.all(
      instanceRefs.docs.map(async (instanceRefs) => {
        const { name, uuid, isOpen } = instanceRefs.data() as DBCandidateDeciderInstance;
        return { name, uuid, isOpen };
      })
    );
  }

  async getInstance(uuid: string): Promise<CandidateDeciderInstance | null> {
    return this.getDocument(uuid);
  }

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

  async deleteInstance(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }

  async updateInstance(instance: CandidateDeciderInstance): Promise<CandidateDeciderInstance> {
    return this.updateDocument(instance.uuid, instance);
  }
}
