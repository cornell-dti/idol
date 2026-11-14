import { RefObject, useEffect, useRef } from 'react';
import styles from './LoginGlow.module.css';

type Props = { readonly containerRef: RefObject<HTMLDivElement> };
type Point = { x: number; y: number };

// Uneven overlapping contours, rather than a circular cutout around the cursor.
const shapes = [
  [430, 330, 285, 215],
  [345, 275, 205, 170],
  [535, 385, 215, 150]
];
// Like water, the light is dragged along by the pointer's motion rather than following it.
// `share` is how much of the recent movement a layer picks up, `lag` how slowly it responds (ms).
// Different values per layer let the blobs separate and swirl past each other.
const wake = [
  { share: 0.22, lag: 650 },
  { share: 0.34, lag: 480 },
  { share: 0.14, lag: 900 }
];
const maxDrift = 120;
/** How long the pointer's recent movement keeps dragging the light (ms). */
const flowMemory = 700;
/**
 * Builds the three lobes. With Math.random each page load gets its own placement, size, tilt
 * and edge ripples; with a constant 0.5 it gives the neutral shape used for server rendering.
 */
const makeContours = (random: () => number): Point[][] =>
  shapes.map(([cx, cy, rx, ry], layer) => {
    const spread = (amount: number) => (random() - 0.5) * 2 * amount;
    // The main lobe stays near the card; the smaller ones wander further around it.
    const centerX = cx + spread(layer === 0 ? 50 : 120);
    const centerY = cy + spread(layer === 0 ? 40 : 90);
    const width = rx * (0.8 + random() * 0.4);
    const height = ry * (0.8 + random() * 0.4);
    const tilt = spread(0.45);
    const waves = [2 + Math.floor(random() * 3), 4 + Math.floor(random() * 3)];
    const shifts = [random() * Math.PI * 2, random() * Math.PI * 2];
    const depths = [0.08 + random() * 0.08, 0.03 + random() * 0.06];
    return Array.from({ length: 16 }, (_, index) => {
      const angle = (index / 16) * Math.PI * 2;
      const ripple =
        1 +
        Math.sin(angle * waves[0] + shifts[0]) * depths[0] +
        Math.cos(angle * waves[1] + shifts[1]) * depths[1];
      const x = Math.cos(angle) * width * ripple;
      const y = Math.sin(angle) * height * ripple;
      return {
        x: centerX + x * Math.cos(tilt) - y * Math.sin(tilt),
        y: centerY + x * Math.sin(tilt) + y * Math.cos(tilt)
      };
    });
  });
const neutralContours = makeContours(() => 0.5);
const lobeOpacity = [0.095, 0.058, 0.045];
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
    if (!element || !container) return undefined;
    if (!window.matchMedia) {
      element.dataset.ready = '';
      return undefined;
    }
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    let attached = false;
    const anchor = element.firstElementChild as HTMLDivElement;
    const lobes = Array.from(element.querySelectorAll<SVGPathElement>('path'));
    // A fresh shape on every page load, whether or not motion is allowed.
    const contours = makeContours(Math.random);
    let current = contours.map((points) => points.map((point) => ({ ...point })));
    let drift = contours.map(() => ({ x: 0, y: 0 }));
    let flow = { x: 0, y: 0 };
    let previous: Point | null = null;
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
      // Recent pointer movement, fading out over flowMemory: the current that drags the light.
      if (pointer && previous) {
        flow.x += px - previous.x;
        flow.y += py - previous.y;
      }
      previous = pointer ? { x: px, y: py } : null;
      const fade = Math.exp(-dt / flowMemory);
      flow.x *= fade;
      flow.y *= fade;
      if (Math.abs(flow.x) + Math.abs(flow.y) > 0.05) settling = true;
      const clamp = (value: number) => Math.max(-maxDrift, Math.min(maxDrift, value));
      lobes.forEach((lobe, layer) => {
        // Each layer is carried a little way along the current, at its own share and lag.
        const { share, lag } = wake[layer];
        const driftX = clamp(flow.x * share);
        const driftY = clamp(flow.y * share);
        const offset = drift[layer];
        const glide = 1 - Math.exp(-dt / lag);
        offset.x += (driftX - offset.x) * glide;
        offset.y += (driftY - offset.y) * glide;
        if (Math.abs(driftX - offset.x) + Math.abs(driftY - offset.y) > 0.05) settling = true;
        // Edges part slowly around the pointer and close again slowly behind it.
        const ease = 1 - Math.exp(-dt / (420 + layer * 160));
        contours[layer].forEach((point, index) => {
          const dx = point.x + offset.x - px;
          const dy = point.y + offset.y - py;
          const distance = Math.hypot(dx, dy);
          const influence = pointer ? Math.exp(-((distance / 240) ** 2)) : 0;
          const variation = Math.sin(index * 1.7 + layer * 2.3 + phase + px * 0.004 + py * 0.003);
          const push = influence * (110 + variation * 30);
          const curl = influence * (40 + variation * 20) * (layer === 1 ? -1 : 1);
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
        lobe.setAttribute('transform', `translate(${offset.x} ${offset.y})`);
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
      drift = contours.map(() => ({ x: 0, y: 0 }));
      flow = { x: 0, y: 0 };
      previous = null;
      lobes.forEach((lobe, index) => {
        lobe.setAttribute('d', outline(contours[index]));
        lobe.removeAttribute('transform');
      });
      element.dataset.ready = '';
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
            {neutralContours.map((points, index) => (
              <path
                key={lobeOpacity[index]}
                className={styles.lobe}
                d={outline(points)}
                opacity={lobeOpacity[index]}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
