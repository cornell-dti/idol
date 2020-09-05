import { APICache } from "../Cache/Cache";
import { environment } from "../environment";
import axios from 'axios';

export class RolesAPI {

  public static getAllRoles(): Promise<string[]> {
    let funcName = "getAllRoles";
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }
    else {
      let responseProm = axios.get(environment.backendURL + 'allRoles',
        {
          withCredentials: true
        })
        .then((res) => res.data);
      return responseProm.then((val) => {
        console.log(val);
        let mems = val.roles as string[];
        mems = mems.sort((a, b) => a < b ? -1 : 1);
        APICache.cache(funcName, mems);
        return mems;
      });
    }
  }

}