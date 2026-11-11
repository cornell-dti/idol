import { ReactNode, useEffect, useLayoutEffect, useRef } from 'react';
import { DottedBackground } from '../DottedBackground/DottedBackground';
import { DesignSystemScope, Theme } from '../Theme/Theme';
import styles from './AppShell.module.css';

export type AppShellProps = {
  sidebar?: ReactNode;
  header: ReactNode;
  navigation?: ReactNode;
  flush?: boolean;
  animateNavigation?: boolean;
  children?: ReactNode;
  pageKey?: string;
  contentTheme?: Theme;
};

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Compose inside DesignSystemScope; navigation and page state belong to the caller. */
export function AppShell({
  sidebar,
  header,
  navigation,
  flush = false,
  animateNavigation = false,
  children,
  pageKey,
  contentTheme
}: AppShellProps): JSX.Element {
  const content = useRef<HTMLDivElement>(null);
  useClientLayoutEffect(() => {
    // Next.js resets the window, but this persistent panel owns the page's scroll.
    // Reset before paint so the next page never flashes at the previous position.
    if (content.current) {
      content.current.scrollTop = 0;
      content.current.scrollLeft = 0;
    }
  }, [pageKey]);
  return (
    <div
      className={`${styles.shell} ${flush ? styles.flush : ''} ${
        animateNavigation ? styles.enter : ''
      }`}
    >
      <a href="#shell-content" className={styles.skipLink}>
        Skip to content
      </a>
      {sidebar != null && <div className={styles.sidebar}>{sidebar}</div>}
      <div className={styles.wrapper}>
        <main id="shell-content" tabIndex={-1} className={styles.panel}>
          {header != null && <header className={styles.header}>{header}</header>}
          <DesignSystemScope theme={contentTheme} className={styles.contentScope}>
            <DottedBackground ref={content} className={styles.content}>
              {children}
            </DottedBackground>
          </DesignSystemScope>
        </main>
        {navigation}
      </div>
    </div>
  );
}
