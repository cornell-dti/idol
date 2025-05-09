import { backendURL } from '../environment';
import { Emitters } from '../utils';
import APIWrapper from './APIWrapper';

export default class CoffeeChatAPI {
  public static async createCoffeeChat(request: CoffeeChat): Promise<CoffeeChat> {
    return APIWrapper.post(`${backendURL}/coffee-chat`, request).then((res) => res.data.coffeeChat);
  }

  public static async getAllCoffeeChats(): Promise<CoffeeChat[]> {
    return APIWrapper.get(`${backendURL}/coffee-chat`).then((res) => res.data.coffeeChats);
  }

  public static async getCoffeeChatsByUser(user: IdolMember): Promise<CoffeeChat[]> {
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

  public static async updateCoffeeChat(coffeeChat: CoffeeChat): Promise<CoffeeChat> {
    return APIWrapper.put(`${backendURL}/coffee-chat`, coffeeChat).then(
      (res) => res.data.coffeeChat
    );
  }

  public static async deleteCoffeeChat(uuid: string): Promise<void> {
    if (!uuid) {
      return;
    }
    await APIWrapper.delete(`${backendURL}/coffee-chat/${uuid}`);
  }

  public static async archiveCoffeeChats(): Promise<void> {
    return APIWrapper.patch(`${backendURL}/coffee-chat/archive`).then((res) => {
      if (res.data.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't archive coffee chats",
          contentMsg: `Error: ${res.data.error}`
        });
      }
    });
  }

  public static async getCoffeeChatBingoBoard(): Promise<string[][]> {
    const res = await APIWrapper.get(`${backendURL}/coffee-chat-bingo-board`).then(
      (res) => res.data
    );
    return res.board as string[][];
  }

  public static async runAutoChecker(uuid: string): Promise<CoffeeChat> {
    return APIWrapper.put(`${backendURL}/coffee-chat/autocheck/${uuid}/`, {}).then(
      (res) => res.data.coffeeChat
    );
  }

  public static checkMemberMeetsCategory(
    otherMember: IdolMember,
    submitter: IdolMember,
    category: string
  ): Promise<MemberMeetsCategoryType> {
    const res = APIWrapper.get(
      `${backendURL}/coffee-chat/${otherMember.email}/${submitter.email}/${encodeURIComponent(
        category
      )}`
    ).then((res) => res.data);
    return res.then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't check if member meets category",
          contentMsg: `Error was: ${val.err}`
        });
        return { status: 'no data', message: '' };
      }
      const result = val.result as MemberMeetsCategoryType;
      return result;
    });
  }

  public static async getCoffeeChatSuggestions(email: string): Promise<CoffeeChatSuggestions> {
    return APIWrapper.get(`${backendURL}/coffee-chat-suggestions/${email}`).then(
      (res) => res.data.suggestions
    );
  }
}
