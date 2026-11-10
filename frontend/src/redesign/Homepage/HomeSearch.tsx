import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Combobox } from '@base-ui/react/combobox';
import { useHasAdminPermission } from '../../components/Common/FirestoreDataProvider';
import { useUserEmail } from '../../components/Common/UserProvider/UserProvider';
import { Input } from '../../design-system-2026/components/Input/Input';
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
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [modifier, setModifier] = useState('⌘');
  const inPanel = placement !== 'home';
  const showSearch = useCallback(() => {
    setRecentPages(readRecentPages(email));
    setOpen(true);
  }, [email]);

  useEffect(() => {
    setOpen(false);
    setQuery('');
  }, [pageKey]);

  useEffect(() => {
    if (!/Mac|iPhone|iPad/i.test(window.navigator.platform)) setModifier('Ctrl');
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
  const items = hasQuery
    ? searchPages(query, canAdmin, recent)
    : recent.length
    ? recent
    : commonActions;
  const shortcut = (
    <span className={styles.shortcut} aria-hidden="true">
      <kbd>{modifier}</kbd>
      <kbd>K</kbd>
    </span>
  );
  const searchLabel = inPanel ? 'Search pages and actions' : 'Search or find common actions';
  const field = inPanel ? (
    <label className={styles.panelSearch}>
      <MagnifyingGlassIcon size={16} aria-hidden />
      <Combobox.Input
        ref={input}
        className={styles.panelInput}
        aria-label={searchLabel}
        aria-keyshortcuts={keyboardShortcut ? 'Meta+K Control+K' : undefined}
        placeholder="Search"
        onFocus={showSearch}
      />
      {open ? (
        <kbd aria-hidden="true" className={styles.key}>
          Esc
        </kbd>
      ) : (
        shortcut
      )}
    </label>
  ) : (
    <Combobox.Input
      ref={input}
      onFocus={showSearch}
      render={
        <Input
          id="home-search"
          aria-label={searchLabel}
          aria-keyshortcuts="Meta+K Control+K"
          size="large"
          shape="pill"
          placeholder={searchLabel}
          icon={<MagnifyingGlassIcon size={20} aria-hidden />}
          endAdornment={shortcut}
        />
      }
    />
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
      <div className={inPanel ? styles.fieldSlot : undefined}>
        <div
          ref={anchor}
          className={inPanel ? styles.morph : styles.anchor}
          data-search-surface={inPanel ? placement : undefined}
          data-compact={inPanel && compact ? '' : undefined}
          data-expanded={inPanel && open ? '' : undefined}
        >
          {field}
        </div>
      </div>
      <Combobox.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
        <Combobox.Positioner
          anchor={anchor}
          align={placement === 'header' ? 'end' : 'start'}
          sideOffset={inPanel ? -1 : 8}
          className={selectStyles.selectPositioner}
        >
          <Combobox.Popup
            className={`${selectStyles.selectPopup} ${styles.popup} ${inPanel ? styles.panel : ''}`}
          >
            <div className={inPanel ? styles.panelResults : undefined}>
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
