import { RefObject, useEffect, useRef } from 'react';
import styles from './LoginGlow.module.css';

type Props = { readonly containerRef: RefObject<HTMLDivElement> };
type Point = { x: number; y: number };

// Uneven overlapping contours, rather than a circular cutout around the cursor.
const contours = [
  [430, 330, 285, 215],
  [345, 275, 205, 170],
  [535, 385, 215, 150]
].map(([cx, cy, rx, ry], layer) =>
  Array.from({ length: 16 }, (_, index) => {
    const angle = (index / 16) * Math.PI * 2;
    const ripple = 1 + Math.sin(angle * 3 + layer * 2) * 0.12 + Math.cos(angle * 5 + layer) * 0.06;
    return { x: cx + Math.cos(angle) * rx * ripple, y: cy + Math.sin(angle) * ry * ripple };
  })
);
const outline = (points: Point[]) => {
  const last = points[points.length - 1];
  let path = `M ${(last.x + points[0].x) / 2} ${(last.y + points[0].y) / 2}`;
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    path += ` Q ${point.x} ${point.y} ${(point.x + next.x) / 2} ${(point.y + next.y) / 2}`;
  });
  return `${path} Z`;
};

/** A soft light field that yields locally to the pointer when motion is allowed. */
export default function LoginGlow({ containerRef }: Props): JSX.Element {
  const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = glow.current;
    const container = containerRef.current;
    if (!element || !container || !window.matchMedia) return undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    let attached = false;
    const anchor = element.firstElementChild as HTMLDivElement;
    const lobes = Array.from(element.querySelectorAll<SVGPathElement>('path'));
    let current = contours.map((points) => points.map((point) => ({ ...point })));
    let pointer: Point | null = null;
    let phase = 0;
    let lastTime = 0;
    const paint = (time: number) => {
      frame = 0;
      const dt = Math.min(time - (lastTime || time - 16), 40);
      lastTime = time;
      const bounds = anchor.getBoundingClientRect();
      const px = pointer ? ((pointer.x - bounds.left) / Math.max(bounds.width, 1)) * 860 : 0;
      const py = pointer ? ((pointer.y - bounds.top) / Math.max(bounds.height, 1)) * 660 : 0;
      let settling = false;
      lobes.forEach((lobe, layer) => {
        // Each layer has a different drag; deformation lingers after the pointer passes.
        const ease = 1 - Math.exp(-dt / (280 + layer * 100));
        contours[layer].forEach((point, index) => {
          const dx = point.x - px;
          const dy = point.y - py;
          const distance = Math.hypot(dx, dy);
          const influence = pointer ? Math.exp(-((distance / 215) ** 2)) : 0;
          const variation = Math.sin(index * 1.7 + layer * 2.3 + phase + px * 0.004 + py * 0.003);
          const push = influence * (40 + variation * 12);
          const curl = influence * (25 + variation * 15) * (layer === 1 ? -1 : 1);
          // Tangential movement lets edges flow past the cursor asymmetrically.
          // The softened denominator avoids sudden direction changes at a control point.
          const divisor = Math.sqrt(distance * distance + 3600);
          const targetX = point.x + (dx * push - dy * curl) / divisor;
          const targetY = point.y + (dy * push + dx * curl) / divisor;
          const vertex = current[layer][index];
          vertex.x += (targetX - vertex.x) * ease;
          vertex.y += (targetY - vertex.y) * ease;
          if (Math.abs(targetX - vertex.x) + Math.abs(targetY - vertex.y) > 0.05) settling = true;
        });
        lobe.setAttribute('d', outline(current[layer]));
      });
      if (settling) frame = window.requestAnimationFrame(paint);
      else lastTime = 0;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const reset = () => {
      pointer = null;
      schedule();
    };
    const detach = () => {
      container.removeEventListener('pointermove', move);
      container.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      attached = false;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const sync = () => {
      detach();
      pointer = null;
      lastTime = 0;
      current = contours.map((points) => points.map((point) => ({ ...point })));
      lobes.forEach((lobe, index) => lobe.setAttribute('d', outline(contours[index])));
      if (!motion.matches) {
        delete element.dataset.motion;
        return;
      }
      // Randomize only after hydration, and only when motion is allowed.
      phase = Math.random() * Math.PI * 2;
      element.style.setProperty('--arrival-turn', `${(Math.random() - 0.5) * 28}deg`);
      element.style.setProperty('--arrival-scale', String(0.7 + Math.random() * 0.16));
      element.style.setProperty('--arrival-duration', `${1600 + Math.random() * 700}ms`);
      element.dataset.motion = 'enabled';
      if (hover.matches) {
        container.addEventListener('pointermove', move);
        container.addEventListener('pointerleave', reset);
        window.addEventListener('blur', reset);
        attached = true;
      }
    };
    sync();
    motion.addEventListener('change', sync);
    hover.addEventListener('change', sync);
    return () => {
      if (attached || frame) detach();
      motion.removeEventListener('change', sync);
      hover.removeEventListener('change', sync);
    };
  }, [containerRef]);
  return (
    <div ref={glow} className={styles.glow} aria-hidden="true">
      <div className={styles.anchor}>
        <div className={styles.bloom}>
          <svg
            className={styles.field}
            viewBox="0 0 860 660"
            preserveAspectRatio="none"
            focusable="false"
          >
            {contours.map((points, index) => (
              <path
                key={points[0].x}
                className={styles.lobe}
                d={outline(points)}
                opacity={[0.095, 0.058, 0.045][index]}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
