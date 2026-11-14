import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Combobox } from '@base-ui/react/combobox';
import { useHasAdminPermission } from '../../components/Common/FirestoreDataProvider';
import { useUserEmail } from '../../components/Common/UserProvider/UserProvider';
import { useDesignSystemAppearance } from '../../design-system-2026/components/Theme/Theme';
import { ArrowRightIcon, MagnifyingGlassIcon } from '../../design-system-2026/icons';
import { readRecentPages, RecentPage } from './recentPages';
import {
  commonActions,
  normalizeSearch,
  recentSearchPages,
  SearchPage,
  searchPages
} from './searchPages';
import selectStyles from '../../design-system-2026/components/Select/Select.module.css';
import styles from './HomeSearch.module.css';

const mobileQuery = '(max-width: 640px)';
const mobileGutter = 12;

function highlight(text: string, pattern: RegExp | undefined) {
  if (!pattern) return text;
  return text.split(pattern).map((part, index) =>
    index % 2 ? (
      <strong className={styles.match} key={index}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function HomeSearch({
  placement = 'home',
  compact = false,
  keyboardShortcut = true,
  pageKey
}: {
  placement?: 'home' | 'sidebar' | 'header';
  compact?: boolean;
  keyboardShortcut?: boolean;
  pageKey?: string;
}): JSX.Element {
  const router = useRouter();
  const email = useUserEmail();
  const canAdmin = useHasAdminPermission();
  const { theme, accent } = useDesignSystemAppearance();
  const anchor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [modifier, setModifier] = useState('⌘');
  const [narrow, setNarrow] = useState(false);
  const inPanel = placement !== 'home';
  const [collapsedWidth, setCollapsedWidth] = useState(0);
  const [wide, setWide] = useState<{ left: number; right: number; width: number } | null>(null);
  const showSearch = useCallback(() => {
    // The results reveal from the field's resting width so they track the shell as it grows.
    setCollapsedWidth(anchor.current?.offsetWidth ?? 0);
    // On phones the header field opens across the whole top bar (over the avatar), not leftwards.
    const rect = anchor.current?.getBoundingClientRect();
    if (placement === 'header' && rect && window.matchMedia(mobileQuery).matches) {
      setWide({
        left: Math.max(0, rect.left - mobileGutter),
        right: Math.max(0, window.innerWidth - mobileGutter - rect.right),
        width: rect.width
      });
    } else {
      setWide(null);
    }
    setRecentPages(readRecentPages(email));
    setOpen(true);
  }, [email, placement]);

  useEffect(() => {
    setOpen(false);
    setQuery('');
  }, [pageKey]);

  useEffect(() => {
    if (!/Mac|iPhone|iPad/i.test(window.navigator.platform)) setModifier('Ctrl');
    const media = window.matchMedia(mobileQuery);
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // A press outside an open search only dismisses it; it must not also activate whatever is
  // underneath (a shortcut card, a link). Listening on window in the capture phase runs before
  // Base UI's document listeners, so on touch (where Base UI closes on click) we close it here.
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    let swallow = false;
    const inside = (target: EventTarget | null) =>
      target instanceof Node &&
      Boolean(anchor.current?.contains(target) || popup.current?.contains(target));
    const onPointerDown = (event: PointerEvent) => {
      swallow = openRef.current && !inside(event.target);
    };
    const onClick = (event: MouseEvent) => {
      const outside = (swallow || openRef.current) && !inside(event.target);
      swallow = false;
      if (!outside) return;
      event.preventDefault();
      event.stopPropagation();
      if (openRef.current) setOpen(false);
      if (document.activeElement === input.current) input.current?.blur();
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('click', onClick, true);
    };
  }, []);

  useEffect(() => {
    if (!keyboardShortcut) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.shiftKey ||
        (!event.metaKey && !event.ctrlKey) ||
        event.key.toLowerCase() !== 'k'
      )
        return;
      if (
        document.activeElement !== input.current &&
        document.activeElement?.closest('[role="dialog"]')
      )
        return;
      event.preventDefault();
      showSearch();
      input.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [keyboardShortcut, showSearch]);
  const search = normalizeSearch(query);
  const hasQuery = Boolean(query.trim());
  const words = search ? search.split(' ') : [];
  const pattern = words.length
    ? new RegExp(`(${[...words].sort((a, b) => b.length - a.length).join('|')})`, 'gi')
    : undefined;
  const recent = recentSearchPages(recentPages, canAdmin);
  const idleLabel = recent.length ? 'Recent pages' : 'Common actions';
  const idleItems = recent.length ? recent : commonActions;
  const items = hasQuery ? searchPages(query, canAdmin, recent) : idleItems;
  const searchLabel = inPanel ? 'Search pages and actions' : 'Search or find common actions';
  // The full homepage prompt gets cut off on phones.
  const homePlaceholder = narrow ? 'Search or find actions' : searchLabel;
  // Shell lip in px, matching the CSS --search-lip (1px border + 3px padding, like a layered
  // Card). The expanded field grows outward by this much so its contents stay put.
  const lip = 4;
  // Results tuck this far up under the shell's bottom lip (mirrors --search-tuck in the CSS).
  const tuck = inPanel ? 4 : 6;
  const sizeClass = inPanel ? styles.sizePanel : styles.sizeHome;
  const wideVars = wide
    ? ({
        '--grow-left': `${wide.left}px`,
        '--grow-right': `${wide.right}px`,
        '--search-open-width': `${wide.width + wide.left + wide.right - 2 * lip}px`
      } as CSSProperties)
    : undefined;
  const wideAttr = wide ? '' : undefined;
  const field = (
    <label className={styles.panelSearch}>
      <MagnifyingGlassIcon size={inPanel ? 16 : 20} aria-hidden />
      <Combobox.Input
        ref={input}
        id={inPanel ? undefined : 'home-search'}
        className={styles.panelInput}
        aria-label={searchLabel}
        aria-keyshortcuts={keyboardShortcut ? 'Meta+K Control+K' : undefined}
        placeholder={inPanel ? 'Search' : homePlaceholder}
        onFocus={showSearch}
        onKeyDown={(event) => {
          // Esc leaves the search entirely, not just the results list.
          if (event.key !== 'Escape' || event.nativeEvent.isComposing) return;
          setOpen(false);
          event.currentTarget.blur();
        }}
      />
      {/* Both hints stay mounted so they can cross-fade when the search opens or closes. */}
      <span className={styles.keyHints} data-open={open || undefined} aria-hidden="true">
        <span className={styles.shortcut}>
          <kbd>{modifier}</kbd>
          <kbd>K</kbd>
        </span>
        <kbd className={styles.key}>Esc</kbd>
      </span>
    </label>
  );
  return (
    <Combobox.Root<SearchPage>
      items={items}
      value={null}
      inputValue={query}
      onInputValueChange={(value, details) => {
        setQuery(value);
        if (details.reason === 'input-change') setOpen(true);
      }}
      open={open}
      onOpenChange={setOpen}
      autoHighlight={hasQuery}
      itemToStringLabel={(item) => item.label}
      filter={null}
      onValueChange={(item) => {
        if (!item) return;
        setOpen(false);
        setQuery('');
        router.push(item.href);
      }}
    >
      <div
        ref={anchor}
        className={`${styles.fieldSlot} ${sizeClass}`}
        data-search-surface={placement}
        data-wide={wideAttr}
        style={wideVars}
      >
        <div
          className={styles.morph}
          data-search-surface={placement}
          data-compact={inPanel && compact ? '' : undefined}
          data-expanded={open ? '' : undefined}
          data-wide={wideAttr}
        >
          {field}
        </div>
      </div>
      <Combobox.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
        <Combobox.Positioner
          anchor={anchor}
          align={placement === 'header' ? 'end' : 'start'}
          sideOffset={lip - tuck}
          // The results are one surface with the field, so they always open below it, even when
          // the on-screen keyboard leaves more room above.
          collisionAvoidance={{ side: 'none' }}
          alignOffset={wide ? -wide.right : -lip}
          // The lip pushes the shell to within 5px of the viewport in the sidebar; the default
          // collision padding would then nudge the results 1px off the field above them.
          collisionPadding={{ top: 5, bottom: 5, left: 0, right: 0 }}
          className={`${selectStyles.selectPositioner} ${styles.positioner} ${sizeClass}`}
          data-search-surface={placement}
          data-wide={wideAttr}
          style={{ '--collapsed-width': `${collapsedWidth}px`, ...wideVars } as CSSProperties}
        >
          <Combobox.Popup
            ref={popup}
            className={`${styles.panel} ${sizeClass}`}
            data-search-surface={placement}
            data-wide={wideAttr}
            style={wideVars}
          >
            <div className={styles.panelResults}>
              {!hasQuery && <div className={styles.groupLabel}>{idleLabel}</div>}
              <Combobox.Empty className={styles.empty}>
                No matching actions. Try a different search.
              </Combobox.Empty>
              <Combobox.List aria-label={hasQuery ? 'Matching actions' : idleLabel}>
                {(item: SearchPage) => (
                  <Combobox.Item
                    key={item.href}
                    value={item}
                    aria-label={item.label}
                    className={`${selectStyles.selectOption} ${styles.option}`}
                  >
                    <span className={styles.icon}>
                      <item.icon size={16} aria-hidden />
                    </span>
                    <span className={styles.label}>{highlight(item.label, pattern)}</span>
                    <ArrowRightIcon size={16} aria-hidden />
                  </Combobox.Item>
                )}
              </Combobox.List>
            </div>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
