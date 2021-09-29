import { APICache, Emitters } from '../utils';
import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

export default class RolesAPI {
  public static getAllRoles(): Promise<Role[]> {
    const funcName = 'getAllRoles';
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }

    const responseProm = APIWrapper.get(`${backendURL}/allRoles`).then((res) => res.data);
    return responseProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all roles!",
          contentMsg: `Error was: ${val.error}`
        });
        return [];
      }
      let roles = val.roles as Role[];
      roles = roles.sort((a, b) => (a < b ? -1 : 1));
      APICache.cache(funcName, roles);
      return roles;
    });
  }
}
