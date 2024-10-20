import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

export default class CoffeeChatAPI {
  public static async createCoffeeChat(request: CoffeeChat): Promise<CoffeeChat> {
    return APIWrapper.post(`${backendURL}/coffee-chat`, request).then((res) => res.data.coffeeChat);
  }

  public static async getAllCoffeeChatsByUser(user: IdolMember): Promise<CoffeeChat[]> {
    const res = APIWrapper.get(`${backendURL}/coffee-chat/${user.email}`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all coffee chats for this user",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      return val.coffeeChats as CoffeeChat[];
    });
  }

  public static async getValidCoffeeChatsByUser(user: IdolMember): Promise<CoffeeChat[]> {
    const pendingPromise = APIWrapper.get(`${backendURL}/coffee-chat/${user.email}?status=pending`).then((res) => res.data);
    const approvedPromise = APIWrapper.get(`${backendURL}/coffee-chat/${user.email}?status=approved`).then((res) => res.data);

    return Promise.all([pendingPromise, approvedPromise])
      .then(([pendingRes, approvedRes]) => {
        const pendingChats = pendingRes?.coffeeChats ?? [];
        const approvedChats = approvedRes?.coffeeChats ?? [];

        return [...pendingChats, ...approvedChats];
      })
      .catch((err) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all coffee chats for this user",
          contentMsg: `Error was: ${err.message || err}`,
        });
        return [];
      });
  }

  public static async getRejectedCoffeeChatsByUser(user: IdolMember): Promise<CoffeeChat[]> {
    const res = APIWrapper.get(`${backendURL}/coffee-chat/${user.email}?status=rejected`).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't get all coffee chats for this user",
          contentMsg: `Error was: ${val.err}`
        });
        return [];
      }
      return val.coffeeChats as CoffeeChat[];
    });
  }

  public static async deleteCoffeeChat(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/coffee-chat/${uuid}`);
  }
}
