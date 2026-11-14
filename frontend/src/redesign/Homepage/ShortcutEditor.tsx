import { PointerEvent, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SquaresFourIcon } from '@phosphor-icons/react/dist/csr/SquaresFour';
import { Button, DesignSystemScope, IconButton, Modal } from '../../design-system-2026/components';
import {
  CheckIcon,
  PlusIcon,
  TrashIcon,
  DotsSixVerticalIcon
} from '../../design-system-2026/icons';
import { defaultShortcuts, dropShortcut, moveShortcut, ShortcutId, shortcuts } from './shortcuts';
import styles from './Homepage.module.css';

type DropTarget = { section: 'added'; slot: number } | { section: 'removed' };

type Drag = {
  id: ShortcutId;
  pointerId: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  target: DropTarget | null;
};

function containsPoint(section: HTMLElement | null, x: number, y: number) {
  if (!section) return false;
  const { left, right, top, bottom } = section.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
}

export default function ShortcutEditor({
  selected,
  onSave,
  disabled
}: {
  selected: ShortcutId[];
  onSave: (items: ShortcutId[]) => void;
  disabled: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(selected);
  const [announcement, setAnnouncement] = useState('');
  const list = useRef<HTMLUListElement>(null);
  const addedSection = useRef<HTMLElement>(null);
  const removedSection = useRef<HTMLElement>(null);
  const dragging = useRef<Drag | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const updateDrag = (next: Drag | null) => {
    dragging.current = next;
    setDrag(next);
  };
  const changeOpen = (next: boolean) => {
    if (next) {
      setDraft(selected);
      setAnnouncement('');
    }
    updateDrag(null);
    setOpen(next);
  };
  // The whole row drags, except its trailing Add/Remove button.
  const startDrag = (event: PointerEvent<HTMLLIElement>, id: ShortcutId) => {
    if (event.button !== 0 || dragging.current) return;
    const target = event.target as Element;
    if (target.closest('button:not([data-drag-handle])')) return;
    const row = event.currentTarget;
    event.preventDefault();
    row.querySelector<HTMLButtonElement>('[data-drag-handle]')?.focus();
    row.setPointerCapture(event.pointerId);
    const rect = row.getBoundingClientRect();
    updateDrag({
      id,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      target: null
    });
  };
  const dropTargetAt = (id: ShortcutId, x: number, y: number): DropTarget | null => {
    if (list.current && containsPoint(addedSection.current, x, y)) {
      // Tiles flow in rows, so the slot is the first tile below the pointer's row, or in its row
      // and right of the pointer.
      const rows = Array.from(list.current.children);
      const next = rows.findIndex((row) => {
        const rect = row.getBoundingClientRect();
        return y < rect.top || (y <= rect.bottom && x < rect.left + rect.width / 2);
      });
      return { section: 'added', slot: next < 0 ? rows.length : next };
    }
    if (draft.includes(id) && containsPoint(removedSection.current, x, y))
      return { section: 'removed' };
    return null;
  };
  const trackDrag = (event: PointerEvent<HTMLLIElement>) => {
    const { current } = dragging;
    if (current?.pointerId !== event.pointerId) return;
    const { clientX: x, clientY: y } = event;
    updateDrag({ ...current, x, y, target: dropTargetAt(current.id, x, y) });
  };
  const finishDrag = (event: PointerEvent<HTMLLIElement>) => {
    const { current } = dragging;
    if (current?.pointerId !== event.pointerId) return;
    const { id } = current;
    const target = dropTargetAt(id, event.clientX, event.clientY);
    const label = shortcuts.find((item) => item.id === id)?.label;
    if (target?.section === 'removed') {
      setDraft((items) => items.filter((item) => item !== id));
      setAnnouncement(`${label} removed.`);
    } else if (target?.section === 'added') {
      const next = dropShortcut(draft, id, target.slot);
      setDraft(next);
      const action = draft.includes(id) ? 'moved' : 'added';
      setAnnouncement(`${label} ${action} at position ${next.indexOf(id) + 1}.`);
    }
    updateDrag(null);
  };
  const grabbed = shortcuts.find((item) => item.id === drag?.id);
  const addedSlot = drag?.target?.section === 'added' ? drag.target.slot : null;
  const move = (id: ShortcutId, target: number) => {
    setDraft((items) => moveShortcut(items, id, target));
    if (target >= 0 && target < draft.length)
      setAnnouncement(
        `${shortcuts.find((item) => item.id === id)?.label} moved to position ${target + 1}.`
      );
  };
  const cancelDrag = (event: PointerEvent<HTMLLIElement>) => {
    if (dragging.current?.pointerId === event.pointerId) updateDrag(null);
  };
  const dragRowProps = (id: ShortcutId) => ({
    onPointerDown: (event: PointerEvent<HTMLLIElement>) => startDrag(event, id),
    onPointerMove: trackDrag,
    onPointerUp: finishDrag,
    onPointerCancel: cancelDrag,
    onLostPointerCapture: cancelDrag
  });
  const dragHandle = (id: ShortcutId, label: string, index?: number) => (
    <button
      type="button"
      className={styles.dragHandle}
      aria-label={`Drag ${label}`}
      aria-describedby="shortcut-reorder-help"
      data-drag-handle
      onKeyDown={(event) => {
        if (event.key === 'Escape' && dragging.current) {
          event.preventDefault();
          event.stopPropagation();
          updateDrag(null);
          return;
        }
        const step = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }[event.key];
        if (index !== undefined && step) {
          event.preventDefault();
          move(id, index + step);
        }
      }}
    >
      <DotsSixVerticalIcon size={16} aria-hidden />
    </button>
  );
  return (
    <Modal
      id="home-shortcut-editor"
      open={open}
      onOpenChange={changeOpen}
      trigger={
        <Button variant="secondary" disabled={disabled} icon={<SquaresFourIcon size={16} />}>
          Edit shortcuts
        </Button>
      }
      title="Edit shortcuts"
      description="Drag shortcuts to reorder them or move them between sections."
      footer={
        <div className={styles.shortcutFooter}>
          <Button
            variant="secondaryDanger"
            className={styles.resetShortcuts}
            onClick={() => {
              setDraft([...defaultShortcuts]);
              setAnnouncement('Default shortcuts restored.');
            }}
          >
            Reset to default
          </Button>
          <Button variant="secondary" onClick={() => changeOpen(false)}>
            Cancel
          </Button>
          <Button
            icon={<CheckIcon size={16} />}
            onClick={() => {
              onSave(draft);
              changeOpen(false);
            }}
          >
            Save changes
          </Button>
        </div>
      }
    >
      <p className={styles.srOnly} id="shortcut-reorder-help">
        Drag a tile to move between sections. Use the arrow keys to reorder added shortcuts, or use
        the Add and Remove buttons to move between sections.
      </p>
      <p className={styles.srOnly} role="status">
        {announcement}
      </p>
      <section
        ref={addedSection}
        className={addedSlot === 0 && !draft.length ? styles.shortcutDropTarget : undefined}
        aria-labelledby="added-shortcuts"
      >
        <h3 id="added-shortcuts" className={styles.editorHeading}>
          Added:
        </h3>
        <ul ref={list} className={styles.editorList}>
          {draft.map((id, index) => {
            const item = shortcuts.find((candidate) => candidate.id === id);
            if (!item) return null;
            return (
              <li
                key={id}
                {...dragRowProps(id)}
                className={`${styles.editorRow} ${drag?.id === id ? styles.grabbedRow : ''} ${
                  addedSlot === index ? styles.dropBefore : ''
                } ${
                  addedSlot === draft.length && index === draft.length - 1 ? styles.dropAfter : ''
                }`}
              >
                {dragHandle(id, item.label, index)}
                <span className={styles.editorTileIcon}>
                  <item.icon size={24} aria-hidden />
                </span>
                <span className={styles.rowLabel}>{item.label}</span>
                <IconButton
                  variant="tertiary"
                  size={24}
                  aria-label={`Remove ${item.label}`}
                  icon={<TrashIcon size={16} />}
                  onClick={() => {
                    setDraft((items) => items.filter((value) => value !== id));
                    setAnnouncement(`${item.label} removed.`);
                  }}
                />
              </li>
            );
          })}
        </ul>
        {!draft.length && <p className={styles.muted}>Drag a shortcut here to add it.</p>}
      </section>
      <section
        ref={removedSection}
        className={`${styles.removed} ${
          drag?.target?.section === 'removed' ? styles.shortcutDropTarget : ''
        }`}
        aria-labelledby="removed-shortcuts"
      >
        <h3 id="removed-shortcuts" className={styles.editorHeading}>
          Removed:
        </h3>
        <ul className={styles.editorList}>
          {shortcuts
            .filter((item) => !draft.includes(item.id))
            .map((item) => (
              <li
                key={item.id}
                {...dragRowProps(item.id)}
                className={`${styles.editorRow} ${drag?.id === item.id ? styles.grabbedRow : ''}`}
              >
                {dragHandle(item.id, item.label)}
                <span className={styles.editorTileIcon}>
                  <item.icon size={24} aria-hidden />
                </span>
                <span className={styles.rowLabel}>{item.label}</span>
                <IconButton
                  variant="tertiary"
                  size={24}
                  aria-label={`Add ${item.label}`}
                  icon={<PlusIcon size={16} />}
                  onClick={() => {
                    setDraft((items) => [...items, item.id]);
                    setAnnouncement(`${item.label} added.`);
                  }}
                />
              </li>
            ))}
        </ul>
        {draft.length === shortcuts.length && (
          <p className={styles.muted}>All shortcuts are added.</p>
        )}
      </section>
      {drag &&
        grabbed &&
        createPortal(
          <DesignSystemScope className={styles.dragPortal}>
            <div
              aria-hidden="true"
              className={styles.dragPreview}
              style={{ left: drag.x - drag.offsetX, top: drag.y - drag.offsetY, width: drag.width }}
            >
              <span className={styles.editorTileIcon}>
                <grabbed.icon size={24} aria-hidden />
              </span>
              <span className={styles.rowLabel}>{grabbed.label}</span>
            </div>
          </DesignSystemScope>,
          document.body
        )}
    </Modal>
  );
}
