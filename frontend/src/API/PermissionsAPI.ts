import APICache from '../Cache/Cache';
import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

export default class PermissionsAPI {
  public static async isAdmin(): Promise<{ isAdmin: boolean }> {
    const funcName = 'isAdmin';
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }
    const res = await APIWrapper.get(`${backendURL}/isAdmin`);
    const isAdmin = res.data;
    APICache.cache(funcName, isAdmin);
    return isAdmin;
  }
}
