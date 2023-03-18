import { firestore } from 'firebase-admin';

export default class BaseDao<E, D> {
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

  protected async getDocument(docID: string): Promise<E | null> {
    const doc = await this.collection.doc(docID).get();
    const data = doc.data();
    if (!data) return null;
    return this.materializeData(data);
  }

  protected async getAllDocuments(): Promise<E[]> {
    const docRefs = await this.collection.get();
    return Promise.all(docRefs.docs.map((doc) => this.materializeData(doc.data())));
  }

  protected async createDocument(docID: string, data: E): Promise<E> {
    const doc = await this.serializeData(data);
    await this.collection.doc(docID).set(doc);
    return data;
  }

  protected async deleteDocument(docID: string): Promise<void> {
    await this.collection.doc(docID).delete();
  }

  protected async updateDocument(docID: string, data: E): Promise<E> {
    const doc = await this.serializeData(data);
    await this.collection.doc(docID).update(doc as firestore.UpdateData);
    return data;
  }
}
