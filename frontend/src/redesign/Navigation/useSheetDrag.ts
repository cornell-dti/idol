import { MouseEvent, PointerEvent, RefObject, useRef } from 'react';

type Drag = {
  pointerId: number;
  startY: number;
  /** The sheet's offset when the press began; non-zero if it was still sliding in or out. */
  startOffset: number;
  offset: number;
  lastY: number;
  lastTime: number;
  velocity: number;
  active: boolean;
};

const startThreshold = 6;
const closeFraction = 0.3;
const flickVelocity = 0.45; // px per ms

/** Current translateY of an element, including a transition that is mid-flight. */
function currentOffset(element: HTMLElement): number {
  const { transform } = getComputedStyle(element);
  if (!transform || transform === 'none') return 0;
  return new DOMMatrixReadOnly(transform).m42;
}

/**
 * Drag a bottom sheet down to dismiss it, from anywhere on it. The sheet's open/close motion is a
 * CSS transition, so a press mid-animation freezes it where it is and the drag carries on from
 * there; releasing either settles back open or closes from that exact position.
 * Elements marked `data-vaul-no-drag` (e.g. the navbar editor) keep their own gestures.
 */
export default function useSheetDrag({
  sheet,
  backdrop,
  onClose
}: {
  sheet: RefObject<HTMLElement>;
  backdrop: RefObject<HTMLElement>;
  onClose: () => void;
}) {
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);

  const apply = (offset: number) => {
    const element = sheet.current;
    if (!element) return;
    element.style.transform = `translateY(${offset}px)`;
    const shade = backdrop.current;
    if (shade) {
      shade.style.transition = 'none';
      shade.style.opacity = String(1 - Math.min(1, offset / element.offsetHeight));
    }
  };
  // Hand motion back to the stylesheet's transitions, starting from wherever the drag left off.
  const release = () => {
    const element = sheet.current;
    if (element) {
      element.style.transition = '';
      element.style.transform = '';
    }
    const shade = backdrop.current;
    if (shade) {
      shade.style.transition = '';
      shade.style.opacity = '';
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || drag.current) return;
    if ((event.target as Element).closest('[data-vaul-no-drag]')) return;
    const element = sheet.current;
    if (!element) return;
    const now = performance.now();
    drag.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startOffset: Math.max(0, currentOffset(element)),
      offset: 0,
      lastY: event.clientY,
      lastTime: now,
      velocity: 0,
      active: false
    };
    suppressClick.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const { current } = drag;
    const element = sheet.current;
    if (!current || !element || current.pointerId !== event.pointerId) return;
    const dy = event.clientY - current.startY;
    if (!current.active) {
      if (Math.abs(dy) < startThreshold) return;
      // An upward swipe on a still sheet is a scroll, not a drag.
      if (dy < 0 && current.startOffset === 0) {
        drag.current = null;
        return;
      }
      current.active = true;
      element.setPointerCapture(event.pointerId);
      element.style.transition = 'none';
    }
    const now = performance.now();
    const elapsed = Math.max(1, now - current.lastTime);
    current.velocity = (event.clientY - current.lastY) / elapsed;
    current.lastY = event.clientY;
    current.lastTime = now;
    current.offset = Math.max(0, current.startOffset + dy);
    apply(current.offset);
  };

  const finish = (event: PointerEvent<HTMLElement>, cancelled = false) => {
    const { current } = drag;
    const element = sheet.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    if (!current.active || !element) return;
    suppressClick.current = true;
    const shouldClose =
      !cancelled &&
      (current.velocity > flickVelocity ||
        (current.velocity > -flickVelocity &&
          current.offset > element.offsetHeight * closeFraction));
    if (shouldClose) {
      // Slide off from exactly here; the popup unmounts (dropping these styles) once it ends.
      element.style.transition = '';
      element.style.transform = 'translateY(100%)';
      const shade = backdrop.current;
      if (shade) {
        shade.style.transition = '';
        shade.style.opacity = '0';
      }
      onClose();
    } else {
      release();
    }
  };

  return {
    /** Call when reopening, in case a drag-close left the sheet pinned off-screen mid-exit. */
    reset: release,
    onPointerDown,
    onPointerMove,
    onPointerUp: (event: PointerEvent<HTMLElement>) => finish(event),
    onPointerCancel: (event: PointerEvent<HTMLElement>) => finish(event, true),
    // A drag that ends over a link must not also follow it.
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    }
  };
}
