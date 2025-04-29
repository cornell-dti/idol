import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import config from '../../config.json';
import timelineIcons from './data/timelineIcons.json';
import { ibm_plex_mono } from '../../src/app/layout';
import useScreenSize from '../../src/hooks/useScreenSize';
import { LAPTOP_BREAKPOINT, TABLET_BREAKPOINT } from '../../src/consts';
import { extractEndDate, extractEndTime, parseDate } from '../../src/utils/dateUtils';
import SectionWrapper from '../hoc/SectionWrapper';

type TabProps = {
  isSelected: boolean;
  text: string;
  onClick?: () => void;
  isSingleTab?: boolean;
};

const Tab: React.FC<TabProps> = ({ isSelected, text, onClick, isSingleTab }) => (
  <button
    className={`flex items-center lg:px-5 lg:py-4 md:px-4 md:py-3 xs:px-2 md:rounded-t-xl xs:rounded-t-lg ${
      isSelected ? 'bg-[#FEFEFE] text-[#A52424]' : 'text-[#FEFEFE]'
    } hover:cursor-pointer md:h-min xs:h-full ${
      isSingleTab ? '!bg-[#A52424] text-[#FEFEFE] !h-full' : ''
    }`}
    onClick={onClick}
    role="tab"
    tabIndex={isSelected ? 0 : -1}
    aria-selected={isSelected}
    aria-label="select tab"
  >
    <p className="font-bold lg:text-lg md:text-[13px] xs:text-[10px]" role="tabpanel">
      {text}
    </p>
  </button>
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

  return parseDate(
    `${endDate}, ${config.semester.split(' ')[1]}`,
    '11:59:59 PM',
    endTime
  ).getTime();
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
  let unselectedIconDim = 12;
  let selectedIconDim = 18;

  if (width >= LAPTOP_BREAKPOINT) {
    selectedIconDim = 34;
    unselectedIconDim = 20;
  }

  const iconDim = isNextEvent ? selectedIconDim : unselectedIconDim;

  return (
    <div
      className={`flex lg:gap-x-10 md:gap-x-7 xs:gap-x-3 md:mx-12 xs:mx-3 ${
        isNextEvent ? 'text-[#0C0404]' : 'text-[#727272]'
      }`}
    >
      <div className="flex flex-col items-center justify-center md:min-w-[70px] xs:min-w-[50px] relative">
        <svg
          width={6}
          height="175"
          className="absolute bottom-[60px]"
          style={{ zIndex: 20 - index }}
        >
          <rect
            width={6}
            height="175"
            x="0"
            y="0"
            fill={index <= nextEventIndex ? `#A52424` : '#3C3C3C'}
          />
        </svg>
        {isLast && (
          <svg width={6} height="175" className="absolute z-0 bottom-[-50px]">
            <rect
              width={6}
              height="175"
              x="0"
              y="0"
              fill={Date.now() > getEndTime(dateTime) ? `#A52424` : '#3C3C3C'}
            />
          </svg>
        )}
        <div
          className={`flex items-center justify-center w-[50px] h-[50px] bg-[#FEFEFE] ${
            isNextEvent ? 'md:w-[70px] md:h-[70px]' : 'md:w-[60px] md:h-[60px]'
          } rounded-xl md:border-6 xs:border-4 border-solid border-[#A52424] z-20`}
        >
          <Image
            src={timelineIcons[event.type as keyof typeof timelineIcons].src}
            alt={timelineIcons[event.type as keyof typeof timelineIcons].alt}
            width={28}
            height={28}
            className={isNextEvent ? 'scale-150' : ''}
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
          {event.title}
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
              <p className={event.link ? 'underline text-[#D63D3D]' : ''}>
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
  const [cycle, setCycle] = useState<'freshmen' | 'upperclassmen'>('upperclassmen');
  const [scroll, setScroll] = useState<number[]>([0, 0]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const selectedNodeRef = useRef<HTMLDivElement>(null);
  const { width } = useScreenSize();

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

  const scrollToIndex =
    nextEventIndex === sortedEvents.length ? nextEventIndex - 1 : nextEventIndex;

  const onTabSwitch = (nextTab: 'freshmen' | 'upperclassmen') => {
    if (nextTab === cycle) return;
    const tabIndex = cycle === 'upperclassmen' ? 0 : 1;
    setCycle(nextTab);
    if (timelineRef.current) {
      const newScroll = [...scroll];
      newScroll[tabIndex] = timelineRef.current.scrollTop;
      setScroll(newScroll);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isFall && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      onTabSwitch(cycle === 'freshmen' ? 'upperclassmen' : 'freshmen');
    }
  };

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = scroll[cycle === 'upperclassmen' ? 0 : 1];
    }
  }, [cycle, scroll]);

  useEffect(() => {
    if (timelineRef.current && selectedNodeRef.current && width >= TABLET_BREAKPOINT) {
      const innerDiv = selectedNodeRef.current.getBoundingClientRect().top;
      const outerDiv = timelineRef.current.getBoundingClientRect().top;
      timelineRef.current.scrollTop += innerDiv - outerDiv;
      setScroll([timelineRef.current.scrollTop, 0]);
    }
  }, [width]);

  return (
    <section id="Application Timeline" className="flex justify-center relative z-10">
      <SectionWrapper id={'Application Timeline'}>
        <div className="relative w-full">
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
              <div className="flex items-end" role="tablist" onKeyDown={handleKeyDown}>
                {isFall ? (
                  <>
                    <Tab
                      isSelected={cycle === 'upperclassmen'}
                      text={'Upperclassmen'}
                      onClick={() => onTabSwitch('upperclassmen')}
                    />
                    <Tab
                      isSelected={cycle === 'freshmen'}
                      text={'Freshmen/Transfer'}
                      onClick={() => onTabSwitch('freshmen')}
                    />
                  </>
                ) : (
                  <Tab isSelected={true} text={'All Students'} isSingleTab={true} />
                )}
              </div>
            </div>
            <div
              className="flex flex-col md:gap-10 xs:gap-7 md:max-h-[600px] md:overflow-y-scroll 
            xs:overflow-y-hidden py-8"
              ref={timelineRef}
            >
              {sortedEvents.map((event, index) => (
                <div key={index} ref={index === scrollToIndex ? selectedNodeRef : undefined}>
                  <TimelineNode
                    event={event}
                    index={index}
                    nextEventIndex={nextEventIndex}
                    isLast={index === filteredEvents.length - 1}
                    dateTime={getDate(event)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
};

export default ApplicationTimeline;
