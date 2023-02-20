import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

type TeamEventResponseObj = {
  Event: Event;
  error?: string;
};

export type EventAttendance = TeamEventAttendance;

export type Event = TeamEvent;

export type MemberTECRequests = {
  pending: TeamEventHoursInfo[];
  approved: TeamEventHoursInfo[];
};

export class TeamEventsAPI {
  public static getAllTeamEvents(): Promise<Event[]> {
    const eventsProm = APIWrapper.get(`${backendURL}/getAllTeamEvents`).then((res) => res.data);
    return eventsProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all events",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      const events = val.events as Event[];
      return events;
    });
  }

  public static getAllTeamEventInfo(): Promise<TeamEventInfo[]> {
    const res = APIWrapper.get(`${backendURL}/getAllTeamEventInfo`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all events",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      return val.allTeamEventInfo as TeamEventInfo[];
    });
  }

  public static getTeamEventForm(uuid: string): Promise<Event> {
    const eventProm = APIWrapper.get(`${backendURL}/getTeamEvent/${uuid}`).then((res) => res.data);
    return eventProm.then((val) => {
      const event = val.event as Event;
      return event;
    });
  }

  public static createTeamEventForm(teamEvent: Event): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/createTeamEvent`, teamEvent).then((res) => res.data);
  }

  public static async deleteTeamEventForm(teamEvent: Event): Promise<void> {
    await APIWrapper.post(`${backendURL}/deleteTeamEvent`, teamEvent);
  }

  public static updateTeamEventForm(teamEvent: Event): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/updateTeamEvent`, teamEvent).then(
      (rest) => rest.data.event
    );
  }

  public static async clearAllTeamEvents(): Promise<void> {
    await APIWrapper.delete(`${backendURL}/clearAllTeamEvents`);
  }

  public static async requestTeamEventCredit(
    uuid: string,
    request: TeamEventAttendance
  ): Promise<void> {
    APIWrapper.post(`${backendURL}/requestTeamEventCredit`, { uuid, request });
  }

  public static async getAllTeamEventsForMember(): Promise<MemberTECRequests> {
    return APIWrapper.get(`${backendURL}/getAllTeamEventsForMember`).then((val) => val.data);
  }
}
