import APICache from '../Cache/Cache';
import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import Emitters from '../EventEmitter/constant-emitters';
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
};

export class TeamsAPI {
  public static getAllTeams(): Promise<Team[]> {
    const funcName = 'getAllTeams';
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }

    const responseProm = APIWrapper.get(`${backendURL}/allTeams`).then(
      (res) => res.data
    );
    return responseProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all teams!",
          contentMsg: `Error was: ${val.error}`
        });
        return [];
      }
      let teams = val.teams as Team[];
      teams = teams.sort((a, b) => (a.name < b.name ? -1 : 1));
      APICache.cache(funcName, teams);
      return teams;
    });
  }

  public static setTeam(team: Team): Promise<TeamResponseObj> {
    return APIWrapper.post(`${backendURL}/setTeam`, team).then(
      (res) => res.data
    );
  }

  public static deleteTeam(team: Team): Promise<TeamResponseObj> {
    return APIWrapper.post(`${backendURL}/deleteTeam`, team).then(
      (res) => res.data
    );
  }
}
