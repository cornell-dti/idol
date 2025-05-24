'use client';

// import React, { useLayoutEffect, useState } from 'react';
// import useScreenSize from '../hooks/useScreenSize';
import parseDate from '../utils/dateUtils';

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
  // const [isMobile, setIsMobile] = useState(false);
  // const { width } = useScreenSize();

  // useLayoutEffect(() => {
  //   if (!width) return;
  //   setIsMobile(width < 640);
  // }, [width]);

  const isPassed = (e: Event) =>
    parseDate(e.date, '11:59:59 PM', e.time).getTime() <= currentDate.getTime();

  return (
    <div className="flex flex-row-reverse justify-end md:flex-col gap-4 my-64">
      {/* Desktop: dates above */}
      <div className="flex flex-col md:flex-row w-full">
        {events.map((ev, i) => (
          <div key={i} className="flex-1 md:items-center md:justify-center flex flex-col">
            <h3 className="h5">{ev.title}</h3>
            <p className="text-[var(--foreground-3)]">
              {ev.date}
              {ev.time && ` · ${ev.time}`}
            </p>
          </div>
        ))}
      </div>
      {/* Line Row */}
      <div className="flex flex-col md:flex-row w-full">
        {events.map((ev, i) => {
          const passed = isPassed(ev);
          const base = passed ? 'bg-[var(--accent-red)]' : 'bg-[var(--foreground-3)]';

          //graident "from" var
          const fromVar = passed ? 'from-[var(--accent-red)]' : 'from-[var(--foreground-3)]';

          return (
            <div key={i} className="flex-1 flex items-center md:flex-col">
              {/* left segment (gradient on first) */}
              <div
                className={`rounded-b-full h-full w-[2px] md:rounded-b-none md:w-full md:h-[3px] md:rounded-r-full ${i === 0 ? `bg-gradient-to-t md:bg-gradient-to-l ${fromVar} to-transparent` : base
                  }`}
              />

              {/* outer ring */}
              <div
                className={`mx-[12px] w-[12px] h-[12px] rounded-full border-[1px] flex items-center justify-center ${passed ? 'border-[var(--accent-red)]' : 'border-[var(--foreground-3)]'
                  }`}
              >
                {/* dot */}
                <div
                  className={`w-[6px] h-[6px] rounded-full ${passed
                    ? 'border-[var(--accent-red)] bg-[var(--accent-red)]'
                    : 'border-[var(--foreground-3)] bg-[var(--foreground-3)]'
                    }`}
                />
              </div>

              {/* right segment (gradient on last) */}
              <div
                className={`w-[2px] h-full rounded-t-full md:rounded-t-none md:w-full  md:h-[3px] md:rounded-l-full ${i === events.length - 1
                  ? `bg-gradient-to-b md:bg-gradient-to-r ${fromVar} to-transparent`
                  : base
                  }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
