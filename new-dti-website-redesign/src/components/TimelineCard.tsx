import { Ref } from 'react';
import Link from 'next/link';
import IconWrapper from './IconWrapper';
import LinkIcon from './icons/LinkIcon';
import CalendarIcon from './icons/CalendarIcon';
import ArrowIcon from './icons/ArrowIcon';
import PinIcon from './icons/PinIcon';
import { AlarmIcon, ChatIcon, LoudspeakerIcon, PencilIcon, WorkshopIcon } from './icons';
import PartyPopperIcon from './icons/PartyPopperIcon';

export type DateTime = {
  date: string;
  isTentative: boolean;
  time?: string;
};

export type RecruitmentEvent = {
  title: string;
  description: string;
  location?: string;
  type: string;
  link?: string;
  freshmen?: DateTime;
  upperclassmen?: DateTime;
  spring?: DateTime;
};

export enum Cycle {
  UPPERCLASSMEN = 'upperclassmen',
  FRESHMEN = 'freshmen',
  SPRING = 'spring'
}

const TimelineCard = ({
  event,
  cycle,
  ref
}: {
  event: RecruitmentEvent;
  cycle: Cycle;
  ref?: Ref<HTMLDivElement>;
}) => {
  if (!event[cycle]) return <></>;

  const icon = {
    application: <PencilIcon />,
    workshop: <WorkshopIcon />,
    info: <LoudspeakerIcon />,
    offer: <PartyPopperIcon />,
    deadline: <AlarmIcon />,
    interview: <ChatIcon />
  }[event.type];

  const datetime: DateTime = event[cycle]!;
  return (
    <div className="max-w-[504px] w-full" ref={ref}>
      <div className="flex flex-col gap-2 p-4 rounded-t-lg border border-border-1 border-b-transparent">
        <IconWrapper>{icon}</IconWrapper>
        <div className="flex flex-col gap-1">
          <h3 className="h5">{event.title}</h3>
          <p className="text-foreground-3">{event.description}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        {event.location &&
          (event.link ? (
            <Link
              href={event.link}
              target="_blank"
              className="flex justify-between md:w-1/2 p-4 md:rounded-bl-lg border border-border-1 md:border-r-0 border-b-0 md:border-b-1 hover:bg-background-2 underline underline-offset-3 focusState"
            >
              <div className="flex items-center gap-2">
                <LinkIcon size={16} />
                <p>{datetime.isTentative ? 'TBD' : event.location}</p>
              </div>
              <IconWrapper size="small">
                <ArrowIcon />
              </IconWrapper>
            </Link>
          ) : (
            <div className="flex items-center gap-2 md:w-1/2 p-4 md:rounded-bl-lg border border-border-1 md:border-r-0 border-b-0 md:border-b-1">
              <PinIcon size={16} decoration={true} />
              <p>{event.location}</p>
            </div>
          ))}
        <div
          className={`flex gap-2 items-center p-4 border border-border-1 rounded-b-lg ${
            event.location ? 'md:w-1/2  md:rounded-bl-none' : 'w-full'
          }`}
        >
          <CalendarIcon size={16} decoration={true} />
          <p>
            {datetime.date}
            {datetime.time ? `, ${datetime.time}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;
