'use client';

import React from 'react';
import parseDate from '../../utils/dateUtils';

type Edge = {
  title: string;
  date: Date;
  nextTitle: string | null;
  nextDate: Date | null;
  weight: number; // 0..1
  percent: number; // 0..100
};

export type Event = {
  title: string;
  date: string;
  time?: string;
};

type TimelineProps = {
  events: Event[];
  currentDate: Date;
};

/**
 * `Timeline` Component - Displays a chronological timeline of Trends events.
 *
 * @remarks
 * This component is used to render the timeline with all the events. The timeline automatically adjusts based on screen size
 * (mobile vs. desktop) and displays a progress line showing how far along the current date is relative to the events.
 * Each event includes a title, date, and optional time. The date string should be formatted with the month (abbreviated), day, and
 * optionally, the time (formatted as `hh:mm AM/PM`). If no time is provided, the default will be 12:00 AM.
 * If no Year is provided, the default will be the Current Year
 *
 * @param props - Contains:
 *   - `events`: An array of event objects. Each object should contain:
 *     - `title`: The name of the event.
 *     - `date`: The date of the event in the format `MMM DD, YYYY` (e.g., "Feb 19, 2024"). MONTH NOT REQUIRED TO BE ABBREVIATED both Feb and February are valid
 *     - `time`: (Optional) The time of the event in the format `hh:mm AM/PM` (e.g., "12:00 PM EST").
 *   - `currentDate`: A `Date` object representing the current date and time, used to calculate the progress through the timeline.
 */
export default function Timeline({ events, currentDate }: TimelineProps) {
  const fmt = (d?: Date | null) =>
    d instanceof Date && !isNaN(d.getTime()) ? d.toISOString() : 'N/A';
  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

  const normTime = (t?: string) => {
    const s = (t ?? '').trim();
    return s.length > 0 ? s : undefined;
  };

  const withDates = React.useMemo(() => {
    const list = events
      .map((e) => {
        // Use 12:00 AM as default when time missing
        const d = parseDate(e.date, '12:00 AM', normTime(e.time));
        return { ...e, _date: d };
      })
      .filter((e) => {
        const ok = e._date instanceof Date && !isNaN(e._date.getTime());
        if (!ok && typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn('Timeline: invalid date skipped', e);
        }
        return ok;
      })
      .sort((a, b) => a._date.getTime() - b._date.getTime());
    return list;
  }, [events]);

  const calcProgress = (start: Date, end: Date, now: Date) => {
    const startMs = start.getTime();
    const endMs = end.getTime();
    const nowMs = now.getTime();
    if (!(isFinite(startMs) && isFinite(endMs) && isFinite(nowMs))) return 0;
    if (nowMs <= startMs) return 0;
    if (nowMs >= endMs) return 1;
    return (nowMs - startMs) / Math.max(1, endMs - startMs);
  };

  const graph: Edge[] = React.useMemo(() => {
    const edges = withDates.map((node, i) => {
      const next = i < withDates.length - 1 ? withDates[i + 1] : null;
      let weight = 0;
      if (next) {
        weight = calcProgress(node._date, next._date, currentDate);
      } else {
        // For the last node, treat edge as complete only after its own datetime
        weight = currentDate.getTime() <= node._date.getTime() ? 0 : 1;
      }
      const w = Math.min(1, Math.max(0, weight));

      const edge: Edge = {
        title: node.title,
        date: node._date,
        nextTitle: next ? next.title : null,
        nextDate: next ? next._date : null,
        weight: w,
        percent: Math.round(w * 100)
      };

      // // Debug log
      // console.log(
      //   `[Timeline] ${edge.title} → ${edge.nextTitle ?? 'END'} | weight: ${edge.weight} | percent: ${edge.percent} | dates:`,
      //   edge.date.toISOString(),
      //   edge.nextDate?.toISOString() ?? 'N/A'
      // );

      return edge;
    });
    return edges;
  }, [withDates, currentDate]);

  const halfGraph = events.map((node, i) => {
    let prevHalf: number;
    let nextHalf: number;

    // --- Previous half segment ---
    if (i === 0) {
      // First event: before it there's no edge
      // Filled if the first event has passed
      prevHalf = currentDate >= node._date ? 0 : 1;
    } else {
      // Otherwise: take weight from the previous edge
      const prevW = graph[i - 1].weight;
      if (prevW < 0.5) {
        prevHalf = 0;
      } else {
        const remainder = prevW - 0.5;
        prevHalf = remainder / 0.5;
      }
    }

    // --- Next half segment ---
    if (i === withDates.length - 1) {
      // Last event: after it there's no edge
      // Filled if last event has passed
      nextHalf = currentDate >= node._date ? 1 : 0;
    } else {
      // Otherwise: take weight from the current edge
      const nextW = graph[i].weight;
      if (nextW > 0.5) {
        nextHalf = 1;
      } else {
        nextHalf = nextW / 0.5;
      }
    }

    // Debug log (half segments)
    // eslint-disable-next-line no-console
    console.log(
      `[HalfGraph] i = ${i} | ${node.title} +
| prev: ${i === 0 ? 'N/A' : withDates[i - 1].title} -> ${node.title} +
| next: ${node.title} -> ${i === events.length - 1 ? 'END' : withDates[i + 1].title} +
| prevW=${i === 0 ? 'N/A' : graph[i - 1].weight.toFixed(3)} +
| nextW=${i === events.length - 1 ? 'N/A' : graph[i].weight.toFixed(3)} +
| prevHalf=${clamp01(prevHalf) * 100}% +
| nextHalf=${clamp01(nextHalf) * 100}% +
| dates: current = ${fmt(currentDate)}, node = ${fmt(node._date)} +
, prev = ${fmt(withDates[i - 1]?._date)}, next = ${fmt(withDates[i + 1]?._date)}
`
    );

    return {
      event: node,
      prevHalf: clamp01(prevHalf),
      nextHalf: clamp01(nextHalf)
    };
  });

  return (
    <div className="flex flex-row-reverse justify-end md:flex-col md:gap-4 gap-2 md:gap-y-3 md:pt-8 md:pb-16 border-b-1 border-border-1">
      {/* Desktop: dates above */}
      <div className="flex flex-col md:flex-row w-full">
        {events.map((ev, i) => (
          <div
            key={i}
            className="md:text-center min-h-35 md:min-h-0 justify-center pt-6.5 md:pt-0 flex-1 md:items-center flex flex-col md:gap-y-1"
          >
            <h3 className="h5">{ev.title}</h3>
            <p className="text-foreground-3">
              {ev.date}
              {ev.time && ` · ${ev.time}`}
            </p>
          </div>
        ))}
      </div>
      {/* Line Row */}
      <div className="flex flex-col -left-[7px] relative md:left-0 md:flex-row">
        {halfGraph.map((edge, i) => {
          const firstHalf = edge.prevHalf;
          const secondHalf = edge.nextHalf;
          const passed = firstHalf === 1 && secondHalf > 0;

          const HalfSegment = ({
            orientation,
            progress,
            isEdgeGradient
          }: {
            orientation: 'left' | 'right';
            progress: number;
            isEdgeGradient: boolean;
          }) => {
            const gradientClasses = isEdgeGradient
              ? `${
                  orientation === 'left'
                    ? 'bg-gradient-to-t md:bg-gradient-to-l'
                    : 'bg-gradient-to-b md:bg-gradient-to-r'
                } from-transparent to-[var(--background-1)]`
              : '';

            const baseClasses = `relative overflow-hidden rounded-b-full md:rounded-r-full h-16 w-[3px] md:w-full md:h-[3px] ${gradientClasses} bg-foreground-3`;

            return (
              <div className={`${baseClasses}`}>
                {/* Mobile vertical fill */}
                <div
                  className={`absolute md:hidden left-0 w-[3px] ${gradientClasses} bg-accent-red`}
                  style={{
                    bottom: orientation === 'left' ? 0 : undefined,
                    top: orientation === 'left' ? 0 : undefined,
                    height: `${progress * 100}%`
                  }}
                />
                {/* Desktop horizontal fill */}
                <div
                  className={`absolute hidden md:block top-0 left-0 h-[3px] ${gradientClasses} bg-accent-red`}
                  style={{
                    width: `${progress * 100}%`
                  }}
                />
              </div>
            );
          };

          return (
            <div key={`edge-${i}`} className="flex-1 flex flex-col gap-1 items-center md:flex-row">
              <HalfSegment orientation="left" progress={firstHalf} isEdgeGradient={i === 0} />
              {/* Dot */}
              <div
                className={`shrink-0 mx-[0.5px] w-3 h-3 rounded-full border-[1.5px] border-solid flex items-center justify-center ${
                  passed ? 'border-accent-red' : 'border-foreground-3'
                }`}
              >
                <div
                  className={`w-[6px] h-[6px] rounded-full ${
                    passed
                      ? 'border-accent-red bg-accent-red'
                      : 'border-foreground-3 bg-foreground-3'
                  }`}
                />
              </div>
              <HalfSegment
                orientation="right"
                progress={secondHalf}
                isEdgeGradient={i === graph.length - 1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
