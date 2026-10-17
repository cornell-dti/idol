import type { RecruitmentEventDate, RecruitmentTimelineEvent } from '../dao/RecruitmentTimelineDao';

type Cycle = 'freshmen' | 'upperclassmen' | 'spring';

type WebsiteEventDate = {
  date: string;
  isTentative: boolean;
  time?: string;
};

export type WebsiteRecruitmentEvent = {
  title: string;
  description: string;
  location?: string;
  type: string;
  link?: string;
  freshmen?: WebsiteEventDate;
  upperclassmen?: WebsiteEventDate;
  spring?: WebsiteEventDate;
};

const cycles: Cycle[] = ['freshmen', 'upperclassmen', 'spring'];

const toWebsiteEventDate = (eventDate?: RecruitmentEventDate): WebsiteEventDate | undefined => {
  if (!eventDate) return undefined;

  return {
    date: eventDate.date,
    isTentative: eventDate.isTentative,
    ...(eventDate.time ? { time: eventDate.time } : {})
  };
};

const toWebsiteEvent = (event: RecruitmentTimelineEvent): WebsiteRecruitmentEvent => {
  const websiteEvent: WebsiteRecruitmentEvent = {
    title: event.title,
    description: event.description,
    ...(event.location ? { location: event.location } : {}),
    type: event.type,
    ...(event.link ? { link: event.link } : {})
  };

  cycles.forEach((cycle) => {
    const eventDate = toWebsiteEventDate(event[cycle]);
    if (eventDate) websiteEvent[cycle] = eventDate;
  });

  return websiteEvent;
};

const formatEventDate = (eventDate: WebsiteEventDate): string =>
  `{ "date": ${JSON.stringify(eventDate.date)}, "isTentative": ${eventDate.isTentative}${
    eventDate.time ? `, "time": ${JSON.stringify(eventDate.time)}` : ''
  } }`;

const formatEvent = (event: WebsiteRecruitmentEvent): string => {
  const fields = [
    `"title": ${JSON.stringify(event.title)}`,
    `"description": ${JSON.stringify(event.description)}`,
    ...(event.location ? [`"location": ${JSON.stringify(event.location)}`] : []),
    `"type": ${JSON.stringify(event.type)}`,
    ...(event.link ? [`"link": ${JSON.stringify(event.link)}`] : []),
    ...cycles.flatMap((cycle) =>
      event[cycle] ? [`"${cycle}": ${formatEventDate(event[cycle] as WebsiteEventDate)}`] : []
    )
  ];

  return `    {\n${fields
    .map((field, index) => `      ${field}${index === fields.length - 1 ? '' : ','}`)
    .join('\n')}\n    }`;
};

export const serializeRecruitmentTimelineEvents = (
  events: readonly RecruitmentTimelineEvent[]
): string => {
  const websiteEvents = [...events]
    .sort(
      (eventA, eventB) =>
        (eventA.order ?? Number.MAX_SAFE_INTEGER) - (eventB.order ?? Number.MAX_SAFE_INTEGER) ||
        eventA.title.localeCompare(eventB.title)
    )
    .map(toWebsiteEvent);

  return `{\n  "events": [\n${websiteEvents.map(formatEvent).join(',\n')}\n  ]\n}\n`;
};
