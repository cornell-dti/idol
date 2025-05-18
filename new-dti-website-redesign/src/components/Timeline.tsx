//tells Next that this file must be bundled for the browser so client-only hooks will work
'use client';

import useScreenSize from '@/hooks/useScreenSize';
import { parseDate } from '@/utils/dateUtils';
import React, { useLayoutEffect, useRef, useState } from 'react';

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
      <div ref={containerRef} className="relative w-full flex flex-col sm:flex-row items-center py-8">
        {/*Track*/}
        <div
          className={`absolute bg-gray-300`}
          style={
            isMobile
              ? { top: 0, bottom: 0, left: '2rem', width: '2px' }
              : { left: 0, right: 0, top: '3rem', height: '2px' }
          } />
        <div className={`absolute bg-red-500`}
          style={
            isMobile
              ? {
                top: 0,
                left: '2rem',
                width: '2px',
                height: `${progress}%`,
              }
              : {
                left: 0,
                top: '3rem',
                height: '2px',
                width: `${progress}%`,
              }
          } />

        {/* Events */}
        {events.map((ev, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center sm:items-center mb-8 sm:mb-0 px-4">
            {/* Title */}
            <h2 className="text-white font-semibold mb-1 text-center">{ev.title}</h2>
            {/* Date */}
            <h3>{ev.date} {ev.time ? ` · ${ev.time}` : ''}</h3>

            {/* Point + Ring */}
            <div className="relative">
              {/* outer ring */}
              <div
                className={`w-5 h-5 rounded-full border-2 ${isPassed(ev) ? 'border-red-500' : 'border-gray-300'}`}
              />
              {/* inner dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                ${isPassed(ev) ? 'bg-red-500' : 'bg-gray-300'}`} />
            </div>
          </div>
        ))}


      </div>
    </>
  );
}
