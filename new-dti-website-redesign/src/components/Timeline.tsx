'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import useScreenSize from '../hooks/useScreenSize';
import parseDate from '../utils/dateUtils';
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
  const [isMobile, setIsMobile] = useState(false);
  const { width } = useScreenSize();
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!width) return;
    setIsMobile(width < 640);
  }, [width]);

  const isPassed = (e: Event) =>
    parseDate(e.date, '11:59:59 PM', e.time).getTime() <= currentDate.getTime();

  return (
    <>
      <div className="flex flex-row-reverse justify-end md:flex-col gap-4 my-64">
        <div className="flex flex-col md:flex-row w-full">
          {events.map((event, index) => (
            <div
              className="flex-1 md:items-center md:justify-center flex flex-col min-h-32 pt-11 md:pt-0"
              key={index}
            >
              <h3 className="h5">{event.title}</h3>
              <p>{event.date}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row">
          {events.map((ev, index) => (
            <div className="flex-1 flex flex-col md:flex-row gap-2 items-center" key={index}>
              <div
                className={`${isPassed(ev) ? 'bg-accent-red' : 'bg-foreground-3'} md:h-[3px] h-full md:w-full w-[3px]`}
              />
              <div
                className={`${isPassed(ev) ? 'bg-accent-red' : 'bg-foreground-3'} min-h-4 min-w-4 rounded-full`}
              />
              <div
                className={`${isPassed(ev) ? 'bg-accent-red' : 'bg-foreground-3'} md:h-[3px] h-full md:w-full w-[3px]`}
              />
            </div>
          ))}
        </div>
      </div>

      <div ref={containerRef} className={`${styles.timeline}`}>
        {events.map((ev, i) => (
          <div
            key={i}
            className={`${styles['timeline-event']} ${
              isPassed(ev) ? styles.passed : ''
            } relative flex-1 flex flex-col items-center sm:items-center px-4`}
          >
            <div className={styles.content}>
              <div
                className={`${
                  isMobile
                    ? 'ml-4 mt-7'
                    : 'mt-0 absolute bottom-[calc(1rem+1.5px+76px)] left-1/2 transform -translate-x-1/2 text-center lg:whitespace-nowrap'
                }`}
              >
                <h3 className="h5 text-white font-semibold mb-1">{ev.title}</h3>
                <p className="text-[var(--foreground-3,#A1A1A1)]">
                  {ev.date} {ev.time ? ` · ${ev.time}` : ''}
                </p>
              </div>
              {/* Point + Ring */}
              <div
                className={`absolute ${
                  isMobile
                    ? 'top-1/2 left-8 transform -translate-x-1/2 -translate-y-1/2'
                    : 'bottom-[calc(1rem-4.5px+64px)] left-1/2 transform -translate-x-1/2' // 1rem (16px) + 1/2 track height (1.5px) -> 17.5px up from bottom -> 17.5px - 6px = 11.5px
                }`}
              >
                {/* outer ring */}
                <div
                  className={`w-3 h-3 rounded-full border-1 ${
                    isPassed(ev) ? 'border-accent-red' : 'border-foreground-3'
                  }`}
                />
                {/* inner dot */}
                <div
                  className={`w-[6px] h-[6px] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                    isPassed(ev) ? 'bg-accent-red' : 'bg-foreground-3'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
