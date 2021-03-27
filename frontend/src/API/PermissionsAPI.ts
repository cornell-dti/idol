import APICache from '../Cache/Cache';
import { backendURL } from '../environment';
import PermissionsError from '../Errors/PermissionsError';
import APIWrapper from './APIWrapper';

export default class PermissionsAPI {
  public static async isAdmin(email: string): Promise<{ isAdmin: boolean }> {
    const funcName = 'isAdmin';
    if (APICache.has(funcName)) {
      return Promise.resolve(APICache.retrieve(funcName));
    }
    const res = await APIWrapper.get(`${backendURL}/isAdmin/${email}`);
    const isAdmin = res.data;
    if (!isAdmin.isAdmin) {
      throw new PermissionsError(isAdmin);
    }
    APICache.cache(funcName, isAdmin);
    return isAdmin;
  }
}
