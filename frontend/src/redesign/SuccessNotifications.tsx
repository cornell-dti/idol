import { useEffect } from 'react';
import { useToast } from '../design-system-2026/components';
import { EventEmitter } from '../utils';

type Success = { headerMsg: string; contentMsg: string; child?: JSX.Element };

/** Bridge existing form/admin success events into the redesign's shared toast viewport. */
export default function SuccessNotifications({
  onEmitter
}: {
  onEmitter: EventEmitter<Success>;
}): null {
  const { add } = useToast();
  useEffect(() => {
    const notify = ({ headerMsg, contentMsg, child }: Success) => {
      add({
        title: contentMsg || headerMsg,
        description: child,
        // Keep follow-up links available until dismissed.
        ...(child ? { timeout: 0 } : {})
      });
    };
    onEmitter.subscribe(notify);
    return () => onEmitter.unsubscribe(notify);
  }, [onEmitter, add]);
  return null;
}
