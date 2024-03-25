import { memberCollection, coffeeChatsCollection } from '../firebase';
import { DBCoffeeChat } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';

async function materializeCoffeeChat(dbCoffeeChat: DBCoffeeChat): Promise<CoffeeChat> {
  const member1 = await getMemberFromDocumentReference(dbCoffeeChat.members[0]);
  const member2 = await getMemberFromDocumentReference(dbCoffeeChat.members[1]);

  return {
    ...dbCoffeeChat,
    members: [member1, member2]
  };
}

async function serializeCoffeeChat(coffeeChat: CoffeeChat): Promise<DBCoffeeChat> {
  const member1Data = await memberCollection.doc(coffeeChat.members[0].email);
  const member2Data = await memberCollection.doc(coffeeChat.members[1].email);

  return {
    ...coffeeChat,
    members: [member1Data, member2Data]
  };
}

export default class CoffeeChatDao extends BaseDao<CoffeeChat, DBCoffeeChat> {
  constructor() {
    super(coffeeChatsCollection, materializeCoffeeChat, serializeCoffeeChat);
  }

  /**
   * Gets the coffee chats
   * @param uuid - DB uuid of coffee chat
   */
  async getCoffeeChat(uuid: string): Promise<CoffeeChat | null> {
    return this.getDocument(uuid);
  }

  /**
   * Gets all coffee chats
   */
  async getAllCoffeeChats(): Promise<CoffeeChat[]> {
    return this.getDocuments();
  }
}
