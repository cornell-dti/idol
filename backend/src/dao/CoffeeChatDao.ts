import { v4 as uuidv4 } from 'uuid';
import { db, memberCollection, coffeeChatsCollection } from '../firebase';
import { DBCoffeeChat } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';
import { deleteCollection } from '../utils/firebase-utils';

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
   * Creates a new coffee chat for member
   * @param coffeeChat - Newly created CoffeeChat object.
   * If provided, the object uuid will be used. If not, a new one will be generated.
   * The pending field will be set to true by default.
   * A member can not create a coffee chat the same person from previous semesters
   */

  async createCoffeeChat(coffeeChat: CoffeeChat): Promise<CoffeeChat> {
    const coffeeChatWithUUID = {
      ...coffeeChat,
      status: 'pending' as Status,
      uuid: coffeeChat.uuid ? coffeeChat.uuid : uuidv4()
    };
    return this.createDocument(coffeeChatWithUUID.uuid, coffeeChatWithUUID);
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

  /**
   * Updates a coffee chat
   * @param coffeeChat - updated Coffee Chat object
   */
  async updateCoffeeChat(coffeeChat: CoffeeChat): Promise<CoffeeChat> {
    return this.updateDocument(coffeeChat.uuid, coffeeChat);
  }

  /**
   * Gets all coffee chat for a user
   * @param user - user whose coffee chats should be fetched
   */
  async getCoffeeChatsByUser(user: IdolMember): Promise<CoffeeChat[]> {
    return this.getDocuments([
      {
        field: 'member',
        comparisonOperator: '==',
        value: memberCollection.doc(user.email)
      }
    ]);
  }

  /**
   * Deletes a coffee chat
   * @param uuid - DB uuid of CoffeeChat
   */
  async deleteCoffeeChat(uuid: string): Promise<void> {
    await this.getDocuments();
  }

  /**
   * Deletes all coffee chats for all users
   */
  static async deleteAllCoffeeChat(): Promise<void> {
    await deleteCollection(db, 'coffee-chats', 500);
  }
}
