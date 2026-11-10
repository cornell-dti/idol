import { PointerEvent, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, DesignSystemScope, IconButton, Modal } from '../../design-system-2026/components';
import {
  CheckIcon,
  PlusIcon,
  TrashIcon,
  DotsSixVerticalIcon
} from '../../design-system-2026/icons';
import { dropShortcut, moveShortcut, ShortcutId, shortcuts } from './shortcuts';
import styles from './Homepage.module.css';

type Drag = {
  id: ShortcutId;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  slot: number | null;
};

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
  const startDrag = (event: PointerEvent<HTMLButtonElement>, id: ShortcutId, index: number) => {
    if (event.button !== 0) return;
    const row = event.currentTarget.closest('li');
    if (!row) return;
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = row.getBoundingClientRect();
    updateDrag({
      id,
      x: event.clientX,
      y: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      slot: index
    });
  };
  const trackDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const { current } = dragging;
    if (!current || !list.current) return;
    const bounds = list.current.getBoundingClientRect();
    let slot: number | null = null;
    if (
      event.clientX >= bounds.left - 24 &&
      event.clientX <= bounds.right + 24 &&
      event.clientY >= bounds.top - 24 &&
      event.clientY <= bounds.bottom + 24
    ) {
      const rows = Array.from(list.current.children);
      const next = rows.findIndex((row) => {
        const rect = row.getBoundingClientRect();
        return event.clientY < rect.top + rect.height / 2;
      });
      slot = next < 0 ? rows.length : next;
    }
    updateDrag({ ...current, x: event.clientX, y: event.clientY, slot });
  };
  const finishDrag = () => {
    const { current } = dragging;
    if (current && current.slot !== null) {
      const next = dropShortcut(draft, current.id, current.slot);
      setDraft(next);
      setAnnouncement(
        `${shortcuts.find((item) => item.id === current.id)?.label} moved to position ${
          next.indexOf(current.id) + 1
        }.`
      );
    }
    updateDrag(null);
  };
  const grabbed = shortcuts.find((item) => item.id === drag?.id);
  const move = (id: ShortcutId, target: number) => {
    setDraft((items) => moveShortcut(items, id, target));
    if (target >= 0 && target < draft.length)
      setAnnouncement(
        `${shortcuts.find((item) => item.id === id)?.label} moved to position ${target + 1}.`
      );
  };
  return (
    <Modal
      id="home-shortcut-editor"
      open={open}
      onOpenChange={changeOpen}
      trigger={
        <Button variant="secondary" disabled={disabled}>
          Edit shortcuts
        </Button>
      }
      title="Edit shortcuts"
      description="Customize the IDOL homepage to your liking! Drag to reorder items."
      footer={
        <>
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
        </>
      }
    >
      <p className={styles.srOnly} id="shortcut-reorder-help">
        Drag a handle or focus it and use the up and down arrow keys to reorder shortcuts.
      </p>
      <p className={styles.srOnly} role="status">
        {announcement}
      </p>
      <section aria-labelledby="added-shortcuts">
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
                className={`${styles.editorRow} ${drag?.id === id ? styles.grabbedRow : ''} ${
                  drag?.slot === index ? styles.dropBefore : ''
                } ${
                  drag?.slot === draft.length && index === draft.length - 1 ? styles.dropAfter : ''
                }`}
              >
                <button
                  type="button"
                  className={styles.dragHandle}
                  aria-label={`Reorder ${item.label}`}
                  aria-describedby="shortcut-reorder-help"
                  onPointerDown={(event) => startDrag(event, id, index)}
                  onPointerMove={trackDrag}
                  onPointerUp={finishDrag}
                  onPointerCancel={() => updateDrag(null)}
                  onLostPointerCapture={() => updateDrag(null)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && dragging.current) {
                      event.preventDefault();
                      event.stopPropagation();
                      updateDrag(null);
                      return;
                    }
                    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                      event.preventDefault();
                      move(id, index + (event.key === 'ArrowUp' ? -1 : 1));
                    }
                  }}
                >
                  <DotsSixVerticalIcon size={16} aria-hidden />
                </button>
                <item.icon size={16} aria-hidden />
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
        {!draft.length && <p className={styles.muted}>Add a shortcut from the list below.</p>}
      </section>
      <section className={styles.removed} aria-labelledby="removed-shortcuts">
        <h3 id="removed-shortcuts" className={styles.editorHeading}>
          Removed:
        </h3>
        <ul className={styles.editorList}>
          {shortcuts
            .filter((item) => !draft.includes(item.id))
            .map((item) => (
              <li key={item.id} className={styles.editorRow}>
                <span className={styles.inactiveHandle}>
                  <DotsSixVerticalIcon size={16} aria-hidden />
                </span>
                <item.icon size={16} aria-hidden />
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
              <DotsSixVerticalIcon size={16} aria-hidden />
              <grabbed.icon size={16} aria-hidden />
              <span>{grabbed.label}</span>
            </div>
          </DesignSystemScope>,
          document.body
        )}
    </Modal>
  );
}
