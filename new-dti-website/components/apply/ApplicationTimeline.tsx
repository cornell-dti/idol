import { useState } from 'react';
import Image from 'next/image';
import config from '../../config.json';
import timelineIcons from './data/timelineIcons.json';
import { ibm_plex_mono } from '../../src/app/layout';
import useScreenSize from '../../src/hooks/useScreenSize';
import { LAPTOP_BREAKPOINT, TABLET_BREAKPOINT } from '../../src/consts';
import RedBlob from '../blob';
import { extractEndDate, extractEndTime, parseDate } from '../../src/utils/dateUtils';

type TabProps = {
  isSelected: boolean;
  text: string;
  onClick?: () => void;
};

const Tab: React.FC<TabProps> = ({ isSelected, text, onClick }) => (
  <div
    className={`flex items-center lg:px-5 lg:py-4 md:px-4 md:py-3 xs:px-2 md:rounded-t-xl xs:rounded-t-lg ${
      isSelected ? 'bg-[#FEFEFE] text-[#A52424]' : 'bg-[#7E2222CC] text-[#FEFEFE]'
    } hover:cursor-pointer md:h-min xs:h-full`}
    onClick={onClick}
  >
    <p className="font-bold lg:text-lg md:text-[13px] xs:text-[10px]">{text}</p>
  </div>
);

type DateTime = {
  date: string;
  isTentative: boolean;
  time?: string;
};

type RecruitmentEvent = {
  title: string;
  description: string;
  location?: string;
  type: string;
  link?: string;
  freshmen: DateTime;
  upperclassmen: DateTime;
  spring: DateTime;
};

/**
 * Find the end time of an DateTime as a number, regardless if the event is
 * tentative or not. If no time is specified, assume the end time is the last
 * second of the day.
 * @param dateTime the date and time of a recruitment event.
 * @requires date to be a single day or an interval, where the month is written out
 * with a space between the day (e.g. January 1). If an interval, separate the two dates with a hyphen.
 * @requires time to be an interval in 12-hour format (e.g. 12:00 PM) if defined.
 * If an interval, separate the two times with a hyphen.
 * @returns the number representation of the event's end time.
 */
const getEndTime = ({ date, time }: DateTime): number => {
  const endDate = extractEndDate(date);

  let endTime;
  if (time) {
    endTime = extractEndTime(time);
  }

  return parseDate(endDate, '11:59:59 PM', endTime).getTime();
};

type RecruitmentEventProps = {
  event: RecruitmentEvent;
  nextEventIndex: number;
  index: number;
  isLast: boolean;
  dateTime: DateTime;
};

const TimelineNode: React.FC<RecruitmentEventProps> = ({
  event,
  index,
  nextEventIndex,
  isLast,
  dateTime
}) => {
  const { width } = useScreenSize();
  const isNextEvent = index === nextEventIndex;
  let unselectedIconDim = 10;
  let selectedIconDim = 14;

  if (width >= LAPTOP_BREAKPOINT) {
    selectedIconDim = 28;
    unselectedIconDim = 18;
  } else if (width >= TABLET_BREAKPOINT) {
    selectedIconDim = 18;
    unselectedIconDim = 12;
  }

  const iconDim = isNextEvent ? selectedIconDim : unselectedIconDim;
  const timelineWidth = width >= TABLET_BREAKPOINT ? 22 : 12;

  return (
    <div
      className={`flex lg:gap-x-10 md:gap-x-7 xs:gap-x-3 md:mx-12 xs:mx-3 ${
        isNextEvent ? 'text-[#0C0404]' : 'text-[#727272]'
      }`}
    >
      <div className="flex flex-col items-center justify-center md:min-w-[70px] xs:min-w-[50px] relative">
        <svg
          width={timelineWidth}
          height="175"
          className="absolute bottom-[60px]"
          style={{ zIndex: 20 - index }}
        >
          <rect
            width={timelineWidth}
            height="175"
            x="0"
            y="0"
            fill={index <= nextEventIndex ? `#A52424` : '#3C3C3C'}
          />
        </svg>
        {isLast && (
          <svg width={timelineWidth} height="175" className="absolute z-0 bottom-[-50px]">
            <rect
              width={timelineWidth}
              height="175"
              x="0"
              y="0"
              fill={Date.now() > getEndTime(dateTime) ? `#A52424` : '#3C3C3C'}
            />
          </svg>
        )}
        <div
          className={`flex items-center justify-center w-[50px] h-[50px] ${
            isNextEvent
              ? 'md:w-[70px] md:h-[70px] bg-[#FEFEFE]'
              : 'md:w-[60px] md:h-[60px] bg-[#F5E3E3] '
          } rounded-xl md:border-8 xs:border-4 border-solid border-[#A52424D9] z-20`}
        >
          <Image
            src={timelineIcons[event.type as keyof typeof timelineIcons].src}
            alt={timelineIcons[event.type as keyof typeof timelineIcons].alt}
            width={width >= TABLET_BREAKPOINT ? 25 : 20}
            height={width >= TABLET_BREAKPOINT ? 25 : 20}
            className={isNextEvent ? 'scale-[1.5] brightness-0' : ''}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h2
          className={`font-bold ${
            isNextEvent
              ? 'lg:text-[32px] md:text-[22px] xs:text-[16px] lg:leading-[38px] xs:leading-[20px]'
              : 'lg:text-[22px] lg:leading-[26px] xs:text-[16px] xs:leading-[19px]'
          }`}
        >
          {event.title.toUpperCase()}
        </h2>
        <p className={`lg:text-lg lg:leading-[22px] xs:text-[12px] xs:leading-[15px]`}>
          {event.description}
        </p>
        <div
          className={`flex gap-4 xs:text-[10px] xs:leading-[15px] ${
            isNextEvent
              ? 'lg:text-[20px] lg:leading-[24px] md:text-[14px] md:leading-[17px]'
              : 'lg:text-[15px] lg:leading-[18px]'
          }`}
        >
          {event.location && (
            <div className="flex md:gap-2 xs:gap-1 items-center">
              <Image
                src="/icons/location.svg"
                alt="location"
                width={iconDim}
                height={iconDim}
                className={`${isNextEvent ? 'brightness-0' : ''}`}
              />
              <p className={event.link ? 'underline' : ''}>
                {event.link ? <a href={event.link}>{event.location}</a> : event.location}
              </p>
            </div>
          )}
          <div className="flex md:gap-2 xs:gap-1 items-center">
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              width={iconDim}
              height={iconDim}
              className={`${isNextEvent ? 'brightness-0' : ''}`}
            />
            <p>{`${dateTime.isTentative ? 'TBD' : dateTime.date}${
              dateTime.time ? `, ${dateTime.time}` : ''
            }`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationTimeline = () => {
  const [cycle, setCycle] = useState<'freshmen' | 'upperclassmen'>('freshmen');

  const season = config.semester.split(' ')[0].toLocaleLowerCase() as 'fall' | 'spring';
  const isFall = season === 'fall';

  const getDate = (event: RecruitmentEvent) => (isFall ? event[cycle] : event.spring);

  const filteredEvents: RecruitmentEvent[] = config.events.filter(
    (event) => getDate(event).date !== ''
  );

  const sortedEvents: RecruitmentEvent[] = filteredEvents.sort(
    (e1, e2) => getEndTime(getDate(e1)) - getEndTime(getDate(e2))
  );

  const nextEventIndex =
    1 + sortedEvents.findLastIndex((event) => getEndTime(getDate(event)) < Date.now());

  return (
    <div className="flex justify-center relative">
      <RedBlob intensity={0.5} className="left-[-150px] bottom-[-50px] z-0" />
      <div className="relative z-10 max-w-5xl w-full lg:px-0 md:px-[60px] xs:px-0">
        <div className="flex flex-col gap-6 my-12 text-white md:px-0 xs:px-6">
          <p className="font-semibold md:text-[32px] xs:text-[24px]">This is DTI.</p>
          <p className="md:font-semibold lg:text-[28px] xs:text-[20px]">
            Developing, designing, delivering.
          </p>
        </div>
        <div className="bg-white md:rounded-[20px] xs:rounded-lg">
          <div className="bg-[#A52424] md:rounded-t-[20px] xs:rounded-t-lg text-[#FEFEFE] flex justify-between">
            <p
              className={`md:py-[26px] md:pl-9 xs:py-5 xs:pl-3 lg:text-[22px] lg:leading-[28px] md:text-[16px] md:leading-[20px] 
                xs:text-[10px] xs:leading-[13px] ${ibm_plex_mono.className}`}
            >
              cornell-dti/timeline
            </p>
            <div className="flex items-end">
              {isFall ? (
                <>
                  <Tab
                    isSelected={cycle === 'freshmen'}
                    text={'Freshmen/Transfer'}
                    onClick={() => setCycle('freshmen')}
                  />
                  <Tab
                    isSelected={cycle === 'upperclassmen'}
                    text={'Upperclassmen'}
                    onClick={() => setCycle('upperclassmen')}
                  />
                </>
              ) : (
                <Tab isSelected={true} text={'All Students'} />
              )}
            </div>
          </div>
          <div
            className="flex flex-col md:gap-10 xs:gap-7 md:max-h-[600px] md:overflow-y-scroll 
            xs:overflow-y-hidden py-8"
          >
            {sortedEvents.map((event, index) => (
              <TimelineNode
                event={event}
                index={index}
                nextEventIndex={nextEventIndex}
                isLast={index === filteredEvents.length - 1}
                dateTime={getDate(event)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTimeline;
