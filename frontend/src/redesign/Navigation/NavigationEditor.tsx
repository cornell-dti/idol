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
  remove: boolean;
  moved: boolean;
};

export default function NavigationEditor({
  items,
  selected,
  onSave,
  onCancel,
  actionsSlot
}: {
  items: SidebarEntry[];
  selected: string[];
  onSave: (ids: string[]) => void;
  onCancel: () => void;
  /** Where Cancel/Save render (the sheet header's top-right); inline when absent. */
  actionsSlot?: HTMLElement | null;
}): JSX.Element {
  const [draft, setDraft] = useState(selected);
  const [announcement, setAnnouncement] = useState('');
  const grid = useRef<HTMLDivElement>(null);
  const navbar = useRef<HTMLDivElement>(null);
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
  const label = (id: string) => items.find((item) => item.id === id)?.label;
  const remove = (id: string) => {
    setDraft(draft.filter((item) => item !== id));
    setAnnouncement(`${label(id)} removed from navbar.`);
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
    const moved =
      current.moved ||
      Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 6;
    updateDrag({
      ...current,
      x: event.clientX,
      y: event.clientY,
      slot,
      moved,
      remove: current.origin === 'navbar' && contains(grid.current)
    });
  };
  const finish = () => {
    const { current } = dragRef;
    suppressClick.current = Boolean(current?.moved);
    if (current?.moved) {
      if (current.remove) remove(current.id);
      else if (current.slot !== null) {
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
        onClick={() => onSave(draft)}
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
        Drag a page into the navbar or drag it back into this grid to remove it. You can also tap to
        add, use the remove buttons, and use left and right arrow keys to reorder. Home and More
        stay fixed. Choose two or three pages.
      </p>
      <div
        ref={grid}
        className={`${styles.pageGrid} ${styles.editGrid} ${
          drag?.remove ? styles.removeTarget : ''
        }`}
        role="group"
        aria-label="Available pages"
      >
        {items
          .filter((item) => !draft.includes(item.id))
          .map((item) => (
            <button
              type="button"
              key={item.id}
              className={`${styles.page} ${styles.draggablePage} ${
                drag?.id === item.id ? styles.grabbedItem : ''
              }`}
              aria-label={`Add ${item.label}`}
              aria-describedby="navbar-reorder-help"
              {...handlers(item.id, 'grid')}
              onClick={() => {
                if (!suppressClick.current) add(item.id);
                suppressClick.current = false;
              }}
            >
              <span className={styles.pageIcon} aria-hidden>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
      </div>
      <p className={styles.srOnly} role="status">
        {announcement}
      </p>
      <div className={styles.previewBar}>
        <div ref={navbar} className={styles.navbar} role="group" aria-label="Navbar preview">
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
                  {...handlers(id, 'navbar')}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                      event.preventDefault();
                      move(id, index + (event.key === 'ArrowLeft' ? -1 : 1));
                    }
                    if (event.key === 'Delete' || event.key === 'Backspace') {
                      event.preventDefault();
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
                  onClick={() => remove(id)}
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
      </div>
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
