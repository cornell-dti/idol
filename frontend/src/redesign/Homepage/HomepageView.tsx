import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Button,
  Card,
  DottedBackground,
  IconButton,
  Tooltip,
  useToast
} from '../../design-system-2026/components';
import { ArrowRightIcon, InfoIcon } from '../../design-system-2026/icons';
import productLogos from '../helpProductLogos';
import HomeSearch from './HomeSearch';
import HomepageCover from './HomepageCover';
import { coverStorageKey } from './covers';
import ShortcutEditor from './ShortcutEditor';
import ShortcutCard from '../ShortcutCard/ShortcutCard';
import { defaultShortcuts, parseShortcuts, ShortcutId, shortcuts } from './shortcuts';
import { HomeSummary, SummaryState } from './summary';
import styles from './Homepage.module.css';

const summaryCards = [
  { key: 'coffee', title: 'Coffee Chats', href: '/forms/coffeeChats', metricCount: 3 },
  { key: 'tec', title: 'Team Event Credits', href: '/forms/teamEventCredits', metricCount: 3 },
  { key: 'shoutouts', title: 'Shoutouts', href: '/forms/shoutouts', metricCount: 2 }
] as const;

const slackChannel = (channel: string) => `https://cornelldti.slack.com/channels/${channel}`;

// Products with a #<product>-support channel; logos are shared with the Help page.
const productSupport = [
  { id: 'idol', name: 'IDOL', channel: 'idol-support' },
  { id: 'courseplan', name: 'CoursePlan', channel: 'courseplan-support' },
  { id: 'curaise', name: 'CU Raise', channel: 'curaise-support' },
  { id: 'loop', name: 'Loop', channel: 'loop-support' }
] as const;

const helpLinks = [
  {
    title: 'Glossary',
    description: 'Common terms & IDOL definitions',
    href: '/help',
    external: false
  },
  {
    title: 'More help',
    description: 'Ask the IDOL team on Slack.',
    href: slackChannel('idol-support'),
    external: true
  }
] as const;

function ProductSupport(): JSX.Element {
  return (
    <section className={styles.productSupport} aria-labelledby="home-product-support">
      <div className={styles.sectionHeading}>
        <h2 id="home-product-support" className="idol-heading-2">
          Product support
        </h2>
        <Tooltip
          trigger={
            <IconButton
              variant="tertiary"
              size={24}
              icon={<InfoIcon size={16} />}
              aria-label="About product support"
            />
          }
          content="Found a bug or have feedback on a DTI product? Each one has its own Slack support channel. Pick a product to open it."
        />
      </div>
      <ul className={styles.productGrid}>
        {productSupport.map(({ id, name, channel }) => (
          <li key={id}>
            <a
              href={slackChannel(channel)}
              target="_blank"
              rel="noreferrer"
              className={styles.productLink}
              aria-label={`${name} support on Slack (#${channel})`}
            >
              <span className={styles.productTile}>
                <img src={productLogos[id]} alt="" width={40} height={40} />
              </span>
              <span>{name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GetHelp(): JSX.Element {
  return (
    <section className={styles.getHelp} aria-labelledby="home-get-help">
      <h2 id="home-get-help" className="idol-heading-2">
        Get help
      </h2>
      <div className={styles.helpGrid}>
        {helpLinks.map(({ title, description, href, external }) => {
          const card = (
            <Card
              size="compact"
              header={title}
              headingLevel="h3"
              action={<ArrowRightIcon size={16} aria-hidden />}
              className={styles.helpCard}
            >
              <p className={styles.helpDescription}>{description}</p>
            </Card>
          );
          return external ? (
            <a key={href} href={href} target="_blank" rel="noreferrer" className={styles.helpLink}>
              {card}
            </a>
          ) : (
            <Link key={href} href={href}>
              <a href={href} className={styles.helpLink}>
                {card}
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Not per-user: the skeleton renders before we know who is signed in.
const shortcutCountKey = 'idol:home-shortcut-count';
function readShortcutCount(): number | null {
  try {
    const value = Number(window.localStorage.getItem(shortcutCountKey));
    return Number.isInteger(value) && value >= 0 && value <= shortcuts.length ? value : null;
  } catch {
    return null;
  }
}
function rememberShortcutCount(count: number) {
  try {
    window.localStorage.setItem(shortcutCountKey, String(count));
  } catch {
    // Storage unavailable: the skeleton falls back to the default count.
  }
}

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
  // Match the viewer's real number of shortcut cards (remembered from their last visit).
  const [shortcutCount, setShortcutCount] = useState<number>(defaultShortcuts.length);
  useEffect(() => {
    const remembered = readShortcutCount();
    if (remembered !== null) setShortcutCount(remembered);
  }, []);
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
              {Array.from({ length: shortcutCount }, (_, id) => (
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
            <div className={styles.productSupport}>
              <h2 className="idol-heading-2">
                <span className={`${styles.headingSkeleton} idol-skeleton`} />
              </h2>
              <div className={styles.productGrid}>
                {productSupport.map(({ id }) => (
                  <div key={id} className={styles.productLink}>
                    <span className={`${styles.productTileSkeleton} idol-skeleton`} />
                    <span className={`${styles.productLabelSkeleton} idol-skeleton`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.sidebar}>
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
            <div className={styles.getHelp}>
              <h2 className="idol-heading-2">
                <span className={`${styles.headingSkeleton} idol-skeleton`} />
              </h2>
              <div className={styles.helpGrid}>
                {helpLinks.map(({ href }) => (
                  <Card
                    key={href}
                    size="compact"
                    header={<span className={`${styles.cardTitleSkeleton} idol-skeleton`} />}
                    action={<span className={`${styles.cardArrowSkeleton} idol-skeleton`} />}
                  >
                    <div className={styles.helpCopySkeleton}>
                      <span className={`${styles.helpLineSkeleton} idol-skeleton`} />
                      <span className={`${styles.helpLineSkeleton} idol-skeleton`} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
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
  const coverKey = coverStorageKey(storageKey);
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
  useEffect(() => {
    if (ready && storageKey) rememberShortcutCount(selected.length);
  }, [ready, storageKey, selected]);
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
                <ShortcutCard
                  key={item.id}
                  href={item.href}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                />
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
            <ProductSupport />
          </section>
          <div className={styles.sidebar}>
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
            <GetHelp />
          </div>
        </div>
      </DottedBackground>
    </div>
  );
}
