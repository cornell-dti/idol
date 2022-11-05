import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

type TeamEventResponseObj = {
  Event: Event;
  error?: string;
};

export type EventAttendance = TeamEventAttendance;

export type Event = TeamEvent;

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

  public static requestTeamEventCredit(teamEvent: Event): Promise<TeamEventResponseObj> {
    // need to add image processing
    return APIWrapper.post(`${backendURL}/updateTeamEvent`, teamEvent).then(
      (res) => res.data.event
    );
  }

  public static async deleteTeamEventForm(uuid: string): Promise<void> {
    await APIWrapper.post(`${backendURL}/deleteTeamEvent`, { uuid });
  }

  public static updateTeamEventForm(teamEvent: Event): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/updateTeamEvent`, teamEvent).then(
      (rest) => rest.data.event
    );
  }
}
