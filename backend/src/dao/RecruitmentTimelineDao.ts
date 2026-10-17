import { db } from '../firebase';

export type RecruitmentEventDate = {
  date: string;
  sortDate?: string;
  time?: string;
  isTentative: boolean;
};

export type RecruitmentTimelineEvent = {
  id: string;
  title: string;
  description: string;
  location?: string;
  type: string;
  link?: string;
  order?: number;
  freshmen?: RecruitmentEventDate;
  upperclassmen?: RecruitmentEventDate;
  spring?: RecruitmentEventDate;
};

const recruitmentTimelineCollection = db.collection('recruitment-timeline-events');

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
    await recruitmentTimelineCollection.doc(id).delete();
  }
}
