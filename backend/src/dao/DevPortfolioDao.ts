import { v4 as uuidv4 } from 'uuid';
import { devPortfolioCollection, memberCollection } from '../firebase';
import { DBDevPortfolio, DBDevPortfolioSubmission } from '../DataTypes';

export default class DevPortfolioDao {

  static async makeDevPortfolioSubmission(uuid: string, submission: DevPortfolioSubmission): Promise<DevPortfolioSubmission> {
    const doc = await devPortfolioCollection.doc(uuid).get();
    if (!doc.exists) return;
    const data = doc.data() as DBDevPortfolio;
    let subs = data.submissions
    subs.push(submission)
    await devPortfolioCollection.doc(uuid).update({ submissions: subs});
    return submission
  }

  static async getAllInstances(): Promise<DevPortfolio[]> {
    const instanceRefs = await devPortfolioCollection.get();

    return Promise.all(
      instanceRefs.docs.map(async (instanceRefs) => {
        return instanceRefs.data() as DBDevPortfolio;
      })
    );
  }
  static async createNewInstance(
    instance: DevPortfolio
  ): Promise<void> {
    const devPortfolioRef = {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4(),
    };
    await devPortfolioCollection
      .doc(devPortfolioRef.uuid)
      .set(devPortfolioRef);
  }

  static async deleteInstance(uuid: string): Promise<void> {
    await devPortfolioCollection.doc(uuid).delete();
  }


}
