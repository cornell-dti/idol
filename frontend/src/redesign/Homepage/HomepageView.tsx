import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Card, DottedBackground, useToast } from '../../design-system-2026/components';
import { ArrowRightIcon } from '../../design-system-2026/icons';
import HomeSearch from './HomeSearch';
import CoverEditor from './CoverEditor';
import {
  defaultCover,
  defaultCoverPreferences,
  presetCovers,
  readCoverPreferences,
  CoverPreferences
} from './covers';
import ShortcutEditor from './ShortcutEditor';
import { defaultShortcuts, parseShortcuts, ShortcutId, shortcuts } from './shortcuts';
import { HomeSummary, SummaryState } from './summary';
import styles from './Homepage.module.css';

// Keep the last card under 750 ms even with every shortcut enabled.
const cardDelay = (index: number) => ({ animationDelay: `${150 + index * 42}ms` });

function SummaryCard({
  title,
  href,
  state,
  onRetry
}: {
  title: string;
  href: string;
  state: SummaryState;
  onRetry: () => void;
}): JSX.Element {
  return (
    <Card
      header={title}
      headingLevel="h3"
      action={
        <Link href={href}>
          <a href={href} className={styles.cardArrow} aria-label={`View ${title}`}>
            <ArrowRightIcon size={16} aria-hidden />
          </a>
        </Link>
      }
    >
      {state.error ? (
        <div className={styles.error}>
          <p role="alert">{state.error}</p>
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : (
        <dl className={styles.metrics} aria-busy={!state.metrics}>
          {state.metrics ? (
            state.metrics.map((metric) => (
              <div key={metric.label}>
                <dd>{metric.value}</dd>
                <dt>{metric.label}</dt>
              </div>
            ))
          ) : (
            <div className={styles.loading} role="status">
              Loading…
            </div>
          )}
        </dl>
      )}
    </Card>
  );
}

type HomepageViewProps = {
  name: string;
  storageKey?: string;
  summary: HomeSummary;
  onRetry: () => void;
};

export default function HomepageView({
  name,
  storageKey,
  summary,
  onRetry
}: HomepageViewProps): JSX.Element {
  const toast = useToast();
  const coverKey = `${storageKey ?? 'idol:homepage'}:cover`;
  const [coverPreferences, setCoverPreferences] = useState(defaultCoverPreferences);
  useEffect(() => setCoverPreferences(readCoverPreferences(coverKey)), [coverKey]);
  const cover =
    [...presetCovers, ...coverPreferences.custom].find(
      (item) => item.id === coverPreferences.selected
    ) ?? defaultCover;
  const saveCover = (next: CoverPreferences) => {
    localStorage.setItem(coverKey, JSON.stringify(next));
    setCoverPreferences(next);
    toast.add({ id: 'cover-saved', title: 'Cover saved.' });
  };
  const [selected, setSelected] = useState<ShortcutId[]>(defaultShortcuts);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    try {
      setSelected(parseShortcuts(storageKey ? window.localStorage.getItem(storageKey) : null));
    } catch {
      setSelected([...defaultShortcuts]);
    }
    setReady(true);
  }, [storageKey]);
  const save = (items: ShortcutId[]) => {
    setSelected(items);
    setEditing(false);
    try {
      if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(items));
      setNotice('');
      toast.add({ id: 'shortcuts-saved', title: 'Shortcuts saved.' });
    } catch {
      setNotice('Shortcuts updated for this visit. Browser storage is unavailable.');
    }
  };
  const visible = selected
    .map((id) => shortcuts.find((item) => item.id === id))
    .filter((item): item is (typeof shortcuts)[number] => Boolean(item));
  return (
    <div className={styles.home}>
      <Head>
        <title>Home · IDOL</title>
      </Head>
      <div className={styles.hero}>
        <img className={styles.heroPhoto} src={cover.src} alt="" />
        <div className={styles.heroFade} />
        <CoverEditor value={coverPreferences} onSave={saveCover} disabled={!ready} />
        <div className={styles.welcome}>
          <h1>{name ? `Welcome, ${name}!` : 'Welcome to IDOL!'}</h1>
        </div>
      </div>
      <DottedBackground className={styles.surface}>
        <div className={styles.search}>
          <HomeSearch />
        </div>
        <div className={styles.columns}>
          <section className={styles.shortcuts} aria-labelledby="home-shortcuts">
            <h2 id="home-shortcuts" className="idol-heading-2">
              Shortcuts
            </h2>
            <div className={styles.shortcutGrid}>
              {visible.map((item, index) => (
                <Link key={item.id} href={item.href}>
                  <a
                    href={item.href}
                    className={`${styles.shortcutLink} ${styles.enterCard}`}
                    style={cardDelay(index)}
                  >
                    <Card className={styles.shortcutCard}>
                      <div className={styles.shortcutContent}>
                        <span className={styles.iconTile}>
                          <item.icon size={32} aria-hidden />
                        </span>
                        <div>
                          <h3>{item.label}</h3>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
            {!visible.length && (
              <Card className={styles.enterCard} style={cardDelay(0)}>
                <p role="status">Choose your favorite actions with Edit shortcuts.</p>
              </Card>
            )}
            <div className={styles.editButton}>
              <Button variant="secondary" disabled={!ready} onClick={() => setEditing(true)}>
                Edit shortcuts
              </Button>
            </div>
            <p className={styles.notice} role="status">
              {notice}
            </p>
          </section>
          <section className={styles.glance} aria-labelledby="home-glance">
            <h2 id="home-glance" className="idol-heading-2">
              At a glance
            </h2>
            {(
              [
                ['Coffee Chats', '/forms/coffeeChats', summary.coffee],
                ['Team Event Credits', '/forms/teamEventCredits', summary.tec],
                ['Shoutouts', '/forms/shoutouts', summary.shoutouts]
              ] as const
            ).map(([title, href, state], index) => (
              <div
                key={href}
                className={styles.enterCard}
                style={cardDelay(Math.max(visible.length, 1) + index)}
              >
                <SummaryCard title={title} href={href} state={state} onRetry={onRetry} />
              </div>
            ))}
          </section>
        </div>
      </DottedBackground>
      {editing && (
        <ShortcutEditor selected={selected} onSave={save} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}
