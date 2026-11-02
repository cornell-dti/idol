/// <reference types="common-types" />

import { db } from '../firebase';
import { NotFoundError } from '../utils/errors';

const recruitmentTimelineCollection = db.collection('recruitment-timeline-events');
const cycles = ['freshmen', 'upperclassmen', 'spring'] as const;

const convertTo24Hr = (time: string): string => {
  const match = time.match(/^(\d{1,2})(?::(\d{2}))?(AM|PM)$/i);
  if (!match) throw new Error('Invalid time');

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? '00');
  if (hour < 1 || hour > 12 || minute > 59) throw new Error('Invalid time');
  if (match[3].toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (match[3].toUpperCase() === 'AM' && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const validateTimeRange = (time: string): void => {
  const match = time.match(/^(.+?)-(.+?)(AM|PM)$/i);
  if (!match) throw new Error('Time must be a range, such as 9:00am-12:00pm.');

  const [, startRaw, endRaw, meridiem] = match;
  const start = startRaw.match(/AM|PM/i) ? startRaw : startRaw + meridiem;
  const end = endRaw + meridiem;
  convertTo24Hr(start);
  convertTo24Hr(end);
};

const validateTimelineEvent = (
  event: Omit<RecruitmentTimelineEvent, 'id'> & Partial<Pick<RecruitmentTimelineEvent, 'id'>>
): void => {
  (['title', 'description', 'type'] as const).forEach((field) => {
    if (typeof event[field] !== 'string' || !event[field].trim()) {
      throw new Error(`${field} cannot be empty.`);
    }
  });

  const selectedCycles = cycles.filter((cycle) => event[cycle]);
  if (selectedCycles.length === 0) {
    throw new Error('At least one recruitment cycle is required.');
  }

  selectedCycles.forEach((cycle) => {
    const eventDate = event[cycle]!;
    if (
      typeof eventDate.date !== 'string' ||
      !eventDate.date.trim() ||
      typeof eventDate.sortDate !== 'string' ||
      !eventDate.sortDate.trim()
    ) {
      throw new Error(`A start date is required for the ${cycle} cycle.`);
    }
    if (eventDate.endDate && eventDate.endDate < eventDate.sortDate) {
      throw new Error(`The end date cannot be before the start date for the ${cycle} cycle.`);
    }
    if (eventDate.time) {
      if (typeof eventDate.time !== 'string')
        throw new Error(`Invalid time for the ${cycle} cycle.`);
      validateTimeRange(eventDate.time);
    }
  });
};

const slugify = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default class RecruitmentTimelineDao {
  static async getAllRecruitmentTimelineEvents(): Promise<RecruitmentTimelineEvent[]> {
    const eventRefs = await recruitmentTimelineCollection.get();
    return eventRefs.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<RecruitmentTimelineEvent, 'id'>)
      }))
      .sort((eventA, eventB) => (eventA.order ?? 0) - (eventB.order ?? 0));
  }

  static async createTimelineEvent(
    event: Omit<RecruitmentTimelineEvent, 'id'> & Partial<Pick<RecruitmentTimelineEvent, 'id'>>
  ): Promise<RecruitmentTimelineEvent> {
    validateTimelineEvent(event);
    const { id, ...eventData } = event;
    const order =
      id && typeof eventData.order === 'number'
        ? eventData.order
        : (await this.getAllRecruitmentTimelineEvents()).reduce(
            (highestOrder, timelineEvent) => Math.max(highestOrder, timelineEvent.order ?? -1),
            -1
          ) + 1;
    const eventRef = recruitmentTimelineCollection.doc(id || `${order}-${slugify(event.title)}`);
    const savedEvent = { ...eventData, order };

    await eventRef.set(savedEvent);
    return { id: eventRef.id, ...savedEvent };
  }

  static async deleteTimelineEvent(id: string): Promise<void> {
    const eventRef = recruitmentTimelineCollection.doc(id);

    await db.runTransaction(async (transaction) => {
      const event = await transaction.get(eventRef);
      if (!event.exists) {
        throw new NotFoundError(`Recruitment timeline event with ID ${id} does not exist.`);
      }

      transaction.delete(eventRef);
    });
  }
}
