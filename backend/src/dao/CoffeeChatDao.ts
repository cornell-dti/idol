import { v4 as uuidv4 } from 'uuid';
import { memberCollection, coffeeChatsCollection, db } from '../firebase';
import { DBCoffeeChat } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao, { FirestoreFilter } from './BaseDao';
import { deleteCollection } from '../utils/firebase-utils';

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
   * Gets all coffee chat that a user has submitted
   * @param submitter - submitter whose coffee chats should be fetched
   * @param otherMember - additional filter for coffee chats with otherMember (optional)
   */
  async getCoffeeChatsByUser(
    submitter: IdolMember,
    otherMember?: IdolMember
  ): Promise<CoffeeChat[]> {
    const filters: FirestoreFilter[] = [
      {
        field: 'submitter',
        comparisonOperator: '==',
        value: memberCollection.doc(submitter.email)
      }
    ];

    if (otherMember) {
      filters.push({
        field: 'otherMember',
        comparisonOperator: '==',
        value: memberCollection.doc(otherMember.email)
      });
    }

    return this.getDocuments(filters);
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
}
