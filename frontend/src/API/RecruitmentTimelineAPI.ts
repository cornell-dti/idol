import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

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

export type RecruitmentTimelineWebsitePreview = {
  diff: string;
  hasChanges: boolean;
};

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

  public static createTimelineEvent(
    event: RecruitmentTimelineEvent
  ): Promise<RecruitmentTimelineEvent> {
    return APIWrapper.post(`${backendURL}/recruitment-timeline`, event).then(
      (res) => res.data.event as RecruitmentTimelineEvent
    );
  }

  public static async deleteTimelineEvent(id: string): Promise<void> {
    const response = await APIWrapper.delete(`${backendURL}/recruitment-timeline/${id}`);
    if (!response.status || response.status >= 400 || response.data?.error) {
      throw new Error(response.data?.error ?? 'Unable to delete recruitment timeline event.');
    }
  }

  public static async previewWebsiteChanges(): Promise<RecruitmentTimelineWebsitePreview> {
    const response = await APIWrapper.post(
      `${backendURL}/recruitment-timeline/website-preview`,
      {}
    );
    if (!response.status || response.status >= 400 || response.data?.error) {
      throw new Error(
        response.data?.error ?? 'Unable to preview recruitment timeline website changes.'
      );
    }

    return response.data as RecruitmentTimelineWebsitePreview;
  }

  public static async createWebsitePR(): Promise<void> {
    const response = await APIWrapper.post(
      `${backendURL}/recruitment-timeline/create-website-pr`,
      {}
    );
    if (
      !response.status ||
      response.status >= 400 ||
      response.data?.error ||
      !response.data.dispatched
    ) {
      throw new Error(
        response.data?.error ?? 'Unable to create recruitment timeline website pull request.'
      );
    }
  }
}
