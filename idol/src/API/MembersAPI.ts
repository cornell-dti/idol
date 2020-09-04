import { APICache } from "../Cache/Cache";
import { environment } from "../environment";

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
      let responseProm = fetch(environment.backendURL + 'members/all', {
        credentials: "include",
        method: "get",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
        .then((res) => res.json());
      return responseProm.then((val) => {
        let mems = val.members as Member[];
        APICache.cache(funcName, mems);
        return mems;
      });
    }
  }

}