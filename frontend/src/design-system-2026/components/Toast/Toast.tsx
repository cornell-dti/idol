import { ReactNode } from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { XIcon } from '../../icons';
import { useDesignSystemAppearance } from '../Theme/Theme';
import styles from './Toast.module.css';

/** Accessible announcements, hover/focus-paused timeout, and downward swipe dismissal. */
export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <BaseToast.Provider timeout={5000} limit={1}>
      {children}
      <ToastViewport />
    </BaseToast.Provider>
  );
}

function ToastViewport(): JSX.Element {
  const { toasts } = BaseToast.useToastManager();
  const { theme, accent } = useDesignSystemAppearance();
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
