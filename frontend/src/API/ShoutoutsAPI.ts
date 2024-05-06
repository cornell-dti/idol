import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import { Emitters } from '../utils';

type ShoutoutResponseObj = {
  shoutout: Shoutout;
  error?: string;
};

export default class ShoutoutsAPI {
  public static getAllShoutouts(): Promise<Shoutout[]> {
    const responseProm = APIWrapper.get(`${backendURL}/shoutout`).then((res) => res.data);
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

  public static createCoffeeChat(coffeeChat: CoffeeChat): Promise<CoffeeChat> {
    return APIWrapper.post(`http://localhost:3000/coffee-chat`, coffeeChat).then((res) => res.data);
  }

  public static getAllCoffeeChats(): Promise<CoffeeChat[]> {
    const coffeeChatProm = APIWrapper.get(`http://localhost:3000/coffee-chat`).then(
      (res) => res.data
    );
    return coffeeChatProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all coffee chats",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      const coffeeChats = val.coffeeChats as CoffeeChat[];
      return coffeeChats;
    });
  }

  public static getShoutouts(email: string, type: 'given' | 'received'): Promise<Shoutout[]> {
    const responseProm = APIWrapper.get(`${backendURL}/shoutout/${email}?type=${type}`).then(
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
    return APIWrapper.post(`${backendURL}/shoutout`, shoutout).then((res) => res.data);
  }

  public static hideShoutout(uuid: string, hide: boolean): Promise<void> {
    return APIWrapper.put(`${backendURL}/shoutout`, { uuid, hide }).then((res) => res.data);
  }

  public static async deleteShoutout(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/shoutout/${uuid}`);
  }
}
