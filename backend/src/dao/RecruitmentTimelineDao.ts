import { db } from '../firebase';

export type RecruitmentEventDate = {
  date: string;
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
}
