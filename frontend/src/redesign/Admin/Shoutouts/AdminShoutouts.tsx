import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { Dialog } from '@base-ui/react/dialog';
import { Popover } from '@base-ui/react/popover';
import { PlayIcon } from '@phosphor-icons/react/dist/csr/Play';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { EyeIcon } from '@phosphor-icons/react/dist/csr/Eye';
import { EyeSlashIcon } from '@phosphor-icons/react/dist/csr/EyeSlash';
import { ListBulletsIcon } from '@phosphor-icons/react/dist/csr/ListBullets';
import { StackIcon } from '@phosphor-icons/react/dist/csr/Stack';
import {
  Button,
  Card,
  DesignSystemScope,
  DottedBackground,
  IconButton,
  Input,
  LabelledSwitch,
  Modal,
  Pill,
  Tab,
  TabList,
  TabPanel,
  TabRoot,
  useToast
} from '../../../design-system-2026/components';
import { ArrowRightIcon, MagnifyingGlassIcon, UsersIcon } from '../../../design-system-2026/icons';
import { useDesignSystemAppearance } from '../../../design-system-2026/components/Theme/Theme';
import { Slider } from '../../../design-system-2026/components/Slider/Slider';
import selectStyles from '../../../design-system-2026/components/Select/Select.module.css';
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
type PresentationView = 'stack' | 'list';

// Ops leads take turns reading: the first N shoutouts are speaker 1's, the next N speaker 2's, …
const defaultPerSpeaker = 20;
const perSpeakerKey = 'idol-admin-shoutouts-per-speaker';
const speakers = [
  { label: 'Speaker 1', className: 'speakerBlue' },
  { label: 'Speaker 2', className: 'speakerGreen' }
] as const;
const speakerFor = (index: number, perSpeaker: number) =>
  speakers[Math.floor(index / perSpeaker) % speakers.length];
const clampPerSpeaker = (value: number) =>
  Number.isFinite(value) ? Math.min(500, Math.max(1, Math.round(value))) : defaultPerSpeaker;

function SpeakerSettings({
  perSpeaker,
  onChange
}: {
  perSpeaker: number;
  onChange: (value: number) => void;
}): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  const [draft, setDraft] = useState(String(perSpeaker));
  const [open, setOpen] = useState(false);
  // Resync only when the value really changed elsewhere, so mid-typing text like "05" survives.
  useEffect(
    () => setDraft((current) => (Number(current) === perSpeaker ? current : String(perSpeaker))),
    [perSpeaker]
  );
  // Apply every in-range value as it's typed or stepped with the arrows; blur/Enter/close tidy up
  // anything left half-typed or out of range.
  const change = (value: string) => {
    setDraft(value);
    const next = Number(value);
    if (value.trim() !== '' && Number.isInteger(next) && next >= 1 && next <= 500) onChange(next);
  };
  const commit = () => {
    const next = clampPerSpeaker(Number(draft));
    setDraft(String(next));
    onChange(next);
  };
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) commit();
        setOpen(next);
      }}
    >
      <Popover.Trigger
        render={
          <Button variant="secondary" icon={<UsersIcon size={16} aria-hidden />}>
            {perSpeaker} per speaker
          </Button>
        }
      />
      <Popover.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
        <Popover.Positioner
          sideOffset={4}
          align="end"
          collisionPadding={8}
          className={selectStyles.selectPositioner}
        >
          <Popover.Popup className={`${selectStyles.selectPopup} ${styles.speakerPopup}`}>
            <Popover.Title className={styles.speakerTitle}>Speaker rotation</Popover.Title>
            <form
              onSubmit={(event) => {
                // Enter saves and closes; focus returns to the trigger.
                event.preventDefault();
                commit();
                setOpen(false);
              }}
            >
              <Input
                id="shoutouts-per-speaker"
                label="Shoutouts per speaker"
                type="number"
                inputMode="numeric"
                min={1}
                max={500}
                value={draft}
                onChange={(event) => change(event.target.value)}
                onBlur={commit}
              />
            </form>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
// Auto scroll speed is a multiplier on reading pace (see readingSeconds).
const defaultAutoScrollSpeed = 1;
const autoScrollSpeedKey = 'idol-admin-shoutouts-auto-scroll-speed';
const minAutoScrollSpeed = 0.25;
const maxAutoScrollSpeed = 3;
const clampAutoScrollSpeed = (value: number) =>
  Number.isFinite(value)
    ? Math.min(maxAutoScrollSpeed, Math.max(minAutoScrollSpeed, Math.round(value * 4) / 4))
    : defaultAutoScrollSpeed;

function AutoScrollControl({
  on,
  onToggle,
  speed,
  onSpeedChange
}: {
  on: boolean;
  onToggle: (on: boolean) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
}): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div ref={anchor} className={styles.autoScroll}>
        <LabelledSwitch label="Auto scroll" checked={on} onCheckedChange={onToggle} />
        {/* The only way to open the speed popup. Always shown, so toggling doesn't resize the
            header and speed can be set up front. */}
        <Popover.Trigger
          aria-label={`Auto scroll speed: ${speed}×`}
          render={
            <Button variant="secondary" className={styles.speedButton}>
              {speed}×
            </Button>
          }
        />
      </div>
      <Popover.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
        <Popover.Positioner
          anchor={anchor}
          sideOffset={4}
          align="end"
          collisionPadding={8}
          className={`${selectStyles.selectPositioner} ${styles.stagePositioner}`}
        >
          <Popover.Popup className={`${selectStyles.selectPopup} ${styles.speakerPopup}`}>
            <Popover.Title className={styles.speakerTitle}>Auto scroll speed</Popover.Title>
            <Slider
              id="shoutouts-auto-scroll-speed"
              label={`Speed: ${speed}×`}
              min={minAutoScrollSpeed}
              max={maxAutoScrollSpeed}
              step={0.25}
              value={speed}
              onChange={(event) => onSpeedChange(clampAutoScrollSpeed(Number(event.target.value)))}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

const timeZone = 'America/New_York';
const dayParts = new Intl.DateTimeFormat('en-US', {
  timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});
const displayDate = new Intl.DateTimeFormat('en-US', {
  timeZone,
  dateStyle: 'long',
  timeStyle: 'short'
});

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
  if (!url)
    return (
      <div role="status">
        <span className={styles.visuallyHidden}>Loading image…</span>
        <div className={`${styles.attachmentSkeleton} idol-skeleton`} aria-hidden />
      </div>
    );
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

/** A thick meter across the top of the presentation: how far through the shoutouts it is. */
function PresentProgress({
  current,
  total,
  children
}: {
  current: number;
  total: number;
  children?: ReactNode;
}): JSX.Element {
  return (
    <div className={styles.progress}>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Presentation progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`${current} of ${total}`}
      >
        <div className={styles.progressFill} style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <span className={styles.progressCount} aria-hidden>
        {current} of {total}
      </span>
      {children}
    </div>
  );
}

function ShoutoutCard({
  item,
  index,
  perSpeaker,
  present,
  onModerate,
  imageCache
}: {
  item: Shoutout;
  index: number;
  perSpeaker: number;
  present: boolean;
  onModerate: (item: Shoutout) => void;
  imageCache: ImageCache;
}): JSX.Element {
  const from = item.isAnon
    ? 'Anonymous'
    : `${item.giver?.firstName ?? ''} ${item.giver?.lastName ?? ''}`.trim() || 'Unknown member';
  const attachment = item.images?.[0] && (
    <Attachment
      key={item.images[0]}
      path={item.images[0]}
      recipient={item.receiver}
      cache={imageCache}
    />
  );

  if (present) {
    return (
      <Card className={styles.card}>
        <article className={styles.cardContent}>
          <header className={styles.cardHeader}>
            <h2>{item.receiver}</h2>
            <span
              className={`${styles.number} ${styles[speakerFor(index, perSpeaker).className]}`}
              title={speakerFor(index, perSpeaker).label}
            >
              {index + 1}
            </span>
          </header>
          <p className={styles.message}>{item.message}</p>
          <p className={styles.meta}>– {from}</p>
          {attachment}
        </article>
      </Card>
    );
  }

  return (
    <Card
      header={
        <time dateTime={new Date(item.timestamp).toISOString()}>
          {displayDate.format(item.timestamp)}
        </time>
      }
      action={
        <div className={styles.cardActions}>
          {item.hidden && <Pill color="red">Hidden</Pill>}
          <IconButton
            variant="tertiary"
            aria-label={`${item.hidden ? 'Unhide' : 'Hide'} shoutout for ${item.receiver}`}
            icon={item.hidden ? <EyeIcon size={16} /> : <EyeSlashIcon size={16} />}
            onClick={() => onModerate(item)}
          />
        </div>
      }
    >
      <dl className={styles.participants}>
        <div>
          <dt>To:</dt>
          <dd>{item.receiver}</dd>
        </div>
        <div>
          <dt>From:</dt>
          <dd>{from}</dd>
        </div>
      </dl>
      <div className={styles.listMessage}>
        <h2>Shoutout</h2>
        <p>{item.message}</p>
      </div>
      {attachment}
    </Card>
  );
}

function ShoutoutListSkeleton(): JSX.Element {
  return (
    <div role="status">
      <span className={styles.visuallyHidden}>Loading shoutouts…</span>
      <div className={styles.list} aria-hidden>
        {[0, 1, 2].map((index) => (
          <Card
            key={index}
            header={<span className={`${styles.skeletonDate} idol-skeleton`} />}
            action={<span className={`${styles.skeletonAction} idol-skeleton`} />}
          >
            <div className={styles.participants}>
              {[0, 1].map((column) => (
                <div key={column} className={styles.skeletonCopy}>
                  <span className={`${styles.skeletonLabel} idol-skeleton`} />
                  <span className={`${styles.skeletonName} idol-skeleton`} />
                </div>
              ))}
            </div>
            <div className={styles.skeletonCopy}>
              <span className={`${styles.skeletonLabel} idol-skeleton`} />
              <span className={`${styles.skeletonMessage} idol-skeleton`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
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
  const [presentationView, setPresentationView] = useState<PresentationView>('list');
  const [perSpeaker, setPerSpeakerState] = useState(defaultPerSpeaker);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(perSpeakerKey);
      if (saved) setPerSpeakerState(clampPerSpeaker(Number(saved)));
    } catch {
      // Storage unavailable: keep the default.
    }
  }, []);
  const setPerSpeaker = (value: number) => {
    setPerSpeakerState(value);
    try {
      window.localStorage.setItem(perSpeakerKey, String(value));
    } catch {
      // Storage unavailable: the choice lasts for this visit.
    }
  };
  const [autoScrollOn, setAutoScrollOn] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeedState] = useState(defaultAutoScrollSpeed);
  // The scroll loop runs outside React renders, so it reads the speed from a ref.
  const autoScrollSpeedRef = useRef(defaultAutoScrollSpeed);
  autoScrollSpeedRef.current = autoScrollSpeed;
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(autoScrollSpeedKey);
      if (saved) setAutoScrollSpeedState(clampAutoScrollSpeed(Number(saved)));
    } catch {
      // Storage unavailable: keep the default.
    }
  }, []);
  const setAutoScrollSpeed = (value: number) => {
    setAutoScrollSpeedState(value);
    try {
      window.localStorage.setItem(autoScrollSpeedKey, String(value));
    } catch {
      // Storage unavailable: the choice lasts for this visit.
    }
  };
  const stagePopup = useRef<HTMLDivElement>(null);
  const stageList = useRef<HTMLOListElement>(null);
  const cardTop = (card: Element) => card.getBoundingClientRect().top;
  const [stackIndex, setStackIndex] = useState(0);
  const stageHeader = useRef<HTMLDivElement>(null);
  const [listIndex, setListIndex] = useState(0);
  // While an arrow-key scroll is under way, the meter shows where it's heading, not where it is.
  const arrowTarget = useRef<number | null>(null);
  const arrowSettle = useRef<number>();
  /** Where the card on top sits: just under the sticky header. */
  const listTop = () => (stageHeader.current?.getBoundingClientRect().bottom ?? 0) + 16;
  // In the list, the current shoutout is the last card that has reached the top, or the last card
  // once the list is scrolled to the end.
  const updateListIndex = () => {
    if (arrowTarget.current !== null) {
      window.clearTimeout(arrowSettle.current);
      arrowSettle.current = window.setTimeout(() => {
        arrowTarget.current = null;
        updateListIndex();
      }, 150);
      return;
    }
    const scroller = stagePopup.current;
    const cards = stageList.current?.children;
    if (!scroller || !cards?.length) return;
    if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
      setListIndex(cards.length - 1);
      return;
    }
    const line = listTop() + 8;
    setListIndex(
      Math.max(
        0,
        Array.from(cards).findLastIndex((card) => cardTop(card) <= line)
      )
    );
  };
  /** Steps the list one card at a time, bringing that card up to the top. */
  const stepList = (offset: number) => {
    const scroller = stagePopup.current;
    const cards = stageList.current?.children;
    if (!scroller || !cards?.length) return;
    const from = arrowTarget.current ?? listIndex;
    const next = Math.min(Math.max(from + offset, 0), cards.length - 1);
    if (next === from) return;
    goToCard(next);
  };
  /** Brings one card up to the top of the list, and points the meter at it. */
  const goToCard = (index: number) => {
    const scroller = stagePopup.current;
    const card = stageList.current?.children[index];
    if (!scroller || !card) return;
    arrowTarget.current = index;
    setListIndex(index);
    scroller.scrollTo({
      top: scroller.scrollTop + cardTop(card) - listTop(),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };

  // Holding an arrow key ('hold') or the Auto scroll switch ('toggle') scrolls the list
  // continuously at reading pace. Lives in refs so the loop survives the re-renders its own
  // scrolling causes.
  const autoScroll = useRef<{
    mode: 'hold' | 'toggle';
    direction: number;
    /** Fractional scroll position; slow speeds move less than a pixel per frame. */
    position: number;
    /** scrollTop as read back after the loop's last write, to tell its scrolling from the user's. */
    written: number;
    /** While the user is scrolling by hand, the loop follows instead of fighting them. */
    pausedUntil: number;
    last: number;
    frame: number;
  }>();
  const stopAutoScroll = () => {
    const auto = autoScroll.current;
    if (!auto) return false;
    cancelAnimationFrame(auto.frame);
    autoScroll.current = undefined;
    return true;
  };
  /**
   * How long the card on top stays in view while auto-scrolling: slightly slower than reading it
   * aloud, plus time to look at any image.
   */
  const readingSeconds = (card: Element) => {
    const words = (card.textContent ?? '').split(/\s+/).filter(Boolean).length;
    return 1.5 + (words / 180) * 60 + card.querySelectorAll('img').length * 2;
  };
  const tickAutoScroll = (now: number) => {
    const auto = autoScroll.current;
    const scroller = stagePopup.current;
    const cards = stageList.current?.children;
    if (!auto || !scroller || !cards?.length) return;
    const elapsed = Math.min(now - auto.last, 50) / 1000;
    auto.last = now;
    // Someone else moved the list (wheel, touch, scrollbar, an arrow-key step): pick up from
    // there, and hold off until they've stopped so momentum scrolling isn't fought or undone.
    if (Math.abs(scroller.scrollTop - auto.written) > 1) auto.pausedUntil = now + 400;
    if (now < auto.pausedUntil) {
      auto.position = scroller.scrollTop;
      auto.written = scroller.scrollTop;
      auto.frame = requestAnimationFrame(tickAutoScroll);
      return;
    }
    // Pace by the card at the top: its height (to the next card) over its reading time.
    const line = listTop() + 8;
    const index = Math.max(
      0,
      Array.from(cards).findLastIndex((card) => cardTop(card) <= line)
    );
    const card = cards[index];
    const span = cards[index + 1]
      ? cardTop(cards[index + 1]) - cardTop(card)
      : (card as HTMLElement).offsetHeight;
    const max = scroller.scrollHeight - scroller.clientHeight;
    // Accumulate fractional pixels: slow speeds move less than a pixel per frame.
    const speed = autoScrollSpeedRef.current;
    auto.position = Math.min(
      Math.max(auto.position + (auto.direction * span * elapsed * speed) / readingSeconds(card), 0),
      max
    );
    scroller.scrollTop = auto.position;
    auto.written = scroller.scrollTop;
    if (auto.position <= 0 || auto.position >= max) {
      const { mode } = auto;
      stopAutoScroll();
      // Reaching the end turns the switch off, so it doesn't look like it's still running.
      if (mode === 'toggle') setAutoScrollOn(false);
      return;
    }
    auto.frame = requestAnimationFrame(tickAutoScroll);
  };
  const startAutoScroll = (direction: number, mode: 'hold' | 'toggle') => {
    const scroller = stagePopup.current;
    if (!scroller) return;
    if (autoScroll.current) {
      // Turning the switch on mid-hold keeps the same loop going forward after release.
      if (mode === 'toggle') Object.assign(autoScroll.current, { mode, direction });
      return;
    }
    // Hand the meter back to the scroll position, which now moves on its own.
    window.clearTimeout(arrowSettle.current);
    arrowTarget.current = null;
    autoScroll.current = {
      mode,
      direction,
      position: scroller.scrollTop,
      written: scroller.scrollTop,
      pausedUntil: 0,
      last: performance.now(),
      frame: requestAnimationFrame(tickAutoScroll)
    };
  };
  /** On release, settle on whichever card is closest to the top. */
  const settleAutoScroll = () => {
    // The switch's scrolling outlives key presses and window blur.
    if (autoScroll.current?.mode !== 'hold' || !stopAutoScroll()) return;
    const cards = Array.from(stageList.current?.children ?? []);
    if (!cards.length) return;
    const top = listTop();
    const distances = cards.map((card) => Math.abs(cardTop(card) - top));
    goToCard(distances.indexOf(Math.min(...distances)));
  };
  useEffect(() => {
    if (!presenting || presentationView !== 'list') return undefined;
    // The portal mounts a frame after opening, so measure once it has laid out.
    const frame = requestAnimationFrame(updateListIndex);
    const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const navigate = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !arrows.includes(event.key) ||
        (event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            event.target.closest('input, textarea, select, [role="tablist"]')))
      )
        return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
      // A tap steps one card; the key repeating means it's held, so scroll until it's let go.
      if (event.repeat) {
        if (autoScroll.current?.mode !== 'toggle') startAutoScroll(direction, 'hold');
      } else stepList(direction);
    };
    const release = (event: KeyboardEvent) => {
      if (arrows.includes(event.key)) settleAutoScroll();
    };
    window.addEventListener('resize', updateListIndex);
    window.addEventListener('keydown', navigate, true);
    window.addEventListener('keyup', release, true);
    window.addEventListener('blur', settleAutoScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateListIndex);
      window.removeEventListener('keydown', navigate, true);
      window.removeEventListener('keyup', release, true);
      window.removeEventListener('blur', settleAutoScroll);
    };
  });
  // Stop any auto-scroll when leaving the list or closing the presentation; the switch starts
  // off again next time.
  useEffect(() => {
    if (!presenting || presentationView !== 'list') setAutoScrollOn(false);
    return () => {
      stopAutoScroll();
    };
  }, [presenting, presentationView]);
  useEffect(() => {
    if (!autoScrollOn || !presenting || presentationView !== 'list') return undefined;
    startAutoScroll(1, 'toggle');
    return () => {
      if (autoScroll.current?.mode === 'toggle') stopAutoScroll();
    };
    // startAutoScroll only reads refs, so a fresh copy each render changes nothing; re-running on
    // it would restart the loop every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScrollOn, presenting, presentationView]);
  useEffect(() => () => window.clearTimeout(arrowSettle.current), []);
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
      perSpeaker={perSpeaker}
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
  else if (loading) results = <ShoutoutListSkeleton />;
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
              <div className={styles.presentActions}>
                <SpeakerSettings perSpeaker={perSpeaker} onChange={setPerSpeaker} />
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
            </div>
          </header>
          <TabRoot value={view} onValueChange={(next) => setView(next as View)}>
            <div className={styles.toolbar}>
              <TabList aria-label="Shoutout visibility" segmented activateOnFocus>
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
          <Dialog.Popup
            ref={stagePopup}
            initialFocus={stagePopup}
            className={styles.presentation}
            onScroll={presentationView === 'list' ? updateListIndex : undefined}
          >
            <DesignSystemScope theme="dark">
              <DottedBackground className={styles.stage}>
                <Dialog.Title className={styles.visuallyHidden}>Present shoutouts</Dialog.Title>
                <TabRoot
                  className={styles.stageTabs}
                  value={presentationView}
                  onValueChange={(next) => setPresentationView(next as PresentationView)}
                >
                  <div ref={stageHeader} className={styles.stageHeader}>
                    {!!visible.length && (
                      <PresentProgress
                        current={
                          Math.min(
                            presentationView === 'list' ? listIndex : stackIndex,
                            visible.length - 1
                          ) + 1
                        }
                        total={visible.length}
                      >
                        {presentationView === 'list' && (
                          <AutoScrollControl
                            on={autoScrollOn}
                            onToggle={setAutoScrollOn}
                            speed={autoScrollSpeed}
                            onSpeedChange={setAutoScrollSpeed}
                          />
                        )}
                      </PresentProgress>
                    )}
                    <div className={styles.stageToolbar}>
                      <Dialog.Close
                        render={
                          <Button
                            className={styles.stageBack}
                            variant="secondary"
                            aria-keyshortcuts="Escape"
                            icon={<ArrowLeftIcon size={16} aria-hidden />}
                          >
                            Back
                          </Button>
                        }
                      />
                      {!!visible.length && (
                        <TabList aria-label="Presentation layout" segmented activateOnFocus>
                          <Tab value="stack" icon={<StackIcon size={16} />}>
                            Stack
                          </Tab>
                          <Tab value="list" icon={<ListBulletsIcon size={16} />}>
                            List
                          </Tab>
                        </TabList>
                      )}
                    </div>
                  </div>
                  {visible.length ? (
                    <>
                      <TabPanel value="stack" className={styles.stagePanel} keepMounted>
                        <ShoutoutStack
                          items={visible}
                          shortcutsDisabled={!presenting || presentationView !== 'stack'}
                          renderCard={(item, index) => renderCard(item, index, true)}
                          onIndexChange={setStackIndex}
                        />
                      </TabPanel>
                      <TabPanel value="list" className={styles.stagePanel}>
                        <DesignSystemScope theme="light">
                          <ol
                            ref={stageList}
                            className={`${styles.list} ${styles.stageList}`}
                            aria-label="Presented shoutouts"
                          >
                            {visible.map((item, index) => (
                              <li key={item.uuid}>{renderCard(item, index, true)}</li>
                            ))}
                          </ol>
                        </DesignSystemScope>
                      </TabPanel>
                    </>
                  ) : (
                    <p className={styles.status}>No visible shoutouts to present.</p>
                  )}
                </TabRoot>
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
