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
  BASE_THEME_OPTIONS,
  SPECIAL_THEME_OPTIONS,
  isDarkTheme,
  isSpecialTheme,
  useAppearance,
  ThemePreference,
  ResolvedTheme,
  Accent
} from '../design-system-2026/components/Theme/AppearanceProvider';
import { useSelf } from '../components/Common/FirestoreDataProvider';
import { useUserEmail } from '../components/Common/UserProvider/UserProvider';
import { auth } from '../firebase';
import { SignOutIcon, UserIcon } from '../design-system-2026/icons';
import CoverEditor from './Homepage/CoverEditor';
import { coverStorageKey } from './Homepage/covers';
import { homeShortcutsStorageKey } from './Homepage/shortcuts';
import useCoverPreferences from './Homepage/useCoverPreferences';
import styles from './Settings.module.css';

function ThemeThumbnail({
  mode,
  accent
}: {
  readonly mode: ThemePreference;
  readonly accent: Accent;
}): JSX.Element {
  const id = `settings-theme-${mode}`;
  const scene = (theme: ResolvedTheme) => (
    <g data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
      <rect width="128" height="80" fill="var(--idol-bg-root)" />
      <rect
        x="5"
        y="5"
        width="118"
        height="70"
        rx="5"
        fill="var(--idol-bg-default)"
        stroke="var(--idol-stroke-medium)"
      />
      <path d="M32 5v70M32 21h91" stroke="var(--idol-stroke-medium)" />
      <rect x="11" y="11" width="10" height="3" rx="1.5" fill="var(--idol-accent-default)" />
      <rect x="11" y="26" width="15" height="4" rx="2" fill="var(--idol-stroke-medium)" />
      <rect x="11" y="35" width="11" height="3" rx="1.5" fill="var(--idol-stroke-medium)" />
      <rect x="11" y="43" width="13" height="3" rx="1.5" fill="var(--idol-stroke-medium)" />
      <circle cx="14" cy="66" r="3" fill="var(--idol-stroke-medium)" />
      <rect x="40" y="12" width="27" height="3" rx="1.5" fill="var(--idol-stroke-medium)" />
      <circle cx="115" cy="13.5" r="2" fill="var(--idol-accent-default)" />
      <rect
        x="41"
        y="29"
        width="34"
        height="4"
        rx="2"
        fill="var(--idol-fg-default)"
        opacity=".65"
      />
      <rect x="41" y="38" width="66" height="3" rx="1.5" fill="var(--idol-stroke-medium)" />
      <rect
        x="41"
        y="47"
        width="31"
        height="19"
        rx="3"
        fill="var(--idol-fantasy-parchment, var(--idol-bg-root))"
        stroke="var(--idol-stroke-medium)"
      />
      <rect
        x="78"
        y="47"
        width="36"
        height="19"
        rx="3"
        fill="var(--idol-fantasy-parchment, var(--idol-bg-root))"
        stroke="var(--idol-stroke-medium)"
      />
      <rect x="46" y="52" width="16" height="3" rx="1.5" fill="var(--idol-accent-default)" />
      <rect x="83" y="52" width="22" height="3" rx="1.5" fill="var(--idol-stroke-medium)" />
      <rect x="46" y="59" width="19" height="2" rx="1" fill="var(--idol-stroke-medium)" />
      <rect x="83" y="59" width="14" height="2" rx="1" fill="var(--idol-stroke-medium)" />
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
function ThemeOptions({
  id,
  label,
  options
}: {
  id: string;
  label: string;
  options: readonly ThemePreference[];
}): JSX.Element {
  const { theme, accent, setTheme } = useAppearance();
  return (
    <RadioGroup
      aria-labelledby={id}
      value={theme}
      onValueChange={(value) => setTheme(value as ThemePreference)}
      className={`${styles.row} ${styles.themeRow}`}
    >
      <h3 id={id} className={styles.rowTitle}>
        {label}
      </h3>
      {options.map((mode) => (
        <label key={mode} className={styles.choice}>
          <Radio value={mode} className={styles.optionRadio} />
          <ThemeThumbnail mode={mode} accent={accent} />
          <span>{mode[0].toUpperCase() + mode.slice(1)}</span>
        </label>
      ))}
    </RadioGroup>
  );
}

export default function Settings(): JSX.Element {
  const { theme, resolvedTheme, accent, setAccent } = useAppearance();
  const accentDisabled = isSpecialTheme(theme);
  const self = useSelf();
  const email = useUserEmail();
  const { preferences, saveCover } = useCoverPreferences(
    coverStorageKey(homeShortcutsStorageKey(self?.email))
  );
  return (
    <DesignSystemScope>
      <Head>
        <title>Settings · IDOL</title>
      </Head>
      <div className={styles.page}>
        <h1 className="idol-heading-1">Settings</h1>
        <Card header="Appearance">
          <div className={styles.appearance}>
            <ThemeOptions
              id="settings-default-theme"
              label="Default theme"
              options={BASE_THEME_OPTIONS}
            />
            <div className={styles.row} data-disabled={accentDisabled || undefined}>
              <div className={styles.accentLabel}>
                <h3 id="settings-accent" className={styles.rowTitle}>
                  Accent color
                </h3>
              </div>
              <RadioGroup
                aria-labelledby="settings-accent"
                value={accentDisabled ? '' : accent}
                disabled={accentDisabled}
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
                      {color === 'black' && isDarkTheme(resolvedTheme)
                        ? 'White'
                        : color[0].toUpperCase() + color.slice(1)}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <ThemeOptions
              id="settings-special-theme"
              label="Special theme"
              options={SPECIAL_THEME_OPTIONS}
            />
            <div className={`${styles.row} ${styles.coverRow}`}>
              <h3 className={styles.rowTitle}>Homepage cover image</h3>
              <CoverEditor value={preferences} onSave={saveCover} disabled={false} />
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
                render={({ children, ...props }) => (
                  <a {...props} href="/forms/profile" role={undefined}>
                    {children}
                  </a>
                )}
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
              Sign out
            </Button>
          </Card>
        </div>
      </div>
    </DesignSystemScope>
  );
}
