import { ComponentType, createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useSelf } from '../components/Common/FirestoreDataProvider';

const PREVIEW_SUBTEAM = 'idol';
export const PREVIEW_STORAGE_KEY = 'idol:new-ui';

type PreviewToggle = {
  readonly ready: boolean;
  readonly canPreview: boolean;
  readonly enabled: boolean;
  readonly setEnabled: (enabled: boolean) => void;
};

const PreviewContext = createContext<PreviewToggle>({
  ready: false,
  canPreview: false,
  enabled: false,
  setEnabled: () => {}
});

/**
 * Lets IDOL switch between the released site and the latest redesign work.
 * Everyone else always sees the released site.
 */
export function PreviewProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const self = useSelf();
  const canPreview = self?.subteams.includes(PREVIEW_SUBTEAM) ?? false;
  const [ready, setReady] = useState(false);
  const [enabled, setEnabledState] = useState(false);
  useEffect(() => {
    try {
      setEnabledState(window.localStorage.getItem(PREVIEW_STORAGE_KEY) === 'true');
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
    setReady(true);
  }, []);
  const setEnabled = (value: boolean) => {
    setEnabledState(value);
    try {
      window.localStorage.setItem(PREVIEW_STORAGE_KEY, String(value));
    } catch {
      // Keep the in-memory preference when storage is unavailable.
    }
  };

  return (
    <PreviewContext.Provider value={{ ready, canPreview, enabled, setEnabled }}>
      {children}
    </PreviewContext.Provider>
  );
}

/** For the toggle in the sidebar. Only render it when `canPreview` is true. */
export const usePreviewToggle = (): PreviewToggle => useContext(PreviewContext);

/** @returns whether to render unreleased redesign work for the current user */
export const usePreview = (): boolean => {
  const { canPreview, enabled } = usePreviewToggle();
  return canPreview && enabled;
};

/**
 * Renders `NewPage` for idol and `OldPage` for everyone else.
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
