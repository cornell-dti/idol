import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';
import { Emitters } from '../utils';
import { redirect } from 'next/dist/server/api-utils';

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
  public static getAllCoffeeChats(): Promise<CoffeeChat[]> {
    const responseProm = APIWrapper.get(`${backendURL}/coffee-chat`).then((res) => res.data);
    return responseProm.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all coffee chats",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      const chats = val.coffeeChats as CoffeeChat[];
      console.log('get all coffee chats length is');
      console.log(chats.length);
      console.log(chats);
      return chats;
    });
  }

  public static createCoffeeChat(coffeeChat: CoffeeChat): Promise<CoffeeChat> {
    return APIWrapper.post(`${backendURL}/coffee-chat`, coffeeChat).then((res) => {
      console.log('print msg in frontend createCoffeeChat');
      // console.log(res.data.coffeeChats);
      console.log(res.data.coffeeChats);
      return res.data.coffeeChats;
    });
  }

  public static async deleteCoffeeChat(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/coffee-chat/${uuid}`);
    //  return APIWrapper.delete(`${backendURL}/coffee-chat/${uuid}`).then((res) => {
    //   console.log("hello attempting to delete")
    //   console.log(res.data);
    //   return res.data.coffeeChats;
    // });
  }
  public static async clearAllCoffeeChats(): Promise<void> {
    await APIWrapper.delete(`${backendURL}/coffee-chat/`);
  }

  public static async getCoffeeChatsByUser(user: IdolMember): Promise<CoffeeChat[]> {
    const requestURL = `${backendURL}/coffee-chat/${user.email}`;
    console.log('Request URL:', requestURL);
    try {
      const res = await APIWrapper.get(`${backendURL}/coffee-chat/${user.email}`);
      console.log('API Response:', res.data);
      const val = res.data;

      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all coffee chats for this user",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }

      console.log('sup!!!');
      const chats = val.coffeeChats as CoffeeChat[];
      console.log('get USER coffee chats length is', chats.length);
      console.log(chats);
      return chats;
    } catch (error) {
      console.error('API Error:', error);
      Emitters.generalError.emit({
        headerMsg: 'Error retrieving coffee chats',
        contentMsg: `An error occurred`
      });
      return [];
    }
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

  public static async updateCoffeeChat(coffeeChat: CoffeeChat): Promise<CoffeeChat> {
    return APIWrapper.put(`${backendURL}/coffee-chat`, coffeeChat).then((res) => res.data);
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
