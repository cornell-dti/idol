import { useState, useEffect } from 'react';
import { onSnapshot, doc, collection, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

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
              ...candidate,
              ratings: await Promise.all(
                candidate.ratings.map(async (rating) => ({
                  ...rating,
                  reviewer: (await getDoc(rating.reviewer)).data() as IdolMember
                }))
              ),
              comments: await Promise.all(
                candidate.comments.map(async (comment) => ({
                  ...comment,
                  reviewer: (await getDoc(comment.reviewer)).data() as IdolMember
                }))
              )
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

const blankInstance: CandidateDeciderInstance = {
  name: '',
  headers: [],
  candidates: [],
  uuid: '',
  authorizedMembers: [],
  authorizedRoles: [],
  isOpen: true
};

export default useCandidateDeciderInstance;
