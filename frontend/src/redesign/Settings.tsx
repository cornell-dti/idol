import Head from 'next/head';
import Link from 'next/link';
import {
  Button,
  Card,
  Radio,
  RadioGroup,
  DesignSystemScope
} from '../design-system-2026/components';
import {
  ACCENT_OPTIONS,
  THEME_OPTIONS,
  useAppearance,
  ThemePreference,
  Accent
} from '../design-system-2026/components/Theme/AppearanceProvider';
import { useSelf } from '../components/Common/FirestoreDataProvider';
import { useUserEmail } from '../components/Common/UserProvider/UserProvider';
import { auth } from '../firebase';
import { SignOutIcon, UserIcon } from '../design-system-2026/icons';
import styles from './Settings.module.css';

function ThemeThumbnail({ mode }: { readonly mode: 'light' | 'dark' | 'auto' }): JSX.Element {
  const id = `settings-theme-${mode}`;
  const scene = (theme: 'light' | 'dark') => (
    <g className={styles[theme]}>
      <rect width="128" height="80" fill="var(--mini-bg)" />
      <rect
        x="5"
        y="5"
        width="118"
        height="70"
        rx="5"
        fill="var(--mini-panel)"
        stroke="var(--mini-stroke)"
      />
      <path d="M32 5v70M32 21h91" stroke="var(--mini-stroke)" />
      <rect x="11" y="11" width="10" height="3" rx="1.5" fill="var(--idol-accent-default)" />
      <rect x="11" y="26" width="15" height="4" rx="2" fill="var(--mini-stroke)" />
      <rect x="11" y="35" width="11" height="3" rx="1.5" fill="var(--mini-stroke)" />
      <rect x="11" y="43" width="13" height="3" rx="1.5" fill="var(--mini-stroke)" />
      <circle cx="14" cy="66" r="3" fill="var(--mini-stroke)" />
      <rect x="40" y="12" width="27" height="3" rx="1.5" fill="var(--mini-stroke)" />
      <circle cx="115" cy="13.5" r="2" fill="var(--idol-accent-default)" />
      <rect x="41" y="29" width="34" height="4" rx="2" fill="var(--mini-fg)" opacity=".65" />
      <rect x="41" y="38" width="66" height="3" rx="1.5" fill="var(--mini-stroke)" />
      <rect
        x="41"
        y="47"
        width="31"
        height="19"
        rx="3"
        fill="var(--mini-bg)"
        stroke="var(--mini-stroke)"
      />
      <rect
        x="78"
        y="47"
        width="36"
        height="19"
        rx="3"
        fill="var(--mini-bg)"
        stroke="var(--mini-stroke)"
      />
      <rect x="46" y="52" width="16" height="3" rx="1.5" fill="var(--idol-accent-default)" />
      <rect x="83" y="52" width="22" height="3" rx="1.5" fill="var(--mini-stroke)" />
      <rect x="46" y="59" width="19" height="2" rx="1" fill="var(--mini-stroke)" />
      <rect x="83" y="59" width="14" height="2" rx="1" fill="var(--mini-stroke)" />
    </g>
  );
  return (
    <span className={styles.thumbnail} aria-hidden="true">
      <svg viewBox="0 0 128 80" width="128" height="80" className={styles.themePreview}>
        {mode === 'auto' ? (
          <>
            <defs>
              <clipPath id={`${id}-left`}>
                <rect width="64" height="80" />
              </clipPath>
              <clipPath id={`${id}-right`}>
                <rect x="64" width="64" height="80" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${id}-left)`}>{scene('light')}</g>
            <g clipPath={`url(#${id}-right)`}>{scene('dark')}</g>
            <path d="M64 0v80" stroke="var(--idol-stroke-black)" />
          </>
        ) : (
          scene(mode)
        )}
      </svg>
    </span>
  );
}
export default function Settings(): JSX.Element {
  const { theme, resolvedTheme, accent, setTheme, setAccent } = useAppearance();
  const self = useSelf();
  const email = useUserEmail();
  return (
    <DesignSystemScope>
      <Head>
        <title>Settings · IDOL</title>
      </Head>
      <div className={styles.page}>
        <h1 className="idol-heading-1">Settings</h1>
        <Card header="Appearance">
          <div className={styles.appearance}>
            <div className={styles.row}>
              <h3 id="settings-theme" className={styles.rowTitle}>
                Theme
              </h3>
              <RadioGroup
                aria-labelledby="settings-theme"
                value={theme}
                onValueChange={(value) => setTheme(value as ThemePreference)}
                className={styles.themes}
              >
                {THEME_OPTIONS.map((mode) => (
                  <label key={mode} className={styles.choice}>
                    <Radio value={mode} className={styles.optionRadio} />
                    <ThemeThumbnail mode={mode} />
                    <span>{{ auto: 'Auto', light: 'Light', dark: 'Dark' }[mode]}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className={styles.row}>
              <h3 id="settings-accent" className={styles.rowTitle}>
                Accent color
              </h3>
              <RadioGroup
                aria-labelledby="settings-accent"
                value={accent}
                onValueChange={(value) => setAccent(value as Accent)}
                className={styles.accents}
              >
                {ACCENT_OPTIONS.map((color) => (
                  <label key={color} className={`${styles.choice} ${styles.colorChoice}`}>
                    <Radio value={color} className={styles.optionRadio} />
                    <span className={styles.swatchRing}>
                      <span className={styles.swatch} data-color={color} />
                    </span>
                    <span>
                      {color === 'black' && resolvedTheme === 'dark'
                        ? 'White'
                        : color[0].toUpperCase() + color.slice(1)}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>
        </Card>
        <div className={styles.accountCards}>
          <Card header="Profile" className={styles.accountCard}>
            <div className={styles.cardDetails}>
              <p className={styles.profileDescription}>
                Update your profile picture, personal information, bio, and social links on your
                profile page.
              </p>
            </div>
            <Link href="/forms/profile" passHref>
              <Button
                variant="secondary"
                className={styles.cardButton}
                icon={<UserIcon size={16} />}
                nativeButton={false}
                render={<a href="/forms/profile">Edit profile</a>}
              >
                Edit profile
              </Button>
            </Link>
          </Card>
          <Card header="Account" className={styles.accountCard}>
            <div className={styles.cardDetails}>
              <p className={styles.profileDescription}>Logged in as:</p>
              <div>
                <p className={styles.name}>
                  {self ? `${self.firstName} ${self.lastName}` : 'Member'}
                </p>
                <p className={styles.email}>{email}</p>
              </div>
            </div>
            <Button
              variant="secondaryDanger"
              className={styles.cardButton}
              icon={<SignOutIcon size={16} />}
              onClick={() => auth.signOut()}
            >
              Log out
            </Button>
          </Card>
        </div>
      </div>
    </DesignSystemScope>
  );
}
