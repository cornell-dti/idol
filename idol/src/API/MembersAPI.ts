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
    let funcName = this.name;
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }
    else {
      let responseProm = axios.get(environment.backendURL + 'members/all',
        {
          withCredentials: true
        })
        .then((res) => res.data());
      return responseProm.then((val) => {
        let mems = val.members as Member[];
        APICache.cache(funcName, mems);
        return mems;
      });
    }
  }

}