import { firestore } from 'firebase-admin';

export default abstract class BaseDao<E, D> {
  readonly collection: firestore.CollectionReference<D>;

  readonly materializeData: (d: D) => Promise<E>;

  readonly serializeData: (e: E) => Promise<D>;

  constructor(
    collection: firestore.CollectionReference<D>,
    materializeData: (d: D) => Promise<E>,
    serializeData: (e: E) => Promise<D>
  ) {
    this.collection = collection;
    this.materializeData = materializeData;
    this.serializeData = serializeData;
  }

  /**
   * Gets a document with docID
   * @param docID
   * @returns The document with id: docID
   */
  protected async getDocument(docID: string): Promise<E | null> {
    const doc = await this.collection.doc(docID).get();
    const data = doc.data();
    if (!data) return null;
    return this.materializeData(data);
  }

  /**
   * @returns All documents in the collection
   */
  protected async getAllDocuments(): Promise<E[]> {
    const docRefs = await this.collection.get();
    return Promise.all(docRefs.docs.map((doc) => this.materializeData(doc.data())));
  }

  /**
   * Creates a document with id: docID and data: data
   * @param docID - The id of the document
   * @param data - The data in the document
   * @returns The new document
   */
  protected async createDocument(docID: string, data: E): Promise<E> {
    const doc = await this.serializeData(data);
    await this.collection.doc(docID).set(doc);
    return data;
  }

  /**
   * Deletes document with id docID
   * @param docID - The ide of the document to delete
   */
  protected async deleteDocument(docID: string): Promise<void> {
    await this.collection.doc(docID).delete();
  }

  /**
   * Updates a document
   * @param docID - The id of the document to update
   * @param data - The updated data for the document
   * @returns - The newly updated document
   */
  protected async updateDocument(docID: string, data: E): Promise<E> {
    const doc = await this.serializeData(data);
    await this.collection.doc(docID).update(doc as firestore.UpdateData);
    return data;
  }
}
