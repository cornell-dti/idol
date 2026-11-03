import { ComponentType, createContext, ReactNode, useContext, useState } from 'react';
import { useSelf } from '../components/Common/FirestoreDataProvider';
import styles from './PreviewToggle.module.css';

const PREVIEW_SUBTEAM = 'idol';

const PreviewContext = createContext<boolean>(false);

/**
 * Lets IDOL switch between the released site and the latest redesign work.
 * Everyone else always sees the released site and never sees the toggle.
 */
export function PreviewProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const self = useSelf();
  const canPreview = self?.subteams.includes(PREVIEW_SUBTEAM) ?? false;
  const [showInProgress, setShowInProgress] = useState(true);

  return (
    <PreviewContext.Provider value={canPreview && showInProgress}>
      {children}
      {canPreview && (
        <div className={styles.toggle} role="group" aria-label="Redesign preview">
          <button
            type="button"
            className={styles.option}
            aria-pressed={!showInProgress}
            onClick={() => setShowInProgress(false)}
          >
            Released
          </button>
          <button
            type="button"
            className={styles.option}
            aria-pressed={showInProgress}
            onClick={() => setShowInProgress(true)}
          >
            In Progress
          </button>
        </div>
      )}
    </PreviewContext.Provider>
  );
}

/** @returns whether to render unreleased redesign work for the current user */
export const usePreview = (): boolean => useContext(PreviewContext);

/**
 * Renders `NewPage` for previewers and `OldPage` for everyone else.
 * To release, replace `previewPage(OldPage, NewPage)` with `NewPage`.
 */
export function previewPage<P extends object>(
  OldPage: ComponentType<P>,
  NewPage: ComponentType<P>
): ComponentType<P> {
  return function PreviewPage(props: P): JSX.Element {
    return usePreview() ? <NewPage {...props} /> : <OldPage {...props} />;
  };
}
