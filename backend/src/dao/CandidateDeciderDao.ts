import { v4 as uuidv4 } from 'uuid';
import { candidateDeciderCollection, memberCollection } from '../firebase';
import { DBCandidateDeciderInstance } from '../DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

export default class CandidateDeciderDao {
  static async getAllInstances(): Promise<CandidateDeciderInfo[]> {
    const instanceRefs = await candidateDeciderCollection.get();

    return Promise.all(
      instanceRefs.docs.map(async (instanceRefs) => {
        const { name, uuid, isOpen } = instanceRefs.data() as DBCandidateDeciderInstance;
        return { name, uuid, isOpen };
      })
    );
  }

  static async getInstance(uuid: string): Promise<CandidateDeciderInstance | undefined> {
    const doc = await candidateDeciderCollection.doc(uuid).get();
    if (!doc.exists) return undefined;
    const dbInstance = doc.data() as DBCandidateDeciderInstance;
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

  static async toggleInstance(uuid: string): Promise<void> {
    const doc = await candidateDeciderCollection.doc(uuid).get();
    if (!doc.exists) return;
    const data = doc.data() as DBCandidateDeciderInstance;
    await candidateDeciderCollection.doc(uuid).update({ isOpen: !data.isOpen });
  }

  static async createNewInstance(
    instance: CandidateDeciderInstance
  ): Promise<CandidateDeciderInfo> {
    const candidateDeciderInstanceRef = {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4(),
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
    await candidateDeciderCollection
      .doc(candidateDeciderInstanceRef.uuid)
      .set(candidateDeciderInstanceRef);
    return {
      name: instance.name,
      isOpen: instance.isOpen,
      uuid: candidateDeciderInstanceRef.uuid
    };
  }

  static async deleteInstance(uuid: string): Promise<void> {
    await candidateDeciderCollection.doc(uuid).delete();
  }

  static async updateInstance(updatedInstance: CandidateDeciderInstance): Promise<void> {
    const dbInstance = {
      ...updatedInstance,
      uuid: updatedInstance.uuid ? updatedInstance.uuid : uuidv4(),
      authorizedMembers: updatedInstance.authorizedMembers.map((member) =>
        memberCollection.doc(member.email)
      ),
      candidates: updatedInstance.candidates.map((candidate) => ({
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
    await candidateDeciderCollection.doc(dbInstance.uuid).update(dbInstance);
  }
}
