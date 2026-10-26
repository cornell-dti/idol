import { db } from '../firebase';

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
