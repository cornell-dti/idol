import { PointerEvent, useEffect, useRef, useState } from 'react';
import { Button, useToast } from '../../design-system-2026/components';
import { ArrowsVerticalIcon, CheckIcon } from '../../design-system-2026/icons';
import CoverEditor from './CoverEditor';
import { clampCoverPosition, defaultCover, defaultCoverPosition, presetCovers } from './covers';
import useCoverPreferences from './useCoverPreferences';
import styles from './Homepage.module.css';

export default function HomepageCover({ storageKey }: { storageKey: string }): JSX.Element {
  const toast = useToast();
  const { preferences, saveCover } = useCoverPreferences(storageKey);
  const [draftPosition, setDraftPosition] = useState<number | null>(null);
  const photo = useRef<HTMLImageElement>(null);
  const dragArea = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLElement>(null);
  const drag = useRef<{ id: number; y: number; position: number; overflow: number } | null>(null);

  const cover =
    [...presetCovers, ...preferences.custom].find((item) => item.id === preferences.selected) ??
    defaultCover;
  const savedPosition = preferences.positions[cover.id] ?? defaultCoverPosition;
  const repositioning = draftPosition !== null;

  useEffect(() => {
    if (repositioning) dragArea.current?.focus({ preventScroll: true });
  }, [repositioning]);

  const stopRepositioning = () => {
    drag.current = null;
    setDraftPosition(null);
    action.current?.focus({ preventScroll: true });
  };

  const savePosition = () => {
    if (draftPosition === null) return;
    try {
      saveCover({
        ...preferences,
        positions: { ...preferences.positions, [cover.id]: Math.round(draftPosition * 100) / 100 }
      });
      stopRepositioning();
    } catch {
      toast.add({ type: 'negative', title: 'Could not save the cover position in this browser.' });
    }
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const { current: image } = photo;
    if (event.button !== 0 || drag.current || !image?.naturalWidth || draftPosition === null)
      return;
    // With object-fit: cover, only the part taller than the frame can move vertically.
    const overflow =
      (image.clientWidth * image.naturalHeight) / image.naturalWidth - image.clientHeight;
    if (overflow <= 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, y: event.clientY, position: draftPosition, overflow };
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const { current } = drag;
    if (current?.id !== event.pointerId) return;
    setDraftPosition(
      clampCoverPosition(current.position - ((event.clientY - current.y) / current.overflow) * 100)
    );
  };

  return (
    <>
      <img
        ref={photo}
        className={styles.heroPhoto}
        src={cover.src}
        srcSet={cover.srcSet}
        sizes={cover.srcSet ? '100vw' : undefined}
        style={{ objectPosition: `center ${draftPosition ?? savedPosition}%` }}
        alt=""
        draggable={false}
      />
      <div className={styles.heroFade} />
      {draftPosition !== null && (
        <div
          ref={dragArea}
          className={styles.coverDragArea}
          role="slider"
          tabIndex={0}
          aria-label="Vertical cover position"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(draftPosition)}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={(event) => {
            moveDrag(event);
            if (drag.current?.id === event.pointerId) drag.current = null;
          }}
          onPointerCancel={(event) => {
            if (drag.current?.id !== event.pointerId) return;
            setDraftPosition(drag.current.position);
            drag.current = null;
          }}
          onLostPointerCapture={(event) => {
            if (drag.current?.id === event.pointerId) drag.current = null;
          }}
          onKeyDown={(event) => {
            switch (event.key) {
              case 'ArrowUp':
                setDraftPosition(clampCoverPosition(draftPosition + 5));
                break;
              case 'ArrowDown':
                setDraftPosition(clampCoverPosition(draftPosition - 5));
                break;
              case 'Home':
                setDraftPosition(0);
                break;
              case 'End':
                setDraftPosition(100);
                break;
              case 'Escape':
                stopRepositioning();
                break;
              default:
                return;
            }
            event.preventDefault();
          }}
        />
      )}
      <div className={styles.coverControls} data-repositioning={repositioning || undefined}>
        {repositioning ? (
          <Button variant="secondary" onClick={stopRepositioning}>
            Cancel
          </Button>
        ) : (
          <CoverEditor value={preferences} onSave={saveCover} disabled={false} />
        )}
        <Button
          ref={action}
          variant={repositioning ? 'primary' : 'secondary'}
          icon={repositioning ? <CheckIcon size={16} /> : <ArrowsVerticalIcon size={16} />}
          onClick={repositioning ? savePosition : () => setDraftPosition(savedPosition)}
        >
          {repositioning ? 'Save' : 'Reposition'}
        </Button>
      </div>
    </>
  );
}
