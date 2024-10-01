import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  onSnapshot,
  doc,
  query,
  collection,
  getDoc,
  DocumentReference,
  where
} from 'firebase/firestore';
import { db } from '../../firebase';

export type DBCandidateDeciderRating = {
  readonly reviewer: DocumentReference;
  readonly rating: Rating;
};

export type DBCandidateDeciderComment = {
  readonly reviewer: DocumentReference;
  readonly comment: string;
};

export type DBCandidateDeciderCandidate = {
  readonly responses: string[];
  readonly id: number;
};

export type DBCandidateDeciderInstance = {
  readonly name: string;
  readonly headers: string[];
  readonly candidates: DBCandidateDeciderCandidate[];
  readonly uuid: string;
  readonly authorizedMembers: DocumentReference[];
  readonly authorizedRoles: Role[];
  isOpen: boolean;
};

export type DBCandidateDeciderReview = {
  readonly candidateDeciderInstanceUuid: string;
  readonly candidateId: number;
  readonly reviewer: DocumentReference;
  readonly rating: Rating;
  readonly comment: string;
  readonly uuid: string;
};
const useCandidateDeciderInstance = (uuid: string): CandidateDeciderInstance => {
  const [instance, setInstance] = useState<CandidateDeciderInstance>(blankInstance);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(collection(db, 'candidate-decider'), uuid),
      async (snapshot) => {
        const dbInstance = snapshot.data() as DBCandidateDeciderInstance;
        const instance: CandidateDeciderInstance = {
          ...dbInstance,
          authorizedMembers: await Promise.all(
            dbInstance.authorizedMembers.map(
              async (memRef) => (await getDoc(memRef)).data() as IdolMember
            )
          ),
          candidates: await Promise.all(
            dbInstance.candidates.map(async (candidate) => ({
              ...candidate
            }))
          )
        };
        setInstance(instance);
      }
    );
    return unsubscribe;
  }, [uuid]);

  return instance;
};

const useCandidateDeciderReviews = (
  uuid: string
): [CandidateDeciderReview[], Dispatch<SetStateAction<CandidateDeciderReview[]>>] => {
  const [reviews, setReviews] = useState<CandidateDeciderReview[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'candidate-decider-review'),
        where('candidateDeciderInstanceUuid', '==', uuid)
      ),
      async (snapshot) => {
        const dbReviews: DBCandidateDeciderReview[] = [];
        snapshot.forEach((doc) => {
          const dbCandidateDeciderReview = doc.data() as DBCandidateDeciderReview;
          dbReviews.push({
            ...dbCandidateDeciderReview
          });
        });

        const reviews = await Promise.all(
          dbReviews.map(async (dbReview) => ({
            ...dbReview,
            reviewer: (await getDoc(dbReview.reviewer)).data() as IdolMember
          }))
        );
        setReviews(reviews);
      }
    );

    return unsubscribe;
  }, [uuid]);
  return [reviews, setReviews];
};

const blankInstance: CandidateDeciderInstance = {
  name: '',
  headers: [],
  candidates: [],
  uuid: '',
  authorizedMembers: [],
  authorizedRoles: [],
  isOpen: true
};

export { useCandidateDeciderInstance, useCandidateDeciderReviews };
