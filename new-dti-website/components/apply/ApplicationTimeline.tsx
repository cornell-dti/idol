import { useState } from 'react';
import config from '../../config.json';
import { ibm_plex_mono } from '../../src/app/layout';

type TabProps = {
  isSelected: boolean;
  text: string;
  onClick?: () => void;
};

const Tab: React.FC<TabProps> = ({ isSelected, text, onClick }) => (
  <div
    className={`px-5 py-4 rounded-t-xl ${
      isSelected ? 'bg-[#FEFEFE] text-[#A52424]' : 'bg-[#7E2222CC] text-[#FEFEFE]'
    } hover:cursor-pointer h-min`}
    onClick={onClick}
  >
    <p className="font-bold text-lg">{text}</p>
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
  location: string;
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
 * @requires date to be a single day or an interval with the month written out
 * @requires time to be an interval in 12-hour format if defined
 * @returns the number representation of the event's end time.
 */
const getEndTime = ({ date, time }: DateTime): number => {
  // Find end date
  const dates = date.split('-');
  let endDate = dates[dates.length - 1];

  if (endDate.length <= 2) {
    const month = dates[0].split(' ')[0];
    endDate = `${month} ${endDate}`;
  }

  // Find end time
  let endTime = '11:59:59 PM';
  if (time) {
    const end = time.split('-')[1];
    const endHourMin = end.substring(0, end.length - 2);
    const suffix = end.substring(end.length - 2);
    endTime = endTime + (endHourMin.indexOf(':') === -1 ? ':00 ' : ' ') + suffix;
  }

  return new Date(`${endDate}, ${new Date().getFullYear()} ${endTime}`).getTime();
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
  const isNextEvent = index === nextEventIndex;
  return (
    <div
      className={`flex gap-x-10 mx-12 ${isNextEvent ? 'text-[#0C0404] my-4' : 'text-[#727272]'}`}
    >
      <div className="flex flex-col items-center justify-center min-w-[64px] relative">
        <svg width="22" height="175" className="absolute z-10 bottom-[50px]">
          <rect
            width="22"
            height="175"
            x="0"
            y="0"
            fill={index <= nextEventIndex ? `#A52424` : '#3C3C3C'}
          />
        </svg>
        {isLast && (
          <svg width="22" height="175" className="absolute z-0 bottom-[-50px]">
            <rect
              width="22"
              height="175"
              x="0"
              y="0"
              fill={new Date().getTime() > getEndTime(dateTime) ? `#A52424` : '#3C3C3C'}
            />
          </svg>
        )}
        <div
          className={`${
            isNextEvent ? 'w-16 h-16 bg-[#FEFEFE]' : 'w-14 h-14 bg-[#F5E3E3] '
          } rounded-xl border-4 border-solid border-[#A52424D9] z-20`}
        />
      </div>
      <div className="flex flex-col gap-3">
        <h2
          className={`font-bold ${
            isNextEvent ? 'text-[32px] leading-[38px]' : 'text-[22px] leading-[26px]'
          }`}
        >
          {event.title.toUpperCase()}
        </h2>
        <p className="text-lg leading-[22px]">{event.description}</p>
        <div
          className={`flex gap-4 ${
            isNextEvent ? 'text-[20px] leading-[24px]' : 'text-[15px] leading-[18px]}'
          }`}
        >
          <p className={`${event.link ? 'underline' : ''}`}>
            {event.link ? <a href={event.link}>{event.location}</a> : event.location}
          </p>
          <p>{`${dateTime.isTentative ? 'TBD' : dateTime.date}${
            dateTime.time ? `, ${dateTime.time}` : ''
          }`}</p>
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
    1 + sortedEvents.findLastIndex((event) => getEndTime(getDate(event)) < new Date().getTime());

  return (
    <div className="flex justify-center mb-[200px]">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col gap-6 my-12 text-white">
          <p className="font-semibold text-[32px]">This is DTI.</p>
          <p className="text-[28px]">Developing, designing, delivering.</p>
        </div>
        <div className="bg-white rounded-[20px]">
          <div className="bg-[#A52424] rounded-t-[20px] text-[#FEFEFE] flex justify-between">
            <p className={`py-[26px] pl-9 text-[22px] leading-[28px] ${ibm_plex_mono.className}`}>
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
          <div className="flex flex-col gap-10 max-h-[600px] overflow-y-scroll py-8">
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
