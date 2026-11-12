import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Dialog } from '@base-ui/react/dialog';
import { Button, useToast } from '../../design-system-2026/components';
import { useDesignSystemAppearance } from '../../design-system-2026/components/Theme/Theme';
import type { SidebarEntry } from '../../design-system-2026/components/Sidebar/Sidebar';
import { PencilSimpleLineIcon, DotsThreeIcon } from '../../design-system-2026/icons';
import NavigationEditor from './NavigationEditor';
import { defaultNavigation, parseNavigation, compactNavigationLabel } from './preferences';
import useSheetDrag from './useSheetDrag';
import styles from './Navigation.module.css';

/** Receives only permitted routes. A separate storage key isolates each member's preferences. */
export default function Navigation({
  items,
  storageKey,
  pageKey
}: {
  items: SidebarEntry[];
  storageKey?: string;
  pageKey: string;
}): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  const [selected, setSelected] = useState(defaultNavigation);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const toast = useToast();
  const [notice, setNotice] = useState('');
  // The sheet opens above the bottom bar, so the real navbar stays visible underneath it.
  const bar = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);
  // Stays true through the close animation, so the bar stays above the sliding sheet.
  const [sheetVisible, setSheetVisible] = useState(false);
  const [headerSlot, setHeaderSlot] = useState<HTMLDivElement | null>(null);
  const [navbarSlot, setNavbarSlot] = useState<HTMLDivElement | null>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLElement>(null);
  const sheetDrag = useSheetDrag({ sheet, backdrop, onClose: () => setOpen(false) });
  // Only a grid that actually overflows gets native touch scrolling; otherwise dragging anywhere,
  // links included, pulls the sheet.
  const [gridScrolls, setGridScrolls] = useState(false);
  useEffect(() => {
    const element = grid.current;
    if (!open || !element) return undefined;
    const measure = () => setGridScrolls(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [open, editing]);
  useEffect(() => {
    const element = bar.current;
    if (!element) return undefined;
    const measure = () => setBarHeight(element.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const available = items.filter((item) => item.id !== '/');
  const allowed = available.map((item) => item.id);
  // Reconcile late-loading permissions without overwriting stored selections.
  const pinned = parseNavigation(JSON.stringify(selected), allowed);
  useEffect(() => {
    try {
      const stored: unknown = storageKey
        ? JSON.parse(localStorage.getItem(storageKey) ?? 'null')
        : null;
      setSelected(
        Array.isArray(stored)
          ? stored.filter((id): id is string => typeof id === 'string')
          : defaultNavigation
      );
    } catch {
      setSelected(defaultNavigation);
    }
    setReady(true);
  }, [storageKey]);
  useEffect(() => {
    setOpen(false);
  }, [pageKey]);
  const home = items.find((item) => item.id === '/');
  const links = [home, ...pinned.map((id) => items.find((item) => item.id === id))].filter(
    (item): item is SidebarEntry => Boolean(item)
  );
  const moreItems = available.filter((item) => !pinned.includes(item.id));
  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      setSheetVisible(true);
      sheetDrag.reset();
      setEditing(false);
      setNotice('');
    }
  };
  return (
    <Dialog.Root
      open={open}
      // Non-modal pointer-wise so the navbar below stays usable; focus is still trapped.
      modal="trap-focus"
      onOpenChange={(next, details) => {
        // Presses on the bottom bar are handled by the bar itself (More toggles, links navigate).
        const target = details?.event?.target;
        if (!next && target instanceof Node && bar.current?.contains(target)) return;
        changeOpen(next);
      }}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setSheetVisible(false);
      }}
    >
      <div ref={bar} className={styles.bar} data-sheet={sheetVisible || open || undefined}>
        {/* While editing, the editor renders its draggable navbar here, on the real bar. */}
        <div ref={setNavbarSlot} className={styles.navbarSlot} />
        <nav className={styles.navbar} aria-label="Main navigation" hidden={editing}>
          {links.map((item) => (
            <Link href={item.href ?? item.id} key={item.id}>
              <a
                href={item.href ?? item.id}
                aria-label={item.label}
                aria-current={item.selected ? 'page' : undefined}
                className={styles.navItem}
              >
                <span className={styles.navIcon} aria-hidden>
                  {item.icon}
                </span>
                <span>{compactNavigationLabel(item.id, item.label)}</span>
              </a>
            </Link>
          ))}
          <button
            type="button"
            className={styles.navItem}
            aria-haspopup="dialog"
            aria-expanded={open}
            data-open={open || undefined}
            data-selected={moreItems.some((item) => item.selected) || undefined}
            onClick={() => changeOpen(!open)}
          >
            <span className={styles.navIcon}>
              <DotsThreeIcon size={24} aria-hidden />
            </span>
            <span>More</span>
          </button>
        </nav>
      </div>
      <Dialog.Portal>
        <Dialog.Backdrop ref={backdrop} className={styles.overlay} style={{ bottom: barHeight }} />
        <Dialog.Popup
          ref={sheet}
          className={styles.drawer}
          style={{ bottom: barHeight, maxHeight: `calc(90dvh - ${barHeight}px)` }}
          data-idol-redesign
          data-idol-theme={theme}
          data-idol-accent={accent}
          onPointerDown={sheetDrag.onPointerDown}
          onPointerMove={sheetDrag.onPointerMove}
          onPointerUp={sheetDrag.onPointerUp}
          onPointerCancel={sheetDrag.onPointerCancel}
          onClickCapture={sheetDrag.onClickCapture}
        >
          <div className={styles.handle} aria-hidden />
          <div className={styles.drawerHeading}>
            <div>
              <Dialog.Title className={styles.title}>
                {editing ? 'Edit navbar' : 'Explore IDOL'}
              </Dialog.Title>
            </div>
            {/* Edit navbar, or the editor's Cancel/Save while editing, sit in the top-right. */}
            <div ref={setHeaderSlot} className={styles.headerSlot} />
            {!editing && (
              <Button
                variant="secondary"
                disabled={!ready}
                icon={<PencilSimpleLineIcon size={16} />}
                onClick={() => setEditing(true)}
              >
                Edit navbar
              </Button>
            )}
          </div>
          {editing ? (
            <NavigationEditor
              items={available}
              selected={pinned}
              onCancel={() => setEditing(false)}
              actionsSlot={headerSlot}
              navbarSlot={navbarSlot}
              onSave={(next) => {
                setSelected(next);
                setEditing(false);
                try {
                  if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
                  setNotice('');
                  setOpen(false);
                  toast.add({ title: 'Navbar saved.' });
                } catch {
                  setNotice('Navbar updated for this session. Browser storage is unavailable.');
                }
              }}
            />
          ) : (
            <>
              <nav
                ref={grid}
                className={styles.pageGrid}
                aria-label="More pages"
                data-scrolls={gridScrolls || undefined}
              >
                {moreItems.map((item) => (
                  <Link href={item.href ?? item.id} key={item.id}>
                    <a
                      href={item.href ?? item.id}
                      className={styles.page}
                      draggable={false}
                      aria-current={item.selected ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span className={styles.pageIcon} aria-hidden>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </Link>
                ))}
              </nav>
              {notice && (
                <p className={styles.description} role="status">
                  {notice}
                </p>
              )}
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
