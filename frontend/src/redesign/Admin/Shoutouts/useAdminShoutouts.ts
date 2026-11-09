import { useEffect, useState } from 'react';
import { collection, DocumentReference, getDoc, onSnapshot } from 'firebase/firestore';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import { db } from '../../../firebase';

type StoredShoutout = Omit<Shoutout, 'giver'> & { giver: DocumentReference };

export default function useAdminShoutouts() {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const members = new Map<string, Promise<IdolMember>>();
    setLoading(true);
    setError(false);

    const fallback = async (version: number) => {
      try {
        const items = await ShoutoutsAPI.getAllShoutouts({ throwOnError: true });
        if (active && version === revision) {
          setShoutouts(items);
          setError(false);
        }
      } catch {
        if (active && version === revision) setError(true);
      } finally {
        if (active && version === revision) setLoading(false);
      }
    };

    const unsubscribe = onSnapshot(
      collection(db, 'shoutouts'),
      async (snapshot) => {
        revision += 1;
        const version = revision;
        try {
          const items = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data() as StoredShoutout;
              let giver = members.get(data.giver.path);
              if (!giver) {
                giver = getDoc(data.giver).then((member) => member.data() as IdolMember);
                members.set(data.giver.path, giver);
              }
              return { ...data, giver: await giver };
            })
          );
          if (active && version === revision) {
            setShoutouts(items);
            setError(false);
            setLoading(false);
          }
        } catch {
          members.clear();
          await fallback(version);
        }
      },
      () => {
        revision += 1;
        return fallback(revision);
      }
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [attempt]);

  return {
    shoutouts,
    loading,
    error,
    retry: () => setAttempt((current) => current + 1),
    updateVisibility: (id: string, hidden: boolean) =>
      setShoutouts((items) => items.map((item) => (item.uuid === id ? { ...item, hidden } : item)))
  };
}
