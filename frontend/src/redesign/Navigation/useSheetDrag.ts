import { MouseEvent, PointerEvent, RefObject, useEffect, useRef } from 'react';

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
  /** The scrollable area the press started in (e.g. an overflowing page grid), if any. */
  scroller: HTMLElement | null;
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

/** Nearest ancestor of `target`, up to `sheet`, that can scroll vertically right now. */
function scrollerFor(target: Element, sheet: HTMLElement): HTMLElement | null {
  for (let node: Element | null = target; node && node !== sheet; node = node.parentElement) {
    if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight + 1) {
      const { overflowY } = getComputedStyle(node);
      if (overflowY === 'auto' || overflowY === 'scroll') return node;
    }
  }
  return null;
}

/** A downward swipe in a scroller that is not at its top scrolls it rather than dragging. */
// 1px of slack: high-DPI screens can leave a scroller "at the top" at a fractional scrollTop.
const scrollsInstead = (current: Drag, dy: number) =>
  dy > 0 && current.scroller !== null && current.scroller.scrollTop > 1;

/**
 * Drag a bottom sheet down to dismiss it, from anywhere on it. The sheet's open/close motion is a
 * CSS transition, so a press mid-animation freezes it where it is and the drag carries on from
 * there; releasing either settles back open or closes from that exact position.
 * Elements marked `data-vaul-no-drag` (e.g. the navbar editor) keep their own gestures.
 * Inside a scrollable area, swipes scroll it; a downward swipe only drags the sheet once the area
 * is scrolled to its top.
 */
export default function useSheetDrag({
  open,
  sheet,
  backdrop,
  onClose
}: {
  open: boolean;
  sheet: RefObject<HTMLElement>;
  backdrop: RefObject<HTMLElement>;
  onClose: () => void;
}) {
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);

  // The page grid is a scroll container with `touch-action: auto`/`pan-y`, so the browser would
  // claim a downward swipe on it (scrolled to the top, or not overflowing at all) as a no-op
  // scroll and cancel our pointer stream. Cancelling that touchmove keeps the gesture
  // ours. React 17 listens to touchmove passively, so this needs a native listener. It goes on the
  // document because the sheet mounts a render after `open` flips (Base UI's portal); `drag` is
  // only set by a press on the sheet, so other touches pass through untouched.
  useEffect(() => {
    if (!open) return undefined;
    const onTouchMove = (event: TouchEvent) => {
      const { current } = drag;
      const touch = event.touches[0];
      if (!current || !touch || !event.cancelable) return;
      const dy = touch.clientY - current.startY;
      if (current.active || (dy > 0 && !scrollsInstead(current, dy))) event.preventDefault();
    };
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', onTouchMove);
  }, [open]);

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
      active: false,
      scroller: scrollerFor(event.target as Element, element)
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
      // An upward swipe on a still sheet is a scroll, not a drag; so is a downward one in a
      // scroller that can still scroll up.
      if ((dy < 0 && current.startOffset === 0) || scrollsInstead(current, dy)) {
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
