import { useMemo, useState } from 'react';
import config from '../../config.json';
import { ibm_plex_mono } from '../../src/app/layout';

type TabProps = {
  isSelected: boolean;
  text: string;
  onClick: () => void;
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

type RecruitmentEvent = {
  title: string;
  description: string;
  location: string;
  link?: string;
  date: string;
  time?: string;
  cycles?: string[];
};

type RecruitmentEventProps = {
  event: RecruitmentEvent;
  nextEventIndex: number;
  index: number;
};

const TimelineNode: React.FC<RecruitmentEventProps> = ({ event, index, nextEventIndex }) => {
  const isNextEvent = index === nextEventIndex;
  return (
    <div
      className={`flex gap-x-10 mx-12 ${isNextEvent ? 'text-[#0C0404] my-4' : 'text-[#727272]'}`}
    >
      <div className="flex flex-col items-center justify-center min-w-[64px] relative">
        <svg width="22" height="175" className="absolute z-0 bottom-[50px]">
          <rect
            width="22"
            height="175"
            x="0"
            y="0"
            fill={index <= nextEventIndex ? `#A52424` : '#3C3C3C'}
          />
        </svg>
        <div
          className={`${
            isNextEvent ? 'w-16 h-16 bg-[#FEFEFE]' : 'w-14 h-14 bg-[#F5E3E3] '
          } rounded-xl border-4 border-solid border-[#A52424D9] z-20`}
        ></div>
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
          <p>{`${event.date}${event.time ? `, ${event.time}` : ''}`}</p>
        </div>
      </div>
    </div>
  );
};

const ApplicationTimeline = () => {
  const [timeline, setTimeline] = useState<string>(config.timeline.cycles[0]);

  const filteredEvents: RecruitmentEvent[] = useMemo(
    () =>
      config.timeline.events.filter((event) => !event.cycles || event.cycles.includes(timeline)),
    [timeline]
  );

  const getEndTime = (eventDay: string, eventTime?: string): number => {
    let time = '11:59:59 PM';
    if (eventTime) {
      const end = eventTime.split('-')[1];
      const endTime = end.substring(0, end.length - 2);
      const suffix = end.substring(end.length - 2);
      time = endTime + (endTime.indexOf(':') === -1 ? ':00 ' : ' ') + suffix;
    }

    return new Date(`${eventDay}, ${new Date().getFullYear()} ${time}`).getTime();
  };

  const nextEventIndex =
    1 +
    filteredEvents.findLastIndex(
      (event) => getEndTime(event.date, event.time) < new Date().getTime()
    );

  return (
    <div className="flex justify-center">
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
            {config.timeline.cycles.length !== 1 && (
              <div className="flex items-end">
                {config.timeline.cycles.map((cycle) => (
                  <Tab
                    isSelected={timeline === cycle}
                    text={cycle}
                    onClick={() => setTimeline(cycle)}
                    key={cycle}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-10 max-h-[600px] overflow-y-scroll py-8">
            {filteredEvents.map((event, index) => (
              <TimelineNode event={event} index={index} nextEventIndex={nextEventIndex} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTimeline;
