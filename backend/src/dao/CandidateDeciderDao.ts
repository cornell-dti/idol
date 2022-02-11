import { candidateDeciderCollection, memberCollection } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { DBCandidateDeciderInstance } from '../DataTypes';
import { reduceEachLeadingCommentRange } from 'typescript';

export default class CandidateDeciderDao {
  static async getAllInstances(): Promise<CandidateDeciderInstance[]> {
    const instanceRefs = await candidateDeciderCollection.get();

    return Promise.all(
      instanceRefs.docs.map(async (instanceRefs) => {
        const dbInstance = instanceRefs.data();
        return {
          ...dbInstance,
          candidates: await Promise.all(
            dbInstance.candidates.map(async (dbCandidate) => ({
              ...dbCandidate,
              ratings: await Promise.all(
                dbCandidate.ratings.map(async (dbRating) => ({
                  ...dbRating,
                  reviewer: (await dbRating.reviewer.get()).data() as IdolMember
                }))
              ),
              comments: await Promise.all(
                dbCandidate.comments.map(async (dbComment) => ({
                  ...dbComment,
                  reviewer: (await dbComment.reviewer.get()).data() as IdolMember
                }))
              )
            }))
          )
        };
      })
    );
  }

  static async createNewInstance(
    instance: CandidateDeciderInstance
  ): Promise<CandidateDeciderInstance> {
    const candidateDeciderInstanceRef = {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4(),
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
    return instance;
  }
}
