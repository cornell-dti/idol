import { ReactNode } from 'react';
import InfoIcon from '../../../components/icons/InfoIcon';

export default function Note({ inner }: { inner: ReactNode }) {
  return (
    <aside className="p-4 rounded-r-lg bg-accent-yellow-transparent border-1 border-accent-yellow/30 border-l-3 border-l-accent-yellow flex items-start gap-2">
      <div className="pt-0.5">
        <InfoIcon color="var(--accent-yellow)" size={20} decoration={true} />
      </div>
      {inner}
    </aside>
  );
}
