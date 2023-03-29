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
  pending: TeamEventInfo[];
  approved: TeamEventInfo[];
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

  public static createTeamEventForm(teamEventInfo: TeamEventInfo): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/createTeamEvent`, teamEventInfo).then((res) => res.data);
  }

  public static async deleteTeamEventForm(teamEvent: Event): Promise<void> {
    await APIWrapper.post(`${backendURL}/deleteTeamEvent`, teamEvent);
  }

  public static updateTeamEventForm(teamEventInfo: TeamEventInfo): Promise<TeamEventResponseObj> {
    return APIWrapper.post(`${backendURL}/updateTeamEvent`, teamEventInfo).then(
      (rest) => rest.data.event
    );
  }

  public static async clearAllTeamEvents(): Promise<void> {
    await APIWrapper.delete(`${backendURL}/clearAllTeamEvents`);
  }

  public static async requestTeamEventCredit(request: TeamEventAttendance): Promise<void> {
    // APIWrapper.post(`${backendURL}/requestTeamEventCredit`, { request });
  }

  public static async deleteTeamEventAttendance(uuid: string): Promise<void> {
    // await APIWrapper.post(`${backendURL}/deleteTeamEventAttendance`, uuid);
  }

  public static async updateTeamEventAttendance(
    teamEventAttendance: TeamEventAttendance
  ): Promise<TeamEventAttendance> {
    // return APIWrapper.post(`${backendURL}/updateTeamEventAttendance`, teamEventAttendance).then(
    //   (rest) => rest.data.event
    // );

    const mockMember: IdolMember = {
      netid: 'aa2235',
      email: 'aa2235@cornell.edu',
      firstName: 'Aira',
      lastName: 'Agrawal',
      pronouns: 'she/her',
      graduation: '2023',
      major: 'CS',
      hometown: 'Albany',
      about: 'idk',
      subteams: ['Idol'],
      role: 'developer',
      roleDescription: 'Developer'
    };
    const mockAttendance = {
      member: mockMember,
      hoursAttended: 1,
      image: '',
      eventUuid: '32286f81-ebaf-45f2-87a0-036801028a37',
      pending: false,
      uuid: 'attendance1'
    };
    return mockAttendance;
  }

  public static async getTeamEventAttendanceByUser(
    user: IdolMember
  ): Promise<TeamEventAttendance[]> {
    // const res = APIWrapper.get(`${backendURL}/getTeamEventAttendanceByUser`).then(
    //   (res) => res.data
    // );
    // return res.then((val) => {
    //   if (val.error) {
    //     Emitters.generalError.emit({
    //       headerMsg: "Couldn't get all team event attendance for this user",
    //       contentMsg: `Error was: ${val.err}`
    //     });
    //     return [];
    //   }
    //   const attendance = val.attendance as TeamEventAttendance[];
    //   return attendance;
    // });
    const mockMember: IdolMember = {
      netid: 'aa2235',
      email: 'aa2235@cornell.edu',
      firstName: 'Aira',
      lastName: 'Agrawal',
      pronouns: 'she/her',
      graduation: '2023',
      major: 'CS',
      hometown: 'Albany',
      about: 'idk',
      subteams: ['Idol'],
      role: 'developer',
      roleDescription: 'Developer'
    };
    const mockAttendance = {
      member: mockMember,
      hoursAttended: 1,
      image: '',
      eventUuid: '32286f81-ebaf-45f2-87a0-036801028a37',
      pending: true,
      uuid: 'attendance1'
    };
    return [mockAttendance];
  }
}
