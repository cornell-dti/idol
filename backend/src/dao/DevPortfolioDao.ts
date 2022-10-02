import { v4 as uuidv4 } from 'uuid';
import { devPortfolioCollection, memberCollection } from '../firebase';
import { DBDevPortfolio } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

export default class DevPortfolioDao {
  private static async DBDevPortfolioToDevPortfolio(data: DBDevPortfolio, isLeadOrAdminOrIgnorePerms: boolean, user: IdolMember | null): Promise<DevPortfolio> {
    const submissions = await Promise.all(
      data.submissions.map(async (submission) => ({
        ...submission,
        member: await getMemberFromDocumentReference(submission.member)
      }))
    )
    // console.log(user.email)
    // console.log(submissions.forEach((submission) => console.log(submission.member.email)))
    return {
      ...data,
      submissions: isLeadOrAdminOrIgnorePerms ? submissions : submissions.filter((submission) => user ? submission.member.email === user.email : false)
      // submissions: submissions
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

  public static async getDevPortfolio(uuid: string, isLeadOrAdmin: boolean, user: IdolMember): Promise<DevPortfolio> {
    const doc = await devPortfolioCollection.doc(uuid).get();
    return this.DBDevPortfolioToDevPortfolio(doc.data() as DBDevPortfolio, isLeadOrAdmin, user);
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

    return DevPortfolioDao.DBDevPortfolioToDevPortfolio(data, true, null);
  }

  static async getAllInstances(isLeadOrAdmin: boolean, user: IdolMember | null): Promise<DevPortfolio[]> {
    const instanceRefs = await devPortfolioCollection.get();

    return Promise.all(
      instanceRefs.docs.map(async (instanceRefs) =>
        DevPortfolioDao.DBDevPortfolioToDevPortfolio(instanceRefs.data() as DBDevPortfolio, isLeadOrAdmin,user)
      )
    );
  }

  static async createNewInstance(instance: DevPortfolio): Promise<DevPortfolio> {
    const portfolio = {
      ...instance,
      submissions: [],
      uuid: instance.uuid ? instance.uuid : uuidv4()
    };
    devPortfolioCollection.doc(portfolio.uuid).set(portfolio);
    return portfolio;
  }

  static async updateInstance(updatedInstance: DevPortfolio): Promise<void> {
    const dbInstance = await DevPortfolioDao.DevPortfolioToDBDevPortfolio(updatedInstance);

    await devPortfolioCollection.doc(dbInstance.uuid).set(dbInstance);
  }

  static async deleteInstance(uuid: string): Promise<void> {
    await devPortfolioCollection.doc(uuid).delete();
  }
}
