import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import { Emitters } from '../utils';

type ShoutoutResponseObj = {
  shoutout: Shoutout;
  error?: string;
};

export default class ShoutoutsAPI {
  public static getAllShoutouts(): Promise<Shoutout[]> {
    const responseProm = APIWrapper.get(`${backendURL}/allShoutouts`).then((res) => res.data);
    return responseProm.then((val) => {
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

  public static getShoutouts(email: string, type: 'given' | 'received'): Promise<Shoutout[]> {
    const responseProm = APIWrapper.get(`${backendURL}/getShoutouts/${email}/${type}`).then(
      (res) => res.data
    );
    return responseProm.then((val) => {
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
    return APIWrapper.post(`${backendURL}/giveShoutout`, shoutout).then((res) => res.data);
  }

  public static hideShoutout(uuid: string, hide: boolean): Promise<void> {
    return APIWrapper.post(`${backendURL}/hideShoutout`, { uuid, hide }).then((res) => res.data);
  }
}
