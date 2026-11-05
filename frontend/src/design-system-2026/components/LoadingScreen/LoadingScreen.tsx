import { DesignSystemScope } from '../Theme/Theme';
import { DottedBackground } from '../DottedBackground/DottedBackground';
import styles from './LoadingScreen.module.css';

/** Visible only while startup work is pending; the animation never delays completion. */
export default function LoadingScreen(): JSX.Element {
  return (
    <DesignSystemScope>
      <DottedBackground
        className={styles.screen}
        role="status"
        aria-label="Loading IDOL"
        aria-busy="true"
      >
        <div className={styles.spinner} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className={styles.orbit} />
          ))}
        </div>
      </DottedBackground>
    </DesignSystemScope>
  );
}
