import { ReactNode, useEffect, useRef } from 'react';
import Router from 'next/router';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { XIcon } from '../../icons';
import { useDesignSystemAppearance } from '../Theme/Theme';
import styles from './Toast.module.css';

/** Accessible announcements, hover/focus-paused timeout, and downward swipe dismissal. */
export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <BaseToast.Provider timeout={3000} limit={1}>
      {children}
      <ToastViewport />
    </BaseToast.Provider>
  );
}

function ToastViewport(): JSX.Element {
  const { toasts, close } = BaseToast.useToastManager();
  const { theme, accent } = useDesignSystemAppearance();
  const latest = useRef({ toasts, close });
  latest.current = { toasts, close };

  // Leaving the page dismisses toasts about it. Only toasts already open when navigation starts
  // close, so a "Saved" toast fired right before a redirect still shows on the next page.
  useEffect(() => {
    let stale: string[] = [];
    const onStart = (_url: string, { shallow }: { shallow?: boolean } = {}) => {
      stale = shallow ? [] : latest.current.toasts.map((toast) => toast.id);
    };
    const onComplete = () => {
      stale.forEach((id) => latest.current.close(id));
      stale = [];
    };
    const onError = () => {
      stale = [];
    };
    Router.events.on('routeChangeStart', onStart);
    Router.events.on('routeChangeComplete', onComplete);
    Router.events.on('routeChangeError', onError);
    return () => {
      Router.events.off('routeChangeStart', onStart);
      Router.events.off('routeChangeComplete', onComplete);
      Router.events.off('routeChangeError', onError);
    };
  }, []);
  return (
    <BaseToast.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
      <BaseToast.Viewport className={styles.viewport} aria-label="Notifications">
        {toasts.map((toast) => (
          <BaseToast.Root
            key={toast.id}
            toast={toast}
            swipeDirection="down"
            className={styles.toast}
          >
            <BaseToast.Content className={styles.content}>
              <BaseToast.Title className={styles.title} />
              {toast.description && <BaseToast.Description className={styles.description} />}
            </BaseToast.Content>
            <BaseToast.Close
              className={styles.close}
              aria-label="Dismiss notification"
              aria-hidden={false}
            >
              <XIcon size={16} aria-hidden="true" />
            </BaseToast.Close>
          </BaseToast.Root>
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

export const useToast = BaseToast.useToastManager;
