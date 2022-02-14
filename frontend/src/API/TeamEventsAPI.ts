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

  public static createTeamEventForm(Event: Event): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/createTeamEvent`, Event).then((res) => res.data);
  }

  public static requestTeamEventCredit(Event: Event): Promise<TeamEventResponseObj> {
    // need to add image processing
    return APIWrapper.post(`${backendURL}/updateTeamEvent`, Event).then(
      (res) => res.data.event
    );
  }
}
