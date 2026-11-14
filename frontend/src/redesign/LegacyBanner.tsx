import { RocketLaunchIcon } from '../design-system-2026/icons';
import styles from './LegacyBanner.module.css';

/** Shown above pages that still use the classic UI inside the redesigned app. */
export default function LegacyBanner(): JSX.Element {
  return (
    <div className={styles.banner} role="note">
      <RocketLaunchIcon size={16} aria-hidden />
      <p>
        <strong>Redesign coming soon.</strong> This page still uses the classic IDOL look while we
        rebuild it.
      </p>
    </div>
  );
}
