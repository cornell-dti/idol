//tells Next that this file must be bundled for the browser so client-only hooks will work
'use client';

import useScreenSize from '@/hooks/useScreenSize';
import { parseDate } from '@/utils/dateUtils';
import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from './Timeline.module.css';

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
 * (mobile vs. desktop) via a useEffect and displays a progress line showing how far along the current date is relative to the events.
 * Each event includes a title, date, and time. The date string should be formatted with the month (abbreviated), day, and
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
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { width } = useScreenSize();
  const containerRef = useRef<HTMLDivElement>(null);

  // (Re-)compute progress whenever events or currentDate change
  useLayoutEffect(() => {
    if (events.length < 2) {
      setProgress(0);
      return;
    }
    // sort
    const sorted = [...events].sort((a, b) =>
      parseDate(a.date, '12:00 AM', a.time).getTime() -
      parseDate(b.date, '12:00 AM', b.time).getTime()
    );

    const times = sorted.map(e => parseDate(e.date, '12:00 AM', e.time).getTime());
    const start = times[0], end = times[times.length - 1];
    const now = currentDate.getTime();
    if (now <= start) {
      setProgress(0);
    } else if (now >= end) {
      setProgress(100);
    } else {
      setProgress(((now - start) / (end - start)) * 100);
    }
  }, [events, currentDate]);

  // Detect mobile vs desktop
  useLayoutEffect(() => {
    if (!width) return;
    setIsMobile(width < 640);
  }, [width]);

  // Helper to know if an event is passed
  const isPassed = (e: Event) => {
    return parseDate(e.date, '11:59:59 PM', e.time).getTime() <= currentDate.getTime();
  };

  return (
    <>
      <div ref={containerRef} className={`${styles.timeline}`}>
        {/* Events */}
        {events.map((ev, i) => (
          <div
            key={i}
            className={`${styles['timeline-event']} ${isPassed(ev) ? styles.passed : ''}  relative flex-1 flex flex-col items-center sm:items-center px-4`}>
            <div className={styles.content}>
              <div className="" >
                {/* Title */}
                <h3 className="h5 text-white font-semibold mb-1 text-center">{ev.title}</h3>
                {/* Date */}
                <p className="text-[var(--foreground-3,#A1A1A1)] mb-0">{ev.date} {ev.time ? ` · ${ev.time}` : ''}</p>
              </div>
              {/* Point + Ring */}
              <div className={`
              absolute
              ${isMobile
                  ? 'top-1/2 left-8 transform -translate-x-1/2 -translate-y-1/2'            // mobile: vertical center of container, x=2rem
                  : 'bottom-[calc(1rem-5px)] left-1/2 transform -translate-x-1/2'
                }
            `}>
                {/* outer ring */}
                <div
                  className={`w-[12px] h-[12px] rounded-full border-[1px] ${isPassed(ev) ? 'border-[var(--accent-Red,#FF575E)]' : 'border-[var(--foreground-3,#A1A1A1)]'}`}
                />
                {/* inner dot */}
                <div
                  className={`w-[6px] h-[6px] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                ${isPassed(ev) ? 'bg-[var(--accent-Red,#FF575E)]' : 'bg-[var(--foreground-3,#A1A1A1)]'}`} />
              </div>
            </div>
          </div>
        ))}


      </div>
    </>
  );
}
