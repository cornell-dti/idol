import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import { Emitters } from '../utils';

type ShoutoutResponseObj = {
  shoutout: Shoutout;
  error?: string;
};

export default class ShoutoutsAPI {
  public static getAllShoutouts(options?: { throwOnError: boolean }): Promise<Shoutout[]> {
    const responseProm = APIWrapper.get(`${backendURL}/shoutout`).then((res) => res.data);
    return responseProm.then((val) => {
      if (options?.throwOnError && (!val || val.error)) {
        throw new Error(val?.error || 'Could not load shoutouts.');
      }
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all shoutouts",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      const shoutouts = val.shoutouts as Shoutout[];
      return shoutouts;
    });
  }

  public static getShoutouts(
    email: string,
    type: 'given' | 'received',
    options?: { throwOnError: boolean }
  ): Promise<Shoutout[]> {
    const responseProm = APIWrapper.get(`${backendURL}/shoutout/${email}?type=${type}`).then(
      (res) => res.data
    );
    return responseProm.then((val) => {
      if (options?.throwOnError && (!val || val.error)) {
        throw new Error(val?.error || 'Could not load shoutouts.');
      }
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: `Couldn't get ${type} shoutouts!`,
          contentMsg: `Error was: ${val.error}`
        });
        return [];
      }
      const shoutouts = val.shoutouts as Shoutout[];
      return shoutouts;
    });
  }

  public static giveShoutout(shoutout: Shoutout): Promise<ShoutoutResponseObj> {
    return APIWrapper.post(`${backendURL}/shoutout`, shoutout).then((res) => res.data);
  }

  public static hideShoutout(uuid: string, hide: boolean): Promise<void> {
    return APIWrapper.put(`${backendURL}/shoutout`, { uuid, hide }).then((res) => res.data);
  }

  public static updateShoutout(uuid: string, shoutout: Shoutout): Promise<ShoutoutResponseObj> {
    return APIWrapper.put(`${backendURL}/shoutout/${uuid}`, shoutout).then((res) => res.data);
  }

  public static async deleteShoutout(uuid: string): Promise<void> {
    const { data } = await APIWrapper.delete(`${backendURL}/shoutout/${uuid}`);
    if (data == null || data.error) {
      throw new Error(data?.error || 'Could not delete shoutout.');
    }
  }
}
