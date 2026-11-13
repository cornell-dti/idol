import { useEffect, useState } from 'react';
import { useToast } from '../../design-system-2026/components';
import { CoverPreferences, defaultCoverPreferences, readCoverPreferences } from './covers';

export default function useCoverPreferences(storageKey: string) {
  const toast = useToast();
  const [preferences, setPreferences] = useState(defaultCoverPreferences);

  useEffect(() => setPreferences(readCoverPreferences(storageKey)), [storageKey]);

  const saveCover = (next: CoverPreferences) => {
    localStorage.setItem(storageKey, JSON.stringify(next));
    setPreferences(next);
    toast.add({ id: 'cover-saved', title: 'Cover saved.' });
  };

  return { preferences, saveCover };
}
