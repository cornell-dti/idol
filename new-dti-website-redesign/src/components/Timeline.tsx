//tells Next that this file must be bundled for the browser so client-only hooks will work
'use client';

import IconWrapper from '@/components/IconWrapper';
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
  const firstEventRef = useRef<HTMLDivElement | null>(null);
  const lastEventRef = useRef<HTMLDivElement | null>(null);
  const [lineLength, setLineLength] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /**
   * Calculates the percentage of progress through the events based on the current date.
   *
   * @remarks
   * This function sorts the events by date, calculates the total time span between the first
   * and last events, and determines how far along the current date is within that time span.
   * The result is a percentage that is used to fill the progress line on the timeline.
   *
   * @returns A number representing the percentage of progress (from 0 to 100).
   *
   * @example
   * ```ts
   * const progressPercentage = getProgressPercentage();
   * ```
   */
  const getProgressPercentage = () => {
    const sortedEvents = events.sort((a, b) => {
      const aDate = parseDate(a.date, '11:59:59 PM', a.time);
      const bDate = parseDate(b.date, '11:59:59 PM', b.time);
      return aDate.getTime() - bDate.getTime();
    });

    const currentEventIndex = sortedEvents.findIndex((event) => {
      const eventDate = parseDate(event.date, '11:59:59 PM', event.time);
      return eventDate > currentDate;
    });

    if (currentEventIndex === -1) {
      // All events are in the past
      return 100;
    }

    if (currentEventIndex === 0) {
      // Current date is before the first event
      return 0;
    }

    const lastCompletedEventDate = parseDate(
      sortedEvents[currentEventIndex - 1].date,
      '11:59:59 PM',
      sortedEvents[currentEventIndex - 1].time
    );
    const nextEventDate = parseDate(
      sortedEvents[currentEventIndex].date,
      '11:59:59 PM',
      sortedEvents[currentEventIndex].time
    );

    const segmentTimeSpan = nextEventDate.getTime() - lastCompletedEventDate.getTime();
    const timeElapsedInSegment = Math.max(
      0,
      currentDate.getTime() - lastCompletedEventDate.getTime()
    );
    const segmentProgress = (timeElapsedInSegment / segmentTimeSpan) * 100;

    const totalProgress = ((currentEventIndex - 1) / (sortedEvents.length - 1)) * 100;
    return Math.min(100, totalProgress + segmentProgress / (sortedEvents.length - 1));
  };

  const progressPercentage = getProgressPercentage();
  const { width } = useScreenSize();

  useLayoutEffect(() => {
    /**
     * Calculates the length of the line connecting the first and last events.
     *
     * @remarks
     * This function determines the position of the first and last event elements
     * on the page and calculates the distance between them, either vertically
     * (on mobile) or horizontally (on desktop). It updates the line length state accordingly.
     *
     * @returns A number representing the length of the line in pixels.
     *
     * @example
     * ```ts
     * calculateLineLength();
     * ```
     */
    const calculateLineLength = (mobile: boolean) => {
      if (events.length < 2) {
        setLineLength(0);
        return;
      }
      if (firstEventRef.current && lastEventRef.current) {
        const f = firstEventRef.current.getBoundingClientRect();
        const l = lastEventRef.current.getBoundingClientRect();
        const fC = { x: f.left + f.width / 2, y: f.top + f.height / 2 };
        const lC = { x: l.left + l.width / 2, y: l.top + l.height / 2 };
        setLineLength(
          mobile
            ? Math.abs(lC.y - fC.y)
            : Math.abs(lC.x - fC.x)
        );
      }
    };

    if (!width) return;
    //Thailwin 'sm' breakpoint is 640px
    const mobileNow = width < 640;
    setIsMobile(mobileNow);
    calculateLineLength(mobileNow);
  }, [isMobile, events.length]);

  const DotIcon = () => (
    <svg viewBox="0 0 10 10" className="w-2 h-2 fill-current">
      <circle cx="5" cy="5" r="5" />
    </svg>
  );

  return (
    <>
      <div className="flex flex-col min-h-[80vh] sm:min-h-0 items-start sm:flex-row sm:items-center justify-around relative">
        <div
          className="absolute flex flex-col items-center sm:flex-row "
          style={{
            height: isMobile ? `${lineLength}px` : '6px',
            width: isMobile ? '2px' : `${lineLength}px`,
            left: isMobile ? '65px' : '50%',
            transform: isMobile ? 'translateY(-10px)' : 'translateX(-51%) translateY(67px)'
          }}
        >
          <div className="absolute sm:h-2 h-full sm:w-full w-2 bg-gray-300 z-10" />
          <div
            className="absolute sm:h-1 h-full sm:w-full w-1 bg-red-500 z-20"
            style={{
              height: isMobile ? `${progressPercentage}%` : '6px',
              width: isMobile ? '2px' : `${progressPercentage}%`
            }}
          />
        </div>

        {events.map((event, idx) => {
          const eventDate = parseDate(event.date, '11:59:59 PM', event.time);
          const isPast = eventDate < currentDate;
          let eventRef = null;
          if (idx === 0) {
            eventRef = firstEventRef;
          } else if (idx === events.length - 1) {
            eventRef = lastEventRef;
          }

          return (
            <div
              key={idx}
              className="flex flex-row pl-[53px] space-x-10 sm:pl-0 sm:flex-col sm:items-center sm:justify-end sm:h-40 z-30"
              ref={eventRef}
            >
              {/* Mobile Dot */}
              <IconWrapper
                size="small"
                type={isPast ? 'primary' : 'default'}
                className="sm:hidden block"
              >
                <DotIcon />
              </IconWrapper>

              {/* Content */}
              <div className="sm:text-center sm:mb-4">
                <p className="font-bold lg:text-3xl text-xl">{event.title}</p>
                <div className="flex flex-row gap-x-2 sm:flex-col">
                  {event.time ? (
                    <p className="text-md lg:text-lg">{event.date} @ {event.time}</p>
                  ) : (
                    <p className="text-md lg:text-lg">{event.date}</p>
                  )}
                </div>
              </div>

              {/* Desktop Dot */}
              <IconWrapper
                size="small"
                type={isPast ? 'primary' : 'default'}
                className="hidden sm:block"
              >
                <DotIcon />
              </IconWrapper>
            </div>
          );
        })}
      </div>
    </>
  );
}
