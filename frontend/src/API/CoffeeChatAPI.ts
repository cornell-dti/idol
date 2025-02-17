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
      `${backendURL}/coffee-chat/${otherMember.email}/${submitter.email}/${encodeURIComponent(category)}`
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

  public static async archiveAllCoffeeChats(): Promise<void> {
    console.log('Sending request to archive all coffee chats...');
    await APIWrapper.post(`${backendURL}/coffee-chat/archive`, {});
    console.log('Request to archive all coffee chats sent.');
  }

  public static async unarchiveAllCoffeeChats(): Promise<void> {
    console.log('Sending request to unarchive all coffee chats...');
    await APIWrapper.post(`${backendURL}/coffee-chat/unarchive`, {});
    console.log('Request to unarchive all coffee chats sent.');
  }
}
