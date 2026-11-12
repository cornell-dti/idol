import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Card, DottedBackground, useToast } from '../../design-system-2026/components';
import { ArrowRightIcon } from '../../design-system-2026/icons';
import HomeSearch from './HomeSearch';
import HomepageCover from './HomepageCover';
import ShortcutEditor from './ShortcutEditor';
import { defaultShortcuts, parseShortcuts, ShortcutId, shortcuts } from './shortcuts';
import { HomeSummary, SummaryState } from './summary';
import styles from './Homepage.module.css';

const summaryCards = [
  { key: 'coffee', title: 'Coffee Chats', href: '/forms/coffeeChats', metricCount: 3 },
  { key: 'tec', title: 'Team Event Credits', href: '/forms/teamEventCredits', metricCount: 3 },
  { key: 'shoutouts', title: 'Shoutouts', href: '/forms/shoutouts', metricCount: 2 }
] as const;

function MetricsSkeleton({ count }: { count: number }): JSX.Element {
  return (
    <div className={styles.metrics} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <span className={`${styles.metricValueSkeleton} idol-skeleton`} />
          <span className={`${styles.metricLabelSkeleton} idol-skeleton`} />
        </div>
      ))}
    </div>
  );
}

export function HomepageSkeleton(): JSX.Element {
  return (
    <div className={styles.home} role="status" aria-label="Loading home">
      <div aria-hidden="true" className={styles.hero}>
        <div className={`${styles.coverSkeleton} idol-skeleton`} />
        <div className={styles.welcome}>
          <div className={`${styles.welcomeSkeleton} idol-skeleton`} />
        </div>
      </div>
      <DottedBackground className={styles.surface} aria-hidden="true">
        <div className={`${styles.search} ${styles.searchSkeleton} idol-skeleton`} />
        <div className={styles.columns}>
          <div className={styles.shortcuts}>
            <h2 className="idol-heading-2">
              <span className={`${styles.headingSkeleton} idol-skeleton`} />
            </h2>
            <div className={styles.shortcutGrid}>
              {defaultShortcuts.map((id) => (
                <Card key={id}>
                  <div className={styles.shortcutContent}>
                    <div className={`${styles.shortcutIconSkeleton} idol-skeleton`} />
                    <div className={styles.shortcutCopySkeleton}>
                      <div className={`${styles.shortcutTitleSkeleton} idol-skeleton`} />
                      <div className={`${styles.shortcutDescriptionSkeleton} idol-skeleton`} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className={styles.editButton}>
              <div className={`${styles.editSkeleton} idol-skeleton`} />
            </div>
          </div>
          <div className={styles.glance}>
            <h2 className="idol-heading-2">
              <span className={`${styles.headingSkeleton} idol-skeleton`} />
            </h2>
            {summaryCards.map(({ key, metricCount }) => (
              <Card
                key={key}
                header={<span className={`${styles.cardTitleSkeleton} idol-skeleton`} />}
                action={<span className={`${styles.cardArrowSkeleton} idol-skeleton`} />}
              >
                <MetricsSkeleton count={metricCount} />
              </Card>
            ))}
          </div>
        </div>
      </DottedBackground>
    </div>
  );
}

function SummaryCard({
  title,
  href,
  metricCount,
  state,
  onRetry
}: {
  title: string;
  href: string;
  metricCount: number;
  state: SummaryState;
  onRetry: () => void;
}): JSX.Element {
  let content: JSX.Element;
  if (state.error) {
    content = (
      <div className={styles.error}>
        <p role="alert">{state.error}</p>
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  } else if (state.metrics) {
    content = (
      <dl className={styles.metrics}>
        {state.metrics.map((metric) => (
          <div key={metric.label}>
            <dd>{metric.value}</dd>
            <dt>{metric.label}</dt>
          </div>
        ))}
      </dl>
    );
  } else {
    content = (
      <div role="status" aria-label={`Loading ${title}`}>
        <MetricsSkeleton count={metricCount} />
      </div>
    );
  }

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
      {content}
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
  const [selected, setSelected] = useState<ShortcutId[]>(defaultShortcuts);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    try {
      setSelected(parseShortcuts(storageKey ? window.localStorage.getItem(storageKey) : null));
    } catch {
      setSelected([...defaultShortcuts]);
    }
    setReady(true);
  }, [storageKey]);
  if (!ready) return <HomepageSkeleton />;

  const save = (items: ShortcutId[]) => {
    setSelected(items);
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
        <HomepageCover key={coverKey} storageKey={coverKey} />
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
              {visible.map((item) => (
                <Link key={item.id} href={item.href}>
                  <a href={item.href} className={styles.shortcutLink}>
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
              <Card>
                <p role="status">Choose your favorite actions with Edit shortcuts.</p>
              </Card>
            )}
            <div className={styles.editButton}>
              <ShortcutEditor selected={selected} onSave={save} disabled={false} />
            </div>
            <p className={styles.notice} role="status">
              {notice}
            </p>
          </section>
          <section className={styles.glance} aria-labelledby="home-glance">
            <h2 id="home-glance" className="idol-heading-2">
              At a glance
            </h2>
            {summaryCards.map(({ key, title, href, metricCount }) => (
              <SummaryCard
                key={key}
                title={title}
                href={href}
                metricCount={metricCount}
                state={summary[key]}
                onRetry={onRetry}
              />
            ))}
          </section>
        </div>
      </DottedBackground>
    </div>
  );
}
