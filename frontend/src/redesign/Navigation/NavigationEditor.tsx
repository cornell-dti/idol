import { PointerEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, DesignSystemScope } from '../../design-system-2026/components';
import type { SidebarEntry } from '../../design-system-2026/components/Sidebar/Sidebar';
import { CheckIcon, HouseIcon, XIcon, DotsThreeIcon } from '../../design-system-2026/icons';
import { compactNavigationLabel, maxPinnedPages } from './preferences';
import styles from './Navigation.module.css';

type Drag = {
  id: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  origin: 'grid' | 'navbar';
  slot: number | null;
  /** Where the page would land in the drawer grid, as an index into its visible pages. */
  gridSlot: number | null;
  /** The pointer is at the end of a row, so the marker shows after the previous page. */
  gridRowEnd: boolean;
  remove: boolean;
  moved: boolean;
};

export default function NavigationEditor({
  items,
  selected,
  order: initialOrder,
  onSave,
  onCancel,
  onDraftChange,
  actionsSlot,
  navbarSlot
}: {
  items: SidebarEntry[];
  selected: string[];
  /** Every page's id in drawer order; pages in the navbar are skipped when the drawer renders. */
  order: string[];
  onSave: (ids: string[], order: string[]) => void;
  onCancel: () => void;
  /** Reports every draft change, so closing the sheet mid-edit can save it. */
  onDraftChange?: (ids: string[], order: string[]) => void;
  /** Where Cancel/Save render (the sheet header's top-right); inline when absent. */
  actionsSlot?: HTMLElement | null;
  /** The real bottom bar: editing happens on it directly instead of on a preview copy. */
  navbarSlot?: HTMLElement | null;
}): JSX.Element {
  const [draft, setDraft] = useState(selected);
  const [order, setOrder] = useState(initialOrder);
  useEffect(() => {
    onDraftChange?.(draft, order);
  }, [draft, order, onDraftChange]);
  const gridPages = order
    .filter((id) => !draft.includes(id))
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is SidebarEntry => Boolean(item));
  const [announcement, setAnnouncement] = useState('');
  const grid = useRef<HTMLDivElement>(null);
  const navbar = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number>();
  useEffect(() => {
    const element = grid.current;
    if (!element) return undefined;
    // +8 for the wrapper's 4px padding on each side (border-box).
    const observer = new ResizeObserver(() => setGridHeight(element.offsetHeight + 8));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const cancel = useRef<HTMLElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const updateDrag = (next: Drag | null) => {
    dragRef.current = next;
    setDrag(next);
  };
  useEffect(() => {
    cancel.current?.focus();
  }, []);
  // Removing a page with the keyboard deletes the focused button; land on its neighbour instead.
  const focusPinnedAfterRemove = useRef<number | null>(null);
  useEffect(() => {
    const index = focusPinnedAfterRemove.current;
    if (index === null) return;
    focusPinnedAfterRemove.current = null;
    const handles = navbar.current?.querySelectorAll<HTMLElement>('[data-reorder-handle]');
    const target = handles?.length ? handles[Math.min(index, handles.length - 1)] : cancel.current;
    target?.focus();
  }, [draft]);
  const label = (id: string) => items.find((item) => item.id === id)?.label;
  /** Moves `id` to just before `before` in the drawer order (to the end when null). */
  const place = (id: string, before: string | null) => {
    if (before === id) return;
    const next = order.filter((item) => item !== id);
    next.splice(before === null ? next.length : next.indexOf(before), 0, id);
    setOrder(next);
  };
  const remove = (id: string, before?: string | null) => {
    setDraft(draft.filter((item) => item !== id));
    if (before !== undefined) place(id, before);
    setAnnouncement(`${label(id)} removed from navbar.`);
  };
  /** Moves a drawer page to `target`, an index into the drawer's visible pages. */
  const moveInGrid = (id: string, target: number) => {
    const visible = gridPages.map((item) => item.id);
    const from = visible.indexOf(id);
    if (from < 0 || target < 0 || target >= visible.length || target === from) return;
    // Land on `target`: before the page there when moving back, after it when moving forward.
    place(id, target < from ? visible[target] : visible[target + 1] ?? null);
    setAnnouncement(`${label(id)} moved to position ${target + 1} in the drawer.`);
  };
  const add = (id: string, slot = draft.length) => {
    if (draft.length >= maxPinnedPages) {
      setAnnouncement('Remove a page from the navbar to add another.');
      return;
    }
    const next = [...draft];
    next.splice(slot, 0, id);
    setDraft(next);
    setAnnouncement(`${label(id)} added to navbar.`);
  };
  const move = (id: string, target: number) => {
    if (target < 0 || target >= draft.length) return;
    const next = draft.filter((item) => item !== id);
    next.splice(target, 0, id);
    setDraft(next);
    setAnnouncement(`${label(id)} moved to navbar position ${target + 2}.`);
  };
  const start = (event: PointerEvent<HTMLButtonElement>, id: string, origin: Drag['origin']) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    suppressClick.current = false;
    updateDrag({
      id,
      origin,
      x: event.clientX,
      y: event.clientY,
      startX: event.clientX,
      startY: event.clientY,
      slot: null,
      gridSlot: null,
      gridRowEnd: false,
      remove: false,
      moved: false
    });
  };
  const track = (event: PointerEvent<HTMLButtonElement>) => {
    const { current } = dragRef;
    if (!current || !navbar.current || !grid.current) return;
    const contains = (element: HTMLElement, padding = 0) => {
      const rect = element.getBoundingClientRect();
      return (
        event.clientX >= rect.left - padding &&
        event.clientX <= rect.right + padding &&
        event.clientY >= rect.top - padding &&
        event.clientY <= rect.bottom + padding
      );
    };
    let slot: number | null = null;
    if (
      contains(navbar.current, 8) &&
      (current.origin === 'navbar' || draft.length < maxPinnedPages)
    ) {
      const next = Array.from(navbar.current.querySelectorAll('[data-pinned-item]')).findIndex(
        (item) => {
          const rect = item.getBoundingClientRect();
          return event.clientX < rect.left + rect.width / 2;
        }
      );
      slot = next < 0 ? draft.length : next;
    }
    let gridSlot: number | null = null;
    let gridRowEnd = false;
    if (slot === null && contains(grid.current, 8)) {
      // Reading order: the first page the pointer sits before (an earlier row, or left of its
      // centre in the same row) is where the dragged page lands.
      const next = Array.from(grid.current.querySelectorAll('[data-grid-item]')).findIndex(
        (item) => {
          const rect = item.getBoundingClientRect();
          return (
            event.clientY < rect.top ||
            (event.clientY <= rect.bottom && event.clientX < rect.left + rect.width / 2)
          );
        }
      );
      gridSlot = next < 0 ? gridPages.length : next;
      const landing = grid.current.querySelectorAll('[data-grid-item]')[gridSlot];
      gridRowEnd =
        gridSlot > 0 && (!landing || event.clientY < landing.getBoundingClientRect().top);
    }
    const moved =
      current.moved ||
      Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 6;
    updateDrag({
      ...current,
      x: event.clientX,
      y: event.clientY,
      slot,
      gridSlot,
      gridRowEnd,
      moved,
      remove: current.origin === 'navbar' && gridSlot !== null
    });
  };
  const finish = () => {
    const { current } = dragRef;
    suppressClick.current = Boolean(current?.moved);
    if (current?.moved) {
      const before = current.gridSlot === null ? null : gridPages[current.gridSlot]?.id ?? null;
      if (current.remove) remove(current.id, before);
      else if (current.origin === 'grid' && current.gridSlot !== null) {
        if (before !== current.id) {
          place(current.id, before);
          const visible = gridPages.filter((item) => item.id !== current.id);
          const index =
            before === null ? visible.length : visible.findIndex((item) => item.id === before);
          setAnnouncement(`${label(current.id)} moved to position ${index + 1} in the drawer.`);
        }
      } else if (current.slot !== null) {
        if (current.origin === 'grid') add(current.id, current.slot);
        else
          move(
            current.id,
            current.slot > draft.indexOf(current.id) ? current.slot - 1 : current.slot
          );
      } else if (current.origin === 'grid' && draft.length >= maxPinnedPages)
        setAnnouncement('Remove a page from the navbar to add another.');
    }
    updateDrag(null);
  };
  const handlers = (id: string, origin: Drag['origin']) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => start(event, id, origin),
    onPointerMove: track,
    onPointerUp: finish,
    onPointerCancel: () => updateDrag(null),
    onLostPointerCapture: () => updateDrag(null)
  });
  const grabbed = items.find((item) => item.id === drag?.id);
  const navbarEditor = (
    <div ref={navbar} className={styles.navbar} role="group" aria-label="Navbar" data-vaul-no-drag>
      <div className={`${styles.navItem} ${styles.fixedItem}`} aria-label="Home, fixed">
        <HouseIcon size={24} aria-hidden />
        <span>Home</span>
      </div>
      {draft.map((id, index) => {
        const item = items.find((candidate) => candidate.id === id);
        if (!item) return null;
        return (
          <div
            key={id}
            data-pinned-item
            className={`${styles.previewItem} ${drag?.id === id ? styles.grabbedItem : ''} ${
              drag?.slot === index ? styles.insertBefore : ''
            }`}
          >
            <button
              type="button"
              className={`${styles.navItem} ${styles.draggablePage}`}
              aria-label={`Reorder ${item.label}`}
              aria-describedby="navbar-reorder-help"
              data-reorder-handle
              {...handlers(id, 'navbar')}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                  event.preventDefault();
                  move(id, index + (event.key === 'ArrowLeft' ? -1 : 1));
                }
                if (event.key === 'Delete' || event.key === 'Backspace') {
                  event.preventDefault();
                  focusPinnedAfterRemove.current = index;
                  remove(id);
                }
                if (event.key === 'Escape' && dragRef.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  updateDrag(null);
                }
              }}
            >
              <span className={styles.navIcon} aria-hidden>
                {item.icon}
              </span>
              <span>{compactNavigationLabel(item.id, item.label)}</span>
            </button>
            <button
              type="button"
              className={styles.removePage}
              aria-label={`Remove ${item.label}`}
              onClick={(event) => {
                // Only a keyboard press (detail 0) needs focus moved; taps shouldn't show a ring.
                if (event.detail === 0) focusPinnedAfterRemove.current = index;
                remove(id);
              }}
            >
              <XIcon size={12} aria-hidden />
            </button>
          </div>
        );
      })}
      <div
        className={`${styles.navItem} ${styles.fixedItem} ${
          drag?.slot === draft.length ? styles.insertBefore : ''
        }`}
        aria-label="More, fixed"
      >
        <DotsThreeIcon size={24} aria-hidden />
        <span>More</span>
      </div>
    </div>
  );
  let statusMessage = '';
  if (draft.length < 2) statusMessage = 'Choose at least two pages to save.';
  else if (announcement.startsWith('Remove a page')) statusMessage = announcement;
  const actions = (
    <div className={`${styles.editActions} ${actionsSlot ? styles.headerActions : ''}`}>
      <Button ref={cancel} variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        disabled={draft.length < 2 || draft.length > maxPinnedPages}
        icon={<CheckIcon size={16} />}
        onClick={() => onSave(draft, order)}
      >
        Save
      </Button>
    </div>
  );
  return (
    <div data-vaul-no-drag className={styles.editor}>
      {actionsSlot ? createPortal(actions, actionsSlot) : actions}
      {/* Always rendered (a blank line when quiet) so a message never changes the sheet's height. */}
      <p className={styles.editStatus} aria-hidden>
        {statusMessage || '\u00a0'}
      </p>
      <p id="navbar-reorder-help" className={styles.srOnly}>
        Drag a page into the navbar or drag it back into this grid to remove it, and drag pages
        within this grid to reorder the drawer. You can also tap to add, use the remove buttons, and
        use left and right arrow keys to reorder. Home and More stay fixed. Choose two or three
        pages.
      </p>
      {/* Animates to the grid's height, so the sheet slides when a row empties or fills. */}
      <div className={styles.gridWrap} style={{ height: gridHeight }}>
        <div
          ref={grid}
          className={`${styles.pageGrid} ${styles.editGrid} ${
            drag?.remove ? styles.removeTarget : ''
          }`}
          role="group"
          aria-label="Available pages"
        >
          {gridPages.map((item, index) => {
            const marker = (() => {
              if (!drag?.moved || drag.gridSlot === null) return '';
              // Dropping a drawer page next to itself changes nothing, so don't mark it.
              const own = gridPages.findIndex((page) => page.id === drag.id);
              if (own >= 0 && (drag.gridSlot === own || drag.gridSlot === own + 1)) return '';
              if (drag.gridRowEnd) return drag.gridSlot === index + 1 ? styles.insertAfter : '';
              return drag.gridSlot === index ? styles.insertBefore : '';
            })();
            return (
              <button
                type="button"
                key={item.id}
                data-grid-item
                className={`${styles.page} ${styles.draggablePage} ${
                  drag?.id === item.id ? styles.grabbedItem : ''
                } ${marker}`}
                aria-label={`Add ${item.label}`}
                aria-describedby="navbar-reorder-help"
                {...handlers(item.id, 'grid')}
                onClick={() => {
                  if (!suppressClick.current) add(item.id);
                  suppressClick.current = false;
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    moveInGrid(item.id, index + (event.key === 'ArrowLeft' ? -1 : 1));
                  }
                  if (event.key === 'Escape' && dragRef.current) {
                    event.preventDefault();
                    event.stopPropagation();
                    updateDrag(null);
                  }
                }}
              >
                <span className={styles.pageIcon} aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className={styles.srOnly} role="status">
        {announcement}
      </p>
      {navbarSlot ? (
        createPortal(navbarEditor, navbarSlot)
      ) : (
        <div className={styles.previewBar}>{navbarEditor}</div>
      )}
      {drag &&
        grabbed &&
        createPortal(
          <DesignSystemScope className={styles.dragPortal}>
            <div
              aria-hidden
              className={`${styles.page} ${styles.dragPreview}`}
              style={{ left: drag.x - 48, top: drag.y - 36 }}
            >
              <span className={styles.pageIcon}>{grabbed.icon}</span>
              <span>{grabbed.label}</span>
            </div>
          </DesignSystemScope>,
          document.body
        )}
    </div>
  );
}
