import React, { useLayoutEffect, useRef, useState } from 'react';

// * TYPES
export type Event = {
  title: string;
  date: string;
  time: string;
};

// * INTERFACE
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
  const calculateLineLength = () => {
    if (events.length === 1 || events.length === 0) {
      setLineLength(0);
      return;
    }
    if (firstEventRef.current && lastEventRef.current) {
      const firstPos = firstEventRef.current.getBoundingClientRect();
      const lastPos = lastEventRef.current.getBoundingClientRect();

      const firstCenter = {
        x: firstPos.left + firstPos.width / 2,
        y: firstPos.top + firstPos.height / 2
      };

      const lastCenter = {
        x: lastPos.left + lastPos.width / 2,
        y: lastPos.top + lastPos.height / 2
      };

      if (isMobile) {
        const verticalDistance = Math.abs(lastCenter.y - firstCenter.y);
        setLineLength(verticalDistance);
      } else {
        const horizontalDistance = Math.abs(lastCenter.x - firstCenter.x);
        setLineLength(horizontalDistance);
      }
    }
  };

  /**
   * Parses an event's date and time to a `Date` object.
   *
   * @remarks
   * This function converts a date string (formatted as `MMM DD`) and an optional time string (formatted as `hh:mm AM/PM`)
   * into a JavaScript `Date` object. If no time is provided, the default time is 12:00 AM. The year is automatically
   * set to the current year if no year is provided, so ensure that the date values are formatted properly.
   *
   * @param dateStr - The date string of the event in the format `MMM DD, YYYY` (e.g., "Feb 19, 2024"). MONTH NOT REQUIRED TO BE ABBREVIATED
   * @param timeStr - (Optional) The time of the event in the format `hh:mm AM/PM` (e.g., "12:00 PM EST").
   *
   * @returns A `Date` object corresponding to the event's date and time.
   *
   * @example
   * ```ts
   * const eventDate = parseEventDate("Feb 19", "7:30 PM");
   * ```
   */
  const parseEventDate = (dateStr: string, timeStr: string) => {
    const currentYear = new Date().getFullYear();
    const date = new Date(`${dateStr} ${currentYear} ${timeStr || '12:00 AM'}`);
    return date;
  };

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
   */ const getProgressPercentage = () => {
    const sortedEvents = events.sort((a, b) => {
      const aDate = parseEventDate(a.date, a.time);
      const bDate = parseEventDate(b.date, b.time);
      return aDate.getTime() - bDate.getTime();
    });

    const firstEventDate = parseEventDate(sortedEvents[0].date, sortedEvents[0].time);
    const lastEventDate = parseEventDate(
      sortedEvents[sortedEvents.length - 1].date,
      sortedEvents[sortedEvents.length - 1].time
    );

    const totalTimeSpan = lastEventDate.getTime() - firstEventDate.getTime();
    const timeElapsed = Math.max(0, currentDate.getTime() - firstEventDate.getTime());
    const progress = (timeElapsed / totalTimeSpan) * 100;

    return Math.min(100, Math.max(0, progress));
  };

  const progressPercentage = getProgressPercentage();

  // * Use Layout Effect to Handle resizing of the Timeline
  useLayoutEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      calculateLineLength();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, calculateLineLength, lineLength]);

  return (
    <>
      <div className="flex flex-col min-h-[80vh] sm:min-h-0 items-start sm:flex-row sm:items-center justify-around relative">
        <div
          className="absolute flex flex-col items-center sm:flex-row "
          style={{
            height: isMobile ? `${lineLength}px` : '6px',
            width: isMobile ? '2px' : `${lineLength}px`,
            left: isMobile ? '65px' : '50%', // This Centers it horizontally on non-mobile
            transform: isMobile ? 'translateY(-10px)' : 'translateX(-50%) translateY(67px)' // Use this to fine tune position
          }}
        >
          <div className="absolute sm:h-2 h-full sm:w-full w-2 bg-gray-300 z-10" />
          <div
            className="absolute sm:h-1 h-full sm:w-full w-1 bg-[#D63D3D] z-20"
            style={{
              height: `calc(${progressPercentage}% + 1px)`,
              width: isMobile ? '6px' : `${progressPercentage}%`
            }}
          />
        </div>

        {events.map((event, idx) => {
          const eventDate = parseEventDate(event.date, event.time);
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
              {/* Red Dot for Completed / Grey Dot for Mobile */}
              <div
                className={`w-[26px] h-[26px] rounded-full ${
                  isPast ? 'bg-[#D63D3D]' : 'bg-gray-300'
                } sm:hidden block`}
              />
              {/* Title and Date */}
              <div className="sm:text-center sm:mb-4">
                <p className="font-extrabold lg:text-3xl text-xl">{event.title}</p>
                <div className="flex flex-row gap-x-2 sm:flex-col">
                  <p className="text-md lg:text-lg">{event.date}</p>
                  <p className="text-md lg:text-lg">{event.time}</p>
                </div>
              </div>
              {/* Red Dot for Completed / Grey Dot for Tablet/Laptop */}
              <div
                className={`w-[26px] h-[26px] rounded-full ${
                  isPast ? 'bg-[#D63D3D]' : 'bg-gray-300'
                } hidden sm:block`}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
