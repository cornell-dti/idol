import { APICache } from "../Cache/Cache";
import { environment } from "../environment";
import axios from 'axios';

export type Member = {
  email: string,
  first_name: string,
  last_name: string,
  role: string
}

export class MembersAPI {

  public static getAllMembers(): Promise<Member[]> {
    let funcName = "getAllMembers";
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }
    else {
      let responseProm = axios.get(environment.backendURL + 'allMembers',
        {
          withCredentials: true
        })
        .then((res) => res.data);
      return responseProm.then((val) => {
        let mems = val.members as Member[];
        mems = mems.sort((a, b) => a.first_name < b.first_name ? -1 : 1);
        APICache.cache(funcName, mems);
        return mems;
      });
    }
  }

  public static setMember(member: Member): Promise<any> {
    return axios.post(environment.backendURL + 'setMember', member, {
      withCredentials: true
    }).then(res => res.data);
  }

  public static deleteMember(member: Member): Promise<any> {
    return axios.post(environment.backendURL + 'deleteMember', member, {
      withCredentials: true
    }).then(res => res.data);
  }

}