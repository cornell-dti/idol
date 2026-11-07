import { CSSProperties, PointerEvent, useCallback, useEffect, useRef } from 'react';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import { Coffee } from '@phosphor-icons/react/dist/csr/Coffee';
import { Star } from '@phosphor-icons/react/dist/csr/Star';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { Button } from '../../../design-system-2026/components';
import styles from './CoffeeChatsBoard3D.module.css';

type Cell = {
  category: string;
  status: CoffeeChat['status'] | 'default';
  bingo: boolean;
};

const statusIcons = { approved: Check, pending: Clock, rejected: X, default: Coffee };
const stampLabels = { approved: 'Done', pending: 'Pending', rejected: 'Retry', default: '' };

function trajectoryTurn(beforeX: number, beforeY: number, afterX: number, afterY: number): number {
  const dx = afterX - beforeX;
  const dy = afterY - beforeY;
  const distanceSquared = dx * dx + dy * dy;
  const closest = distanceSquared
    ? Math.max(0, Math.min(1, -(beforeX * dx + beforeY * dy) / distanceSquared))
    : 0;
  const radius = Math.hypot(beforeX + closest * dx, beforeY + closest * dy);
  const arc = Math.atan2(beforeX * afterY - beforeY * afterX, beforeX * afterX + beforeY * afterY);
  // Passing through the center should pull the board, not suddenly flip it.
  // Away from the center, one circle of the pointer is one turn of the board.
  return ((arc * 180) / Math.PI) * Math.min(1, (radius / 40) ** 2);
}

export default function CoffeeChatsBoard3D({
  cells,
  columns,
  onCellClick
}: {
  cells: Cell[];
  columns: number;
  onCellClick?: (category: string) => void;
}): JSX.Element {
  const stage = useRef<HTMLDivElement>(null);
  const pivot = useRef<HTMLSpanElement>(null);
  const reducedMotion = useRef(true);
  const motion = useRef({
    angle: 0,
    resetAngle: null as number | null,
    velocity: 0,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    frame: 0,
    previousTime: 0
  });
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    startOffsetX: number;
    startOffsetY: number;
    moved: boolean;
    centerX: number;
    centerY: number;
    time: number;
    samples: { angle: number; time: number }[];
  } | null>(null);

  const animate = useCallback(() => {
    const state = motion.current;
    if (state.frame || reducedMotion.current) return;
    state.previousTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - state.previousTime);
      state.previousTime = now;
      const ease = 1 - Math.exp(-dt / (drag.current ? 55 : 130));
      if (state.resetAngle !== null) {
        state.angle += (state.resetAngle - state.angle) * (1 - Math.exp(-dt / 100));
        if (Math.abs(state.resetAngle - state.angle) < 0.05) {
          state.angle = state.resetAngle;
          state.resetAngle = null;
        }
      } else if (!drag.current) {
        const friction = 1500;
        const decay = Math.exp(-dt / friction);
        state.angle += state.velocity * friction * (1 - decay);
        state.velocity *= decay;
      }
      state.x += (state.targetX - state.x) * ease;
      state.y += (state.targetY - state.y) * ease;
      state.tiltX += (state.targetTiltX - state.tiltX) * ease;
      state.tiltY += (state.targetTiltY - state.tiltY) * ease;
      const surface = stage.current;
      surface?.style.setProperty('--spin', `${state.angle}deg`);
      surface?.style.setProperty('--drag-x', `${state.x}px`);
      surface?.style.setProperty('--drag-y', `${state.y}px`);
      surface?.style.setProperty('--tilt-x', `${state.tiltX}deg`);
      surface?.style.setProperty('--tilt-y', `${state.tiltY}deg`);
      const moving =
        state.resetAngle !== null ||
        Math.abs(state.velocity) > 0.004 ||
        Math.abs(state.targetX - state.x) +
          Math.abs(state.targetY - state.y) +
          Math.abs(state.targetTiltX - state.tiltX) +
          Math.abs(state.targetTiltY - state.tiltY) >
          0.02;
      if (drag.current || moving) state.frame = requestAnimationFrame(tick);
      else {
        state.frame = 0;
        state.velocity = 0;
        state.angle %= 360;
      }
    };
    state.frame = requestAnimationFrame(tick);
  }, []);

  const resetTilt = () => {
    motion.current.targetTiltX = 0;
    motion.current.targetTiltY = 0;
    stage.current?.style.removeProperty('--light-x');
    stage.current?.style.removeProperty('--light-y');
    animate();
  };

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const state = motion.current;
    const update = () => {
      reducedMotion.current = preference.matches;
      if (preference.matches) {
        cancelAnimationFrame(state.frame);
        state.frame = 0;
        state.velocity = 0;
        state.resetAngle = null;
        state.x = 0;
        state.y = 0;
        state.tiltX = 0;
        state.tiltY = 0;
        const activeDrag = drag.current;
        drag.current = null;
        if (activeDrag && stage.current?.hasPointerCapture(activeDrag.id)) {
          stage.current.releasePointerCapture(activeDrag.id);
        }
        stage.current?.removeAttribute('data-dragging');
        ['--spin', '--drag-x', '--drag-y', '--tilt-x', '--tilt-y'].forEach((name) =>
          stage.current?.style.removeProperty(name)
        );
        state.angle = 0;
        state.targetX = 0;
        state.targetY = 0;
        state.targetTiltX = 0;
        state.targetTiltY = 0;
      }
    };
    update();
    preference.addEventListener('change', update);
    return () => {
      preference.removeEventListener('change', update);
      cancelAnimationFrame(state.frame);
    };
  }, []);

  useEffect(() => {
    const cancel = () => {
      const active = drag.current;
      drag.current = null;
      motion.current.velocity = 0;
      motion.current.targetX = 0;
      motion.current.targetY = 0;
      motion.current.targetTiltX = 0;
      motion.current.targetTiltY = 0;
      stage.current?.removeAttribute('data-dragging');
      if (active && stage.current?.hasPointerCapture(active.id)) {
        stage.current.releasePointerCapture(active.id);
      }
      animate();
    };
    const visibility = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener('blur', cancel);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('blur', cancel);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [animate]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion.current || !event.isPrimary || event.button !== 0 || drag.current) return;
    // Catch the board when selecting a square, without turning that click into a drag.
    motion.current.velocity = 0;
    motion.current.resetAngle = null;
    if ((event.target as Element).closest('button, a, input, select, textarea, [role="button"]')) {
      return;
    }
    const bounds = (pivot.current ?? event.currentTarget).getBoundingClientRect();
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startOffsetX: motion.current.x,
      startOffsetY: motion.current.y,
      moved: false,
      centerX: bounds.left + bounds.width / 2,
      centerY: bounds.top + bounds.height / 2,
      time: performance.now(),
      samples: [{ angle: motion.current.angle, time: performance.now() }]
    };
    motion.current.velocity = 0;
    motion.current.resetAngle = null;
    motion.current.targetX = motion.current.x;
    motion.current.targetY = motion.current.y;
    motion.current.targetTiltX = motion.current.tiltX;
    motion.current.targetTiltY = motion.current.tiltY;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.setAttribute('data-dragging', '');
    event.preventDefault();
    animate();
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const active = drag.current;
    if (!active || active.id !== event.pointerId) return;
    // A pause lets the card come to rest in the hand before release.
    const idle = performance.now() - active.time;
    if (cancelled || !active.moved) motion.current.velocity = 0;
    else motion.current.velocity *= Math.exp(-Math.max(0, idle - 16) / 55);
    drag.current = null;
    motion.current.targetX = 0;
    motion.current.targetY = 0;
    event.currentTarget.removeAttribute('data-dragging');
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetTilt();
  };

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion.current) return;
    const active = drag.current;
    const state = motion.current;
    if (active && active.id === event.pointerId) {
      const now = performance.now();
      if (!active.moved && Math.hypot(event.clientX - active.x, event.clientY - active.y) < 4)
        return;
      active.moved = true;
      // Signed arcs follow the whole trajectory: down on the right turns
      // clockwise, while down on the left turns counterclockwise.
      const turn = trajectoryTurn(
        active.lastX - active.centerX,
        active.lastY - active.centerY,
        event.clientX - active.centerX,
        event.clientY - active.centerY
      );
      // Discard the old direction promptly when the hand reverses.
      if (Math.abs(turn) > 0.05 && turn * state.velocity < 0) {
        active.samples = [{ angle: state.angle, time: active.time }];
      }
      state.angle += turn;
      active.samples.push({ angle: state.angle, time: now });
      while (active.samples.length > 2 && now - active.samples[1].time > 80) {
        active.samples.shift();
      }
      const first = active.samples[0];
      state.velocity = (state.angle - first.angle) / Math.max(1, now - first.time);
      // Only radial movement pulls the board. Tangential movement belongs entirely
      // to spinning, so following an arc cannot also tug the rotation center away.
      const pointerX = event.clientX - active.centerX;
      const pointerY = event.clientY - active.centerY;
      const radius = Math.hypot(pointerX, pointerY);
      const startRadius = Math.hypot(active.x - active.centerX, active.y - active.centerY);
      const stretch = radius - startRadius;
      const pullX = (pointerX / Math.max(1, radius)) * stretch;
      const pullY = (pointerY / Math.max(1, radius)) * stretch;
      const originX = Math.atanh(Math.max(-0.99, Math.min(0.99, active.startOffsetX / 14)));
      const originY = Math.atanh(Math.max(-0.99, Math.min(0.99, active.startOffsetY / 10)));
      state.targetX = 14 * Math.tanh(originX + pullX / 180);
      state.targetY = 10 * Math.tanh(originY + pullY / 180);
      // Keep the viewing angle steady while holding the card. Per-event tilt
      // changes made identical gestures behave differently at different speeds.
      active.lastX = event.clientX;
      active.lastY = event.clientY;
      active.time = now;
      animate();
      return;
    }
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    state.targetTiltX = (0.5 - y) * 8;
    state.targetTiltY = (x - 0.5) * 8;
    event.currentTarget.style.setProperty('--light-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--light-y', `${y * 100}%`);
    animate();
  };

  return (
    <div className={styles.experience}>
      <div
        ref={stage}
        className={styles.stage}
        onPointerDown={startDrag}
        onPointerMove={followPointer}
        onPointerUp={(event) => finishDrag(event)}
        onPointerLeave={() => {
          if (!drag.current) resetTilt();
        }}
        onPointerCancel={(event) => finishDrag(event, true)}
        onLostPointerCapture={(event) => finishDrag(event, true)}
      >
        <div className={styles.aura} aria-hidden="true" />
        <div
          className={styles.board}
          onFocusCapture={() => {
            motion.current.velocity = 0;
            motion.current.resetAngle = null;
          }}
        >
          <span ref={pivot} className={styles.pivot} aria-hidden="true" />
          <div className={styles.paper}>
            <header className={styles.printHeader}>
              <span className={styles.printTitle}>COFFEE CHAT</span>
              <span className={styles.bingoTitle}>BINGO</span>
            </header>
            <div className={styles.grid} style={{ '--columns': columns } as CSSProperties}>
              {cells.map(({ category, status, bingo }, index) => {
                const Icon = statusIcons[status];
                return (
                  <button
                    key={`${category}-${index}`}
                    type="button"
                    className={`${styles.tile} ${styles[status]} ${bingo ? styles.bingo : ''}`}
                    style={
                      {
                        '--stamp-angle': `${((index * 7) % 25) - 12}deg`,
                        '--stamp-delay': `${index * 35}ms`
                      } as CSSProperties
                    }
                    onClick={() => onCellClick?.(category)}
                    aria-label={`${category}: ${status}${bingo ? ', bingo' : ''}`}
                  >
                    <span className={styles.stampSlot} aria-hidden="true">
                      {status !== 'default' && (
                        <span className={styles.stamp}>
                          <Icon size={22} weight="bold" />
                          <span>{stampLabels[status]}</span>
                        </span>
                      )}
                    </span>
                    <span className={styles.category}>{category}</span>
                    <span className={styles.tileNumber} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {bingo && (
                      <Star
                        className={styles.bingoStar}
                        size={13}
                        weight="fill"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <footer className={styles.printFooter}>
              <Coffee size={18} aria-hidden="true" />
            </footer>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <p className={styles.hint}>Drag the edges to spin. Grab again to stop.</p>
        <Button
          variant="secondary"
          icon={<ArrowCounterClockwise size={18} />}
          onClick={() => {
            const state = motion.current;
            state.velocity = 0;
            state.targetX = 0;
            state.targetY = 0;
            state.resetAngle = Math.round(state.angle / 360) * 360;
            if (reducedMotion.current) {
              state.angle = 0;
              state.resetAngle = null;
              stage.current?.style.setProperty('--spin', '0deg');
            } else resetTilt();
          }}
        >
          Reset view
        </Button>
      </div>
    </div>
  );
}
