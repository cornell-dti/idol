import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import { Member } from './MembersAPI';

type TeamResponseObj = {
  team: Team;
  error?: string;
};

export type Team = {
  name: string;
  leaders: Member[];
  members: Member[];
  uuid?: string;
  formerMembers: Member[];
};

export class TeamsAPI {
  public static setTeam(team: Team): Promise<TeamResponseObj> {
    return APIWrapper.post(`${backendURL}/setTeam`, team).then((res) => res.data);
  }

  public static deleteTeam(team: Team): Promise<TeamResponseObj> {
    return APIWrapper.post(`${backendURL}/deleteTeam`, team).then((res) => res.data);
  }
}
