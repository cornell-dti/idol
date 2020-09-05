import { APICache } from "../Cache/Cache";
import { environment } from "../environment";
import { APIWrapper } from "./APIWrapper";
import { Emitters } from "../EventEmitter/constant-emitters";

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
      let responseProm = APIWrapper.get(environment.backendURL + 'allMembers',
        {
          withCredentials: true
        })
        .then((res) => res.data);
      return responseProm.then((val) => {
        if (val.error) {
          Emitters.generalError.emit({
            headerMsg: "Couldn't get all members!",
            contentMsg: "Error was: " + val.error
          });
          return [];
        }
        let mems = val.members as Member[];
        mems = mems.sort((a, b) => a.first_name < b.first_name ? -1 : 1);
        APICache.cache(funcName, mems);
        return mems;
      });
    }
  }

  public static setMember(member: Member): Promise<any> {
    return APIWrapper.post(environment.backendURL + 'setMember', member, {
      withCredentials: true
    }).then(res => res.data);
  }

  public static deleteMember(member: Member): Promise<any> {
    return APIWrapper.post(environment.backendURL + 'deleteMember', member, {
      withCredentials: true
    }).then(res => res.data);
  }

}