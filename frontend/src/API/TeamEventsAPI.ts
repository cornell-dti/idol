import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

type TeamEventResponseObj = {
  teamEvent: TeamEvent;
  error?: string;
};

export type TeamEventAttendance = {
  member: IdolMember;
  hoursAttended?: number;
  image: string;
};

export type TeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  requests: TeamEventAttendance[];
  attendees: TeamEventAttendance[];
  uuid: string;
};

export class TeamEventsAPI {
  public static getAllTeamEvents(): Promise<TeamEvent[]> {
    const eventsProm = APIWrapper.get(`${backendURL}/getAllTeamEvents`).then((res) => res.data);
    return eventsProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all events",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      const events = val.events as TeamEvent[];
      return events;
    });
  }

  public static createTeamEventForm(teamEvent: TeamEvent): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/createTeamEvent`, teamEvent).then((res) => res.data);
  }

  public static requestTeamEventCredit(teamEvent: TeamEvent): Promise<TeamEventResponseObj> {
    // need to add image processing
    return APIWrapper.post(`${backendURL}/updateTeamEvent`, teamEvent).then(
      (res) => res.data.event
    );
  }
}
