import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

type TeamEventResponseObj = {
    teamEvent: TeamEvent;
    error?: string;
};

export type TeamEventAttendance = {
    member: IdolMember;
    hoursAttended?: number;
    image: string;
}

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
    public static requestTeamEventCredit(teamEvent: TeamEvent): Promise<TeamEventResponseObj> {
        // need to add image processing
        console.log("here")
        console.log(typeof(teamEvent));
        return APIWrapper.post(`${backendURL}/updateTeamEvent`, teamEvent).then((res) => res.data);
    }
}