import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { Card, DesignSystemScope, IconButton } from '../../../design-system-2026/components';
import { ArrowRightIcon } from '../../../design-system-2026/icons';
import styles from './AdminShoutouts.module.css';

type Props = {
  items: Shoutout[];
  shortcutsDisabled: boolean;
  renderCard: (shoutout: Shoutout, index: number) => JSX.Element;
};

type Slide = {
  index: number;
  id: string;
  direction: 'forward' | 'backward';
  previous: { item: Shoutout; index: number } | null;
};

export default function ShoutoutStack({
  items,
  shortcutsDisabled,
  renderCard
}: Props): JSX.Element {
  const [slide, setSlide] = useState<Slide | null>(null);
  const position = slide ? items.findIndex((item) => item.uuid === slide.id) : -1;
  const index = position >= 0 ? position : Math.min(slide?.index ?? 0, items.length - 1);
  const current = items[index];

  const move = (offset: number) => {
    const next = items[index + offset];
    if (!next || !current) return;
    setSlide({
      index: index + offset,
      id: next.uuid,
      direction: offset > 0 ? 'forward' : 'backward',
      previous: { item: current, index }
    });
  };

  useEffect(() => {
    if (shortcutsDisabled) return undefined;
    const navigate = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) ||
        (event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            event.target.closest('input, textarea, select, [role="tablist"]')))
      )
        return;
      event.preventDefault();
      move(event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1);
    };
    window.addEventListener('keydown', navigate, true);
    return () => window.removeEventListener('keydown', navigate, true);
  });

  const previous = position >= 0 ? slide?.previous : null;
  return (
    <section className={styles.stack} aria-label="Shoutout card stack">
      <DesignSystemScope theme="light" className={styles.deck} data-direction={slide?.direction}>
        {Array.from({ length: Math.min(3, items.length - index - 1) }, (_, layer) => (
          <Card key={layer} className={styles.sheet} data-layer={layer + 1} aria-hidden />
        ))}
        <div key={current.uuid} className={previous ? styles.incoming : undefined}>
          {renderCard(current, index)}
        </div>
        {previous && (
          <div
            key={`outgoing-${previous.item.uuid}`}
            className={styles.outgoing}
            aria-hidden
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) {
                setSlide((value) =>
                  value && value === slide ? { ...value, previous: null } : value
                );
              }
            }}
          >
            {renderCard(previous.item, previous.index)}
          </div>
        )}
      </DesignSystemScope>
      <div className={styles.pagination}>
        <IconButton
          className={styles.arrow}
          icon={<ArrowLeftIcon size={22} aria-hidden />}
          aria-label="Previous shoutout"
          aria-keyshortcuts="ArrowLeft ArrowUp"
          onClick={() => move(-1)}
          disabled={index === 0}
        />
        <span role="status" aria-atomic="true">
          {index + 1} out of {items.length}
        </span>
        <IconButton
          className={styles.arrow}
          icon={<ArrowRightIcon size={22} aria-hidden />}
          aria-label="Next shoutout"
          aria-keyshortcuts="ArrowRight ArrowDown"
          onClick={() => move(1)}
          disabled={index === items.length - 1}
        />
      </div>
    </section>
  );
}
