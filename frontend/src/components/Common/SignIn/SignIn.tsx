import { CSSProperties, useRef, useState } from 'react';
import Head from 'next/head';
import { signInWithPopup } from 'firebase/auth';
import {
  Button,
  DesignSystemScope,
  DottedBackground,
  Link
} from '../../../design-system-2026/components';
import { ArrowRightIcon } from '../../../design-system-2026/icons';
import { auth, provider } from '../../../firebase';
import styles from './SignIn.module.css';
import GoogleLogo from '../../../static/images/google-logo.png';
import LoginGlow from './LoginGlow';
import {
  ACCENT_OPTIONS,
  Accent,
  THEME_OPTIONS,
  ThemePreference,
  useAppearance
} from '../../../design-system-2026/components/Theme/AppearanceProvider';

export default function SignIn(): JSX.Element {
  const page = useRef<HTMLDivElement>(null);
  const { theme, accent, setTheme, setAccent } = useAppearance();
  const [customAccent, setCustomAccent] = useState('');
  const debugStyle = customAccent
    ? ({
        '--idol-accent-default': customAccent,
        '--idol-accent-dimmer': `color-mix(in srgb, ${customAccent} 85%, black)`,
        '--idol-on-accent':
          [1, 3, 5].reduce((sum, offset, index) => {
            const channel = parseInt(customAccent.slice(offset, offset + 2), 16) / 255;
            const linear =
              channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
            return sum + linear * [0.2126, 0.7152, 0.0722][index];
          }, 0) > 0.179
            ? '#171717'
            : '#fff'
      } as CSSProperties)
    : undefined;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const onGoogleSignIn = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      const { code } = err as { code?: string };
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setError(
          code === 'auth/popup-blocked'
            ? 'Your browser blocked the sign-in window. Allow pop-ups for IDOL and try again.'
            : 'We couldn’t sign you in. Check your connection and try again.'
        );
      }
    } finally {
      setBusy(false);
    }
  };
  return (
    <DesignSystemScope style={debugStyle}>
      <Head>
        <title>Welcome to IDOL</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <DottedBackground ref={page} className={styles.page} data-testid="SignIn">
        <LoginGlow containerRef={page} />
        <main className={styles.main}>
          <section className={styles.card} aria-labelledby="sign-in-title">
            <div className={styles.surface}>
              <img
                className={styles.logo}
                src="/design-system/figma/idol-logo.png"
                alt="IDOL"
                width={64}
                height={64}
              />
              <div className={styles.intro}>
                <h1 id="sign-in-title">Welcome to IDOL.</h1>
              </div>
              <p className={styles.description}>
                IDOL is our internal platform for all things admin and team-related!
              </p>
              <div className={styles.action}>
                <Button
                  variant="secondary"
                  className={styles.signInButton}
                  icon={<img src={GoogleLogo.src} alt="" width={16} height={16} />}
                  disabled={busy}
                  onClick={onGoogleSignIn}
                >
                  <span>{busy ? 'Opening Google…' : 'Continue with Google'}</span>
                  <ArrowRightIcon size={16} aria-hidden="true" className={styles.arrow} />
                </Button>
                <p className={styles.accountHint}>Use your Cornell Google account to continue.</p>
                {error && (
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}
              </div>
            </div>
            <footer className={styles.footer}>
              Need access?{' '}
              <Link
                href="https://cornelldti.slack.com/channels/idol-support"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask in #idol-support
              </Link>
            </footer>
          </section>
        </main>
        {/* Temporary login appearance controls. Custom colors stay local to this preview. */}
        <div className={styles.debugPicker} role="group" aria-label="Debug appearance">
          <span>Debug</span>
          <select
            aria-label="Debug theme"
            value={theme}
            onChange={(event) => setTheme(event.target.value as ThemePreference)}
          >
            {THEME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            aria-label="Debug accent"
            value={customAccent ? 'custom' : accent}
            onChange={(event) => {
              if (event.target.value === 'custom') return;
              setCustomAccent('');
              setAccent(event.target.value as Accent);
            }}
          >
            {ACCENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {customAccent && <option value="custom">custom</option>}
          </select>
          <input
            type="color"
            aria-label="Debug custom accent color"
            value={customAccent || '#006fff'}
            onChange={(event) => setCustomAccent(event.target.value)}
          />
        </div>
      </DottedBackground>
    </DesignSystemScope>
  );
}
