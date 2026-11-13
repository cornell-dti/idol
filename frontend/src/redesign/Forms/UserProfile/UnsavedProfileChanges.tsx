import { useEffect, useRef, useState } from 'react';
import Router, { NextRouter } from 'next/router';
import { SignOutIcon } from '@phosphor-icons/react/dist/csr/SignOut';
import { Button, Modal } from '../../../design-system-2026/components';
import { Emitters } from '../../../utils';
import styles from './UserProfile.module.css';

type Navigate = NextRouter['push'];
type PendingNavigation = {
  leave: () => Promise<boolean>;
  stay?: () => void;
};

function currentHistoryIndex(): number | undefined {
  const { navigation } = window as Window & { navigation?: { currentEntry?: { index: number } } };
  const index = navigation?.currentEntry?.index;
  return index !== undefined && index >= 0 ? index : undefined;
}

export default function UnsavedProfileChanges({ dirty }: { dirty: boolean }): JSX.Element {
  const [pending, setPending] = useState<PendingNavigation | null>(null);
  const confirmed = useRef(false);

  useEffect(() => {
    const { router } = Router;
    if (!dirty || !router) return undefined;

    const { push, replace } = router;
    const profilePath = window.location.pathname.replace(/\/$/, '');
    const snapshot = () => ({
      url: window.location.href,
      state: window.history.state,
      index: currentHistoryIndex()
    });
    let profileEntry = snapshot();
    const leavesProfile = (url: string) => {
      const destination = new URL(url, profileEntry.url);
      return (
        destination.origin !== window.location.origin ||
        destination.pathname.replace(/\/$/, '') !== profilePath
      );
    };

    // Next links and useRouter calls both delegate to this Pages Router instance.
    const guard =
      (navigate: Navigate): Navigate =>
      (...args) => {
        const destination = args[1] ?? args[0];
        const url = typeof destination === 'string' ? destination : destination.pathname ?? '';
        if (confirmed.current || !leavesProfile(url)) return navigate.apply(router, args);
        setPending((current) => current ?? { leave: () => navigate.apply(router, args) });
        return Promise.resolve(false);
      };

    router.push = guard(push);
    router.replace = guard(replace);
    router.beforePopState(({ url, as, options }) => {
      if (confirmed.current) return true;
      if (!leavesProfile(as)) {
        setPending((current) => (current?.stay ? null : current));
        return true;
      }

      // The browser has selected a history entry already. Keep the form mounted until confirmed.
      const destinationIndex = currentHistoryIndex();
      const { index, state, url: profileUrl } = profileEntry;
      setPending({
        leave: () => replace.call(router, url, as, options),
        stay: () => {
          if (index !== undefined && destinationIndex !== undefined && index !== destinationIndex) {
            window.history.go(index - destinationIndex);
          } else {
            window.history.pushState(state, '', profileUrl);
          }
        }
      });
      return false;
    });

    const rememberProfileEntry = () => {
      if (!leavesProfile(window.location.href)) profileEntry = snapshot();
    };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (confirmed.current) return;
      event.preventDefault();
      // Older browsers also need returnValue set to show their native prompt.
      // eslint-disable-next-line no-param-reassign
      event.returnValue = true;
    };
    router.events.on('routeChangeComplete', rememberProfileEntry);
    router.events.on('hashChangeComplete', rememberProfileEntry);
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      router.push = push;
      router.replace = replace;
      router.beforePopState(() => true);
      router.events.off('routeChangeComplete', rememberProfileEntry);
      router.events.off('hashChangeComplete', rememberProfileEntry);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [dirty]);

  const stayOnPage = () => {
    pending?.stay?.();
    setPending(null);
  };

  const leavePage = async () => {
    if (!pending || confirmed.current) return;
    confirmed.current = true;
    setPending(null);
    try {
      const navigated = await pending.leave();
      if (!navigated) pending.stay?.();
    } catch {
      pending.stay?.();
      Emitters.generalError.emit({
        headerMsg: 'Could not open the page',
        contentMsg: 'Please try again.'
      });
    } finally {
      confirmed.current = false;
    }
  };

  return (
    <Modal
      id="profile-unsaved-changes"
      open={pending !== null}
      onOpenChange={(open) => {
        if (!open) stayOnPage();
      }}
      title="Unsaved changes"
      description="Your profile has unsaved changes. If you leave this page, your changes will be lost."
      surfaceClassName={styles.unsavedDialog}
      footer={
        <>
          <Button variant="secondary" onClick={stayOnPage}>
            Stay on page
          </Button>
          <Button variant="danger" icon={<SignOutIcon size={16} />} onClick={leavePage}>
            Leave page
          </Button>
        </>
      }
    />
  );
}
