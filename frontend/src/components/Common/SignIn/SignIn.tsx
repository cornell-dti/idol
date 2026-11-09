import { useRef, useState } from 'react';
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

export default function SignIn(): JSX.Element {
  const page = useRef<HTMLDivElement>(null);
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
    <DesignSystemScope>
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
      </DottedBackground>
    </DesignSystemScope>
  );
}
