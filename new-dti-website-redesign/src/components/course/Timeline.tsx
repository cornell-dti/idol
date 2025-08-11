'use client';

import parseDate from '../../utils/dateUtils';

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
  const isPassed = (e: Event) =>
    parseDate(e.date, '11:59:59 PM', e.time).getTime() <= currentDate.getTime();

  // const graph = 
  // date - > next date (date or null) , weight -> percent passed (100% if both date and next date are passed, 50% if it is halfway between the two dates, 0% if the date is currently date or if date is not passed, etc.)
  const graph = (() => {
    // Normalize and sort events by actual Date
    const withDates = events
      .map((e) => ({
        ...e,
        _date: parseDate(e.date, '11:59:59 PM', e.time),
      }))
      .sort((a, b) => a._date.getTime() - b._date.getTime());

    // Helper to compute progress between two dates
    const calcProgress = (start: Date, end: Date, now: Date) => {
      const startMs = start.getTime();
      const endMs = end.getTime();
      const nowMs = now.getTime();

      if (nowMs <= startMs) return 0; // not started
      if (nowMs >= endMs) return 1;   // fully done
      const denom = Math.max(1, endMs - startMs);
      return (nowMs - startMs) / denom;
    };

    type Edge = {
      title: string;
      date: Date;
      nextTitle: string | null;
      nextDate: Date | null;
      weight: number;     // 0..1
      percent: number;    // 0..100
    };

    const edges: Edge[] = withDates.map((node, i) => {
      const next = i < withDates.length - 1 ? withDates[i + 1] : null;

      // Rules:
      // - If next exists: weight = progress from node._date to next._date clamped [0,1]
      // - If next doesn't exist:
      //     - If now <= node._date => 0
      //     - Else => 1 (treat last segment as complete once past its node)
      let weight = 0;

      if (next) {
        weight = calcProgress(node._date, next._date, currentDate);
      } else {
        // No next event
        weight = currentDate.getTime() <= node._date.getTime() ? 0 : 1;
      }

      return {
        title: node.title,
        date: node._date,
        nextTitle: next ? next.title : null,
        nextDate: next ? next._date : null,
        weight,
        percent: Math.round(weight * 100),
      };
    });

    return edges;
  })();


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
        {graph.map((edge, i) => {
          // Clamp defensively
          const w = Math.max(0, Math.min(1, edge.weight));

          // First half progress (0..1), second half progress (0..1)
          const firstHalf = Math.min(1, w / 0.5);
          const secondHalf = w <= 0.5 ? 0 : Math.min(1, (w - 0.5) / 0.5);

          // Dot passed state (optional: replace with your parseDate-based logic if you prefer)
          const passed = w >= 1;

          const base = passed ? 'bg-accent-red' : 'bg-foreground-3';
          const fromVar = passed ? 'from-accent-red' : 'from-foreground-3';

          // Helper to render a half segment with partial fill
          // orientation: 'left' (above on mobile, left on desktop) or 'right' (below/top, right on desktop)
          const HalfSegment = ({
            orientation,
            progress,
            isEdgeGradient,
          }: {
            orientation: 'left' | 'right';
            progress: number; // 0..1
            isEdgeGradient: boolean; // apply gradient fade on the outermost end
          }) => {
            // Base container for the half
            const baseClasses =
              'relative overflow-hidden rounded-b-full md:rounded-r-full h-16 w-[3px] md:w-full md:h-[3px] bg-foreground-3';

            // Add gradient fade only for the very first left half and very last right half
            const gradient =
              isEdgeGradient
                ? `${orientation === 'left'
                  ? 'bg-gradient-to-t md:bg-gradient-to-l'
                  : 'bg-gradient-to-b md:bg-gradient-to-r'} ${fromVar} to-transparent`
                : '';

            return (
              <div className={`${baseClasses} ${gradient}`}>
                {/* Red overlay sized by progress */}
                {/* Mobile (vertical): control height; Desktop (horizontal): control width */}
                {/* Left half fills upward on mobile, left-to-right on desktop */}
                {/* Right half fills downward on mobile, left-to-right on desktop for simplicity */}
                {/* Mobile overlay */}
                <div
                  className={`absolute md:hidden left-0 bg-accent-red w-[3px]`}
                  style={{
                    // Left half grows from bottom up
                    // Right half grows from top down
                    bottom: orientation === 'left' ? 0 : undefined,
                    top: orientation === 'right' ? 0 : undefined,
                    height: `${progress * 100}%`,
                  }}
                />
                {/* Desktop overlay */}
                <div
                  className={`absolute hidden md:block top-0 left-0 h-[3px] bg-accent-red`}
                  style={{
                    // Grow left-to-right for both halves on desktop
                    width: `${progress * 100}%`,
                  }}
                />
              </div>
            );
          };

          return (
            <div key={i} className="flex-1 flex flex-col gap-1 items-center md:flex-row">
              {/* LEFT HALF (first 50% of the edge length) */}
              <HalfSegment
                orientation="left"
                progress={firstHalf}
                isEdgeGradient={i === 0}
              />

              {/* DOT */}
              <div
                className={`shrink-0 mx-[0.5px] w-3 h-3 rounded-full border-[1.5px] border-solid flex items-center justify-center ${passed ? 'border-accent-red' : 'border-foreground-3'
                  }`}
              >
                <div
                  className={`w-[6px] h-[6px] rounded-full ${passed ? 'border-accent-red bg-accent-red' : 'border-foreground-3 bg-foreground-3'
                    }`}
                />
              </div>

              {/* RIGHT HALF (second 50% of the edge length) */}
              <HalfSegment
                orientation="right"
                progress={secondHalf}
                isEdgeGradient={i === events.length - 1}
              />
            </div>
          );
        })}
      </div>

    </div>
  );
}
