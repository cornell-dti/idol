import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

export default class RecruitmentTimelineAPI {
  public static getAllRecruitmentTimelineEvents(): Promise<RecruitmentTimelineEvent[]> {
    return APIWrapper.get(`${backendURL}/recruitment-timeline`)
      .then((res) => res.data)
      .then((val) => {
        if (val.error) {
          Emitters.generalError.emit({
            headerMsg: "Couldn't get recruitment timeline events",
            contentMsg: `Error was: ${val.error}`
          });
          return [];
        }

        return Array.isArray(val.events) ? (val.events as RecruitmentTimelineEvent[]) : [];
      });
  }
}
