import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { Dialog } from '@base-ui/react/dialog';
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { EyeIcon } from '@phosphor-icons/react/dist/csr/Eye';
import { EyeSlashIcon } from '@phosphor-icons/react/dist/csr/EyeSlash';
import {
  Button,
  Card,
  DesignSystemScope,
  DottedBackground,
  IconButton,
  Input,
  Modal,
  Pill,
  Tab,
  TabList,
  TabPanel,
  TabRoot,
  useToast
} from '../../../design-system-2026/components';
import { ArrowRightIcon, MagnifyingGlassIcon } from '../../../design-system-2026/icons';
import ImagesAPI from '../../../API/ImagesAPI';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';
import ShoutoutStack from './ShoutoutStack';
import useAdminShoutouts from './useAdminShoutouts';
import styles from './AdminShoutouts.module.css';

const tabs = [
  { value: 'all', label: 'All', icon: EyeIcon },
  { value: 'hidden', label: 'Hidden', icon: EyeSlashIcon }
] as const;
type View = (typeof tabs)[number]['value'];
const timeZone = 'America/New_York';
const dayParts = new Intl.DateTimeFormat('en-US', {
  timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});
const displayDate = new Intl.DateTimeFormat('en-US', { timeZone, dateStyle: 'medium' });

function calendarDay(timestamp: number): string {
  const parts = dayParts.formatToParts(timestamp);
  return ['year', 'month', 'day']
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join('-');
}

function initialDates() {
  const end = calendarDay(Date.now());
  const start = new Date(`${end}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - 13);
  return { start: start.toISOString().slice(0, 10), end };
}

type ImageCache = Map<string, Promise<string>>;

function Attachment({
  path,
  cache,
  recipient
}: {
  path: string;
  cache: ImageCache;
  recipient: string;
}): JSX.Element {
  const [url, setUrl] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    let request = cache.get(path);
    if (!request) {
      request = ImagesAPI.getImage(path);
      cache.set(path, request);
    }
    request
      .then((src) => {
        if (active) {
          if (src) setUrl(src);
          else setFailed(true);
        }
      })
      .catch(() => {
        cache.delete(path);
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [path, cache]);

  if (failed) return <p className={styles.meta}>Image unavailable.</p>;
  if (!url) return <p className={styles.meta}>Loading image…</p>;
  return (
    <img
      className={styles.attachment}
      src={url}
      alt={`Attachment for ${recipient}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ShoutoutCard({
  item,
  index,
  present,
  onModerate,
  imageCache
}: {
  item: Shoutout;
  index: number;
  present: boolean;
  onModerate: (item: Shoutout) => void;
  imageCache: ImageCache;
}): JSX.Element {
  const from = item.isAnon
    ? 'Anonymous'
    : `${item.giver?.firstName ?? ''} ${item.giver?.lastName ?? ''}`.trim() || 'Unknown member';
  return (
    <Card className={styles.card}>
      <article className={styles.cardContent}>
        <span className={styles.number}>{index + 1}</span>
        <h2>{item.receiver}</h2>
        <p className={styles.message}>{item.message}</p>
        <p className={styles.meta}>– {from}</p>
        {item.images?.[0] && (
          <Attachment
            key={item.images[0]}
            path={item.images[0]}
            recipient={item.receiver}
            cache={imageCache}
          />
        )}
        {!present && (
          <div className={styles.cardActions}>
            {item.hidden && <Pill>Hidden</Pill>}
            <time className={styles.meta} dateTime={new Date(item.timestamp).toISOString()}>
              {displayDate.format(item.timestamp)}
            </time>
            <IconButton
              variant="tertiary"
              aria-label={`${item.hidden ? 'Unhide' : 'Hide'} shoutout for ${item.receiver}`}
              icon={item.hidden ? <EyeIcon size={16} /> : <EyeSlashIcon size={16} />}
              onClick={() => onModerate(item)}
            />
          </div>
        )}
      </article>
    </Card>
  );
}

type ViewProps = {
  shoutouts: Shoutout[];
  loading?: boolean;
  error?: boolean;
  retry: () => void;
  onVisibilityChange: (id: string, hidden: boolean) => Promise<void>;
};

export function AdminShoutoutsView({
  shoutouts,
  loading,
  error,
  retry,
  onVisibilityChange
}: ViewProps): JSX.Element {
  const toast = useToast();
  const [dates, setDates] = useState(initialDates);
  const [view, setView] = useState<View>('all');
  const [query, setQuery] = useState('');
  const [presenting, setPresenting] = useState(false);
  const stagePopup = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<Shoutout | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [imageCache] = useState<ImageCache>(() => new Map());
  const invalid = !dates.start || !dates.end || dates.start > dates.end;
  const inRange = useMemo(
    () =>
      shoutouts
        .filter(({ timestamp }) => {
          const day = calendarDay(timestamp);
          return day >= dates.start && day <= dates.end;
        })
        .sort((a, b) => a.timestamp - b.timestamp),
    [shoutouts, dates]
  );
  const search = query.trim().toLowerCase();
  const matches = inRange.filter((item) =>
    [
      item.receiver,
      item.message,
      item.isAnon ? 'Anonymous' : `${item.giver?.firstName ?? ''} ${item.giver?.lastName ?? ''}`
    ].some((value) => value.toLowerCase().includes(search))
  );
  const items = matches.filter((item) => view === 'all' || item.hidden);
  const visible = matches.filter((item) => !item.hidden);

  const confirm = async () => {
    if (!pending || saving) return;
    setSaving(true);
    setSaveError(false);
    try {
      await onVisibilityChange(pending.uuid, !pending.hidden);
      toast.add({ title: pending.hidden ? 'Shoutout unhidden.' : 'Shoutout hidden.' });
      setPending(null);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  const renderCard = (item: Shoutout, index: number, present = false) => (
    <ShoutoutCard
      item={item}
      index={index}
      present={present}
      imageCache={imageCache}
      onModerate={(target) => {
        setPending(target);
        setSaveError(false);
      }}
    />
  );

  const scope = view === 'hidden' ? 'hidden ' : '';
  const visibilityAction = pending?.hidden ? 'Unhide shoutout' : 'Hide shoutout';
  let results: JSX.Element;
  if (invalid)
    results = (
      <p className={styles.status} role="alert">
        Choose a start date on or before the end date.
      </p>
    );
  else if (loading)
    results = (
      <p className={styles.status} role="status">
        Loading shoutouts…
      </p>
    );
  else if (error)
    results = (
      <div className={styles.status}>
        <p role="alert">Couldn’t load shoutouts.</p>
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      </div>
    );
  else if (!items.length)
    results = (
      <p className={styles.status}>
        No {scope}shoutouts {search ? 'match your search' : 'in this date range'}.
      </p>
    );
  else
    results = (
      <ol className={styles.list} aria-label="Shoutouts">
        {items.map((item, index) => (
          <li key={item.uuid}>{renderCard(item, index)}</li>
        ))}
      </ol>
    );

  return (
    <>
      <Dialog.Root open={presenting} onOpenChange={setPresenting}>
        <div className={styles.page}>
          <header className={styles.heading}>
            <h1>Shoutouts</h1>
            <div className={styles.dateToolbar}>
              <div
                className={styles.range}
                role="group"
                aria-label="Shoutout date range (Eastern time)"
              >
                <Input
                  id="shoutouts-start"
                  type="date"
                  aria-label="Start date"
                  value={dates.start}
                  onChange={(event) => setDates({ ...dates, start: event.target.value })}
                />
                <span className={styles.rangeArrow}>
                  <ArrowRightIcon size={16} aria-hidden />
                </span>
                <Input
                  id="shoutouts-end"
                  type="date"
                  aria-label="End date"
                  value={dates.end}
                  onChange={(event) => setDates({ ...dates, end: event.target.value })}
                />
              </div>
              <Dialog.Trigger
                render={
                  <Button
                    disabled={invalid || loading || error || !visible.length}
                    icon={<PlayIcon size={16} aria-hidden />}
                  >
                    Present
                  </Button>
                }
              />
            </div>
          </header>
          <TabRoot value={view} onValueChange={(next) => setView(next as View)}>
            <div className={styles.toolbar}>
              <TabList aria-label="Shoutout visibility" activateOnFocus>
                {tabs.map((tab) => (
                  <Tab key={tab.value} value={tab.value} icon={<tab.icon size={16} />}>
                    {tab.label}
                  </Tab>
                ))}
              </TabList>
              <div className={styles.search}>
                <Input
                  id="admin-shoutouts-search"
                  type="search"
                  aria-label="Search shoutouts"
                  placeholder="Search"
                  icon={<MagnifyingGlassIcon size={16} aria-hidden />}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            {tabs.map(({ value }) => (
              <TabPanel key={value} value={value} className={styles.panel}>
                {value === view ? results : null}
              </TabPanel>
            ))}
          </TabRoot>
        </div>
        <Dialog.Portal>
          <Dialog.Popup ref={stagePopup} initialFocus={stagePopup} className={styles.presentation}>
            <DesignSystemScope theme="dark">
              <DottedBackground className={styles.stage}>
                <Dialog.Title className={styles.visuallyHidden}>Present shoutouts</Dialog.Title>
                <DesignSystemScope theme="light" className={styles.stageBack}>
                  <Dialog.Close
                    render={
                      <Button
                        variant="secondary"
                        aria-keyshortcuts="Escape"
                        icon={<ArrowLeftIcon size={16} aria-hidden />}
                      >
                        Back
                      </Button>
                    }
                  />
                </DesignSystemScope>
                {visible.length ? (
                  <ShoutoutStack
                    items={visible}
                    shortcutsDisabled={!presenting}
                    renderCard={(item, index) => renderCard(item, index, true)}
                  />
                ) : (
                  <p className={styles.status}>No visible shoutouts to present.</p>
                )}
              </DottedBackground>
            </DesignSystemScope>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <Modal
        id="admin-shoutout-visibility"
        open={!!pending}
        onOpenChange={(next) => {
          if (!next && !saving) setPending(null);
        }}
        title={pending?.hidden ? 'Unhide shoutout?' : 'Hide shoutout?'}
        description={
          pending?.hidden
            ? `The shoutout for ${pending.receiver} will be visible in Present again.`
            : `The shoutout for ${pending?.receiver ?? ''} will be removed from Present.`
        }
        footer={
          <>
            <Button variant="secondary" disabled={saving} onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button
              variant={pending?.hidden ? 'primary' : 'danger'}
              disabled={saving}
              onClick={confirm}
            >
              {saving ? 'Saving…' : visibilityAction}
            </Button>
          </>
        }
      >
        {saveError && <p role="alert">Couldn’t update this shoutout. Please try again.</p>}
      </Modal>
    </>
  );
}

export default function AdminShoutouts(): JSX.Element {
  const { shoutouts, loading, error, retry, updateVisibility } = useAdminShoutouts();
  return (
    <>
      <Head>
        <title>Admin Shoutouts · IDOL</title>
      </Head>
      <AdminShoutoutsView
        shoutouts={shoutouts}
        loading={loading}
        error={error}
        retry={retry}
        onVisibilityChange={async (id, hidden) => {
          await ShoutoutsAPI.hideShoutout(id, hidden, { throwOnError: true });
          updateVisibility(id, hidden);
        }}
      />
    </>
  );
}
