import { v4 as uuidv4 } from 'uuid';
import { devPortfolioCollection, memberCollection } from '../firebase';
import { DBDevPortfolio } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

export default class DevPortfolioDao {
  private static async DBDevPortfolioToDevPortfolio(data: DBDevPortfolio): Promise<DevPortfolio> {
    return {
      ...data,
      submissions: await Promise.all(
        data.submissions.map(async (submission) => ({
          ...submission,
          member: await getMemberFromDocumentReference(submission.member)
        }))
      )
    };
  }

  private static DevPortfolioToDBDevPortfolio(instance: DevPortfolio): DBDevPortfolio {
    return {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4(),
      submissions: instance.submissions.map((submission) => ({
        ...submission,
        member: memberCollection.doc(submission.member.email)
      }))
    };
  }

  static async makeDevPortfolioSubmission(
    uuid: string,
    submission: DevPortfolioSubmission
  ): Promise<DevPortfolioSubmission> {
    const doc = await devPortfolioCollection.doc(uuid).get();

    const data = doc.data() as DBDevPortfolio;

    const subs = data.submissions;
    subs.push({
      ...submission,
      member: memberCollection.doc(submission.member.email)
    });
    await devPortfolioCollection.doc(uuid).update({ submissions: subs });

    return submission;
  }

  static async getInstance(uuid: string): Promise<DevPortfolio> {
    const doc = await devPortfolioCollection.doc(uuid).get();

    const data = doc.data() as DBDevPortfolio;

    return DevPortfolioDao.DBDevPortfolioToDevPortfolio(data);
  }

  static async getAllInstances(): Promise<DevPortfolio[]> {
    const instanceRefs = await devPortfolioCollection.get();

    return Promise.all(
      instanceRefs.docs.map(async (instanceRefs) =>
        DevPortfolioDao.DBDevPortfolioToDevPortfolio(instanceRefs.data() as DBDevPortfolio)
      )
    );
  }

  static async createNewInstance(instance: DevPortfolio): Promise<void> {
    const devPortfolioRef = await DevPortfolioDao.DevPortfolioToDBDevPortfolio(instance);

    await devPortfolioCollection.doc(devPortfolioRef.uuid).set(devPortfolioRef);
  }

  static async updateInstance(updatedInstance: DevPortfolio): Promise<void> {
    const dbInstance = await DevPortfolioDao.DevPortfolioToDBDevPortfolio(updatedInstance);

    await devPortfolioCollection.doc(dbInstance.uuid).set(dbInstance);
  }

  static async deleteInstance(uuid: string): Promise<void> {
    await devPortfolioCollection.doc(uuid).delete();
  }
}
