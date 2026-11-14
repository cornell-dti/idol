import { useEffect, useRef, useState } from 'react';
import { Button, IconButton, Modal, useToast } from '../../design-system-2026/components';
import {
  CaretDownIcon,
  CheckIcon,
  ImageIcon,
  UploadSimpleIcon,
  XIcon
} from '../../design-system-2026/icons';
import {
  coverFileTypes,
  CoverPreferences,
  coverThumbnail,
  defaultCover,
  makeCustomCover,
  presetCovers
} from './covers';
import styles from './CoverEditor.module.css';
import homeStyles from './Homepage.module.css';

type Props = {
  value: CoverPreferences;
  onSave: (value: CoverPreferences) => void;
  disabled: boolean;
};

const maxCustomCovers = 10;

/** Grid columns per viewport, matching the breakpoints in CoverEditor.module.css. */
const columnQueries: [string, number][] = [
  ['(max-width: 480px)', 2],
  ['(max-width: 720px)', 3],
  ['(max-width: 900px)', 4]
];

/**
 * Covers shown before "Show more": two full rows on desktop and three on phones, so Save
 * stays in view without scrolling far.
 */
function useCollapsedCount(): number {
  const [count, setCount] = useState(10);
  useEffect(() => {
    const queries = [...columnQueries.map(([query]) => query), '(max-width: 640px)'].map((query) =>
      window.matchMedia(query)
    );
    const update = () => {
      const columns = columnQueries.find(([query]) => window.matchMedia(query).matches)?.[1] ?? 5;
      const rows = window.matchMedia('(max-width: 640px)').matches ? 3 : 2;
      setCount(columns * rows);
    };
    update();
    queries.forEach((query) => query.addEventListener('change', update));
    return () => queries.forEach((query) => query.removeEventListener('change', update));
  }, []);
  return count;
}

export default function CoverEditor({ value, onSave, disabled }: Props): JSX.Element {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const collapsedCount = useCollapsedCount();
  const input = useRef<HTMLInputElement>(null);
  const uploading = useRef(false);
  const dragDepth = useRef(0);

  const changeOpen = (next: boolean) => {
    if (busy) return;
    if (next) {
      setDraft(value);
      setError('');
      setExpanded(false);
    }
    dragDepth.current = 0;
    setDragging(false);
    setOpen(next);
  };

  const canAddCover = () => {
    if (draft.custom.length < maxCustomCovers) return true;
    toast.add({
      id: 'cover-upload-limit',
      type: 'negative',
      priority: 'high',
      title: 'Maximum of 10 custom photos reached.',
      description: 'Remove a custom photo to add another.'
    });
    return false;
  };

  const upload = async (file?: File) => {
    if (!file || uploading.current || !canAddCover()) return;
    uploading.current = true;
    setBusy(true);
    setError('');
    try {
      const cover = await makeCustomCover(file);
      setDraft((current) => ({
        ...current,
        selected: cover.id,
        custom: [...current.custom, cover]
      }));
      setExpanded(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'This photo could not be uploaded.');
    } finally {
      uploading.current = false;
      setBusy(false);
    }
  };

  const save = () => {
    try {
      onSave(draft);
      changeOpen(false);
    } catch {
      setError(
        'Could not save covers in this browser. Try removing a custom photo or choosing a smaller one.'
      );
    }
  };

  const covers = [...presetCovers, ...draft.custom];
  // Collapsed, show whole rows. If the picked cover is further down, it takes the last slot.
  const selectedIndex = covers.findIndex((cover) => cover.id === draft.selected);
  const collapsedCovers =
    selectedIndex < collapsedCount
      ? covers.slice(0, collapsedCount)
      : [...covers.slice(0, collapsedCount - 1), covers[selectedIndex]];
  const hiddenCount = covers.length - collapsedCovers.length;
  const visibleCovers = expanded ? covers : collapsedCovers;

  return (
    <Modal
      id="home-cover-editor"
      open={open}
      onOpenChange={changeOpen}
      title="Edit cover"
      description="Customize the IDOL homepage cover image."
      width={1000}
      trigger={
        <Button variant="secondary" disabled={disabled} icon={<ImageIcon size={16} aria-hidden />}>
          Change cover
        </Button>
      }
      surfaceClassName={dragging ? styles.dropSurface : undefined}
      surfaceOverlay={
        dragging ? (
          <div className={styles.dropOverlay} role="status">
            <UploadSimpleIcon size={40} aria-hidden />
            <strong>Drop to upload</strong>
            <span>JPEG, PNG, or WebP</span>
          </div>
        ) : undefined
      }
      popupProps={{
        onDragEnter: (event) => {
          if (!event.dataTransfer.types.includes('Files') || busy) return;
          event.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        },
        onDragOver: (event) => {
          if (!event.dataTransfer.types.includes('Files')) return;
          event.preventDefault();
          const { dataTransfer } = event;
          dataTransfer.dropEffect = busy ? 'none' : 'copy';
        },
        onDragLeave: () => {
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        },
        onDrop: (event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          upload(event.dataTransfer.files[0]);
        }
      }}
      footer={
        <>
          <Button variant="secondary" disabled={busy} onClick={() => changeOpen(false)}>
            Cancel
          </Button>
          <Button
            icon={<CheckIcon size={16} aria-hidden />}
            disabled={busy || draft === value}
            onClick={save}
          >
            Save changes
          </Button>
        </>
      }
    >
      <fieldset className={styles.choices}>
        <legend className={homeStyles.editorHeading}>Pick a cover</legend>
        <div className={styles.grid}>
          {visibleCovers.map((cover) => (
            <div className={styles.tile} key={cover.id}>
              <label className={styles.option}>
                <input
                  type="radio"
                  name="homepage-cover"
                  checked={draft.selected === cover.id}
                  onChange={() => setDraft((current) => ({ ...current, selected: cover.id }))}
                />
                <img
                  className={styles.thumbnail}
                  src={coverThumbnail(cover)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span title={cover.name}>{cover.name}</span>
              </label>
              {cover.id.startsWith('custom-') && (
                <IconButton
                  className={styles.remove}
                  variant="tertiary"
                  size={24}
                  icon={<XIcon size={14} aria-hidden />}
                  aria-label={`Remove ${cover.name}`}
                  onClick={() =>
                    setDraft((current) => ({
                      selected: current.selected === cover.id ? defaultCover.id : current.selected,
                      custom: current.custom.filter((item) => item.id !== cover.id),
                      positions: Object.fromEntries(
                        Object.entries(current.positions).filter(([id]) => id !== cover.id)
                      )
                    }))
                  }
                />
              )}
            </div>
          ))}
        </div>
        {covers.length > collapsedCount && (
          <Button
            variant="secondary"
            className={styles.showMore}
            icon={<CaretDownIcon size={16} aria-hidden className={expanded ? styles.flip : ''} />}
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show fewer' : `Show ${hiddenCount} more`}
          </Button>
        )}
      </fieldset>
      <section className={styles.upload} aria-labelledby="cover-upload-title">
        <h3 id="cover-upload-title" className={homeStyles.editorHeading}>
          Or, upload your own
        </h3>
        <input
          ref={input}
          type="file"
          accept={coverFileTypes}
          hidden
          onChange={(event) => {
            const { currentTarget } = event;
            upload(currentTarget.files?.[0]);
            currentTarget.value = '';
          }}
        />
        <div className={styles.uploadControls}>
          <Button
            variant="secondary"
            icon={<UploadSimpleIcon size={16} aria-hidden />}
            disabled={busy}
            onClick={() => {
              if (canAddCover()) input.current?.click();
            }}
          >
            {busy ? 'Preparing photo…' : 'Choose photo'}
          </Button>
        </div>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
      </section>
    </Modal>
  );
}
