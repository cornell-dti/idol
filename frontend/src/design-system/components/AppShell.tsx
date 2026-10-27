import { ReactNode } from 'react';
import { DottedBackground } from './DottedBackground';
import styles from './app-shell.module.css';

export type AppShellProps = {
  sidebar: ReactNode;
  header: ReactNode;
  children?: ReactNode;
};

/** Compose inside DesignSystemScope; navigation and page state belong to the caller. */
export function AppShell({ sidebar, header, children }: AppShellProps): JSX.Element {
  return (
    <div className={styles.shell}>
      <a href="#shell-content" className={styles.skipLink}>
        Skip to content
      </a>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.wrapper}>
        <main id="shell-content" tabIndex={-1} className={styles.panel}>
          <header className={styles.header}>{header}</header>
          <DottedBackground className={styles.content}>{children}</DottedBackground>
        </main>
      </div>
    </div>
  );
}
