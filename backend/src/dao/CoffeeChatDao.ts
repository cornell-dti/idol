import { v4 as uuidv4 } from 'uuid';
import { memberCollection, coffeeChatsCollection, db } from '../firebase';
import { DBCoffeeChat } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao from './BaseDao';
import { deleteCollection } from '../utils/firebase-utils';
import { COFFEE_CHAT_BINGO_BOARD } from '../../../frontend/src/consts';

async function materializeCoffeeChat(dbCoffeeChat: DBCoffeeChat): Promise<CoffeeChat> {
  const submitter = await getMemberFromDocumentReference(dbCoffeeChat.submitter);
  const otherMember = await getMemberFromDocumentReference(dbCoffeeChat.otherMember);

  return {
    ...dbCoffeeChat,
    submitter,
    otherMember
  };
}

async function serializeCoffeeChat(coffeeChat: CoffeeChat): Promise<DBCoffeeChat> {
  const submitter = memberCollection.doc(coffeeChat.submitter.email);
  const otherMember = memberCollection.doc(coffeeChat.otherMember.email);

  return {
    ...coffeeChat,
    submitter,
    otherMember
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
   */
  async createCoffeeChat(coffeeChat: CoffeeChat): Promise<CoffeeChat> {
    const coffeeChatWithUUID = {
      ...coffeeChat,
      status: 'pending' as Status,
      uuid: coffeeChat.uuid ? coffeeChat.uuid : uuidv4(),
      date: new Date().getTime()
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
   * Gets coffee chats that a user has submitted by status
   * @param user - user whose coffee chats should be fetched
   * @param status - the status of fetched coffee chats
   */
  async getCoffeeChatsByUser(user: IdolMember, status: Status): Promise<CoffeeChat[]> {
    return this.getDocuments([
      {
        field: 'submitter',
        comparisonOperator: '==',
        value: memberCollection.doc(user.email)
      },
      {
        field: 'status',
        comparisonOperator: '==',
        value: status
      }
    ]);
  }

  /**
   * Deletes a coffee chat
   * @param uuid - DB uuid of CoffeeChat
   */
  async deleteCoffeeChat(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }

  /**
   * Deletes all coffee chats for all users
   */
  static async clearAllCoffeeChats(): Promise<void> {
    await deleteCollection(db, 'coffee-chats', 500);
  }

  /**
   * Gets the coffee chat bingo board
   */
  static async getCoffeeChatBingoBoard(): Promise<string[][]> {
    return COFFEE_CHAT_BINGO_BOARD;
  }
}
