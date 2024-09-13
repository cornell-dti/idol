import { v4 as uuidv4 } from 'uuid';
import { firestore } from 'firebase-admin';
import { candidateDeciderReviewCollection, db, memberCollection } from '../firebase';
import { DBCandidateDeciderReview } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

async function serializeCandidateDeciderReview(
  review: CandidateDeciderReview
): Promise<DBCandidateDeciderReview> {
  return {
    ...review,
    reviewer: memberCollection.doc(review.reviewer.email)
  };
}

async function materializeCandidateDeciderReview(
  dbReview: DBCandidateDeciderReview
): Promise<CandidateDeciderReview> {
  return {
    ...dbReview,
    reviewer: await getMemberFromDocumentReference(dbReview.reviewer)
  };
}

export default class CandidateDeciderDao extends BaseDao<
  CandidateDeciderReview,
  DBCandidateDeciderReview
> {
  constructor() {
    super(
      candidateDeciderReviewCollection,
      materializeCandidateDeciderReview,
      serializeCandidateDeciderReview
    );
  }

  /**
   * Retrieves all CandidateDecider reviews from the database.
   * @returns An array of CandidateDeciderReview objects.
   */
  async getAllReviews(): Promise<CandidateDeciderReview[]> {
    return this.getDocuments();
  }

  /**
   * Retrieves a specific CandidateDecider review from the database.
   * @param uuid - The unique identifier of the desired CandidateDecider review.
   * @returns A CandidateDeciderReview object if found, or null.
   */
  async getReview(uuid: string): Promise<CandidateDeciderReview | null> {
    return this.getDocument(uuid);
  }

  /**
   * Gets all CandidateDecider reviews by candidate decider instance uuid.
   * @param uuid - DB uuid of the candidate decider instance
   */
  async getReviewsByCandidateDeciderInstance(uuid: string): Promise<CandidateDeciderReview[]> {
    return this.getDocuments([
      {
        field: 'candidateDeciderInstanceUuid',
        comparisonOperator: '==',
        value: uuid
      }
    ]);
  }

  /**
   * Creates a new CandidateDecider review in the database.
   * @param user - User who made the review
   * @param uuid - Candidate decider uuid
   * @param id - Candidate's id within the candidate decider instance
   * @param rating - Rating for candidate
   * @param comment - Comment for candidate
   * @returns A CandidateDeciderReview object.
   */
  async createNewReview(
    instance: CandidateDeciderInstance,
    user: IdolMember,
    id: number,
    rating: Rating,
    comment: string
  ): Promise<CandidateDeciderReview> {
    const review = {
      candidateDeciderInstanceUuid: instance.uuid,
      candidateId: id,
      reviewer: user,
      rating,
      comment
    };

    const newReview: CandidateDeciderReview = await db.runTransaction(async (t) => {
      const query = (this.collection as firestore.Query<DBCandidateDeciderReview>)
        .where('candidateDeciderInstanceUuid', '==', review.candidateDeciderInstanceUuid)
        .where('candidateId', '==', review.candidateId)
        .where('reviewer', '==', memberCollection.doc(review.reviewer.email));

      const snapshot = await t.get(query);
      const candidateDeciderReviews = snapshot.docs.map(
        (doc) => doc.data() as DBCandidateDeciderReview
      );

      let reviewWithUUID;
      if (candidateDeciderReviews.length === 0) {
        reviewWithUUID = {
          ...review,
          uuid: uuidv4()
        };
        const dbReview = await serializeCandidateDeciderReview(reviewWithUUID);
        t.create(this.collection.doc(reviewWithUUID.uuid), dbReview);
      } else {
        const candidateDeciderReview = candidateDeciderReviews[0];
        reviewWithUUID = {
          ...review,
          uuid: candidateDeciderReview.uuid
        };
        const dbReview = await serializeCandidateDeciderReview(reviewWithUUID);
        t.update(this.collection.doc(reviewWithUUID.uuid), dbReview);
      }
      return reviewWithUUID;
    });
    return newReview;
  }

  /**
   * Deletes a specific CandidateDecider review from the database.
   * @param uuid - The unique identifier of the CandidateDecider review to be deleted.
   */
  async deleteReview(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }

  /**
   * Updates a specific CandidateDecider review in the database.
   * @param review - The CandidateDeciderReview object containing the updated data.
   * @returns The updated CandidateDeciderReview object.
   */
  async updateReview(review: CandidateDeciderReview): Promise<CandidateDeciderReview> {
    return this.updateDocument(review.uuid, review);
  }
}
