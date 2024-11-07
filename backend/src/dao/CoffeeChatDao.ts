import { v4 as uuidv4 } from 'uuid';
import {
  memberCollection,
  coffeeChatsCollection,
  db,
  memberPropertiesCollection
} from '../firebase';
import { DBCoffeeChat, DBMemberProperties } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import BaseDao, { FirestoreFilter } from './BaseDao';
import { deleteCollection } from '../utils/firebase-utils';
import COFFEE_CHAT_BINGO_BOARD from '../consts';

async function materializeCoffeeChat(dbCoffeeChat: DBCoffeeChat): Promise<CoffeeChat> {
  const submitter = await getMemberFromDocumentReference(dbCoffeeChat.submitter);
  const otherMember = !dbCoffeeChat.isNonIDOLMember
    ? await getMemberFromDocumentReference(
        dbCoffeeChat.otherMember as FirebaseFirestore.DocumentReference
      )
    : (dbCoffeeChat.otherMember as unknown as IdolMember);

  return {
    ...dbCoffeeChat,
    submitter,
    otherMember
  };
}

async function serializeCoffeeChat(coffeeChat: CoffeeChat): Promise<DBCoffeeChat> {
  const submitter = memberCollection.doc(coffeeChat.submitter.email);
  const otherMember = !coffeeChat.isNonIDOLMember
    ? memberCollection.doc(coffeeChat.otherMember.email)
    : coffeeChat.otherMember;

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
   * Gets all coffee chat that a user has submitted
   * @param submitter - submitter whose coffee chats should be fetched
   * @param status - the status of fetched coffee chats (optional)
   * @param otherMember - additional filter for coffee chats with otherMember (optional)
   */
  async getCoffeeChatsByUser(
    submitter: IdolMember,
    status?: Status,
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

    if (status) {
      filters.push({
        field: 'status',
        comparisonOperator: '==',
        value: status
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

  /**
   * Gets the coffee chat bingo board
   */
  static async getCoffeeChatBingoBoard(): Promise<string[][]> {
    return COFFEE_CHAT_BINGO_BOARD;
  }

  /**
   * Gets the properties for a specific member
   * @param email - the email of the member whose properties we want to retrieve.
   * @returns A promise that resolves to an DBMemberProperties object or undefined.
   */
  static async getMemberProperties(email: string): Promise<DBMemberProperties | undefined> {
    return memberPropertiesCollection
      .doc(email)
      .get()
      .then((docRef) => docRef.data());
  }
}
