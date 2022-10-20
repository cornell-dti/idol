import { v4 as uuidv4 } from 'uuid';
import { devPortfolioCollection, memberCollection } from '../firebase';
import { DBDevPortfolio, DBDevPortfolioSubmission } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';

export function devPortfolioSubmissionToDBDevPortfolioSubmission(
  submission: DevPortfolioSubmission
): DBDevPortfolioSubmission {
  return {
    ...submission,
    member: memberCollection.doc(submission.member.email)
  };
}
export default class DevPortfolioDao {
  private static async DBDevPortfolioToDevPortfolio(
    data: DBDevPortfolio
  ): Promise<DevPortfolio> {
    const submissions = await Promise.all(
      data.submissions.map(async (submission) => ({
        ...submission,
        member: await getMemberFromDocumentReference(submission.member)
      }))
    );

    return {...data, submissions};
  }

  private static devPortfolioToDBDevPortfolio(instance: DevPortfolio): DBDevPortfolio {
    return {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4(),
      submissions: instance.submissions.map((submission) => ({
        ...submission,
        member: memberCollection.doc(submission.member.email)
      }))
    };
  }

  public static async getDevPortfolio(
    uuid: string
  ): Promise<DevPortfolio> {
    const doc = await devPortfolioCollection.doc(uuid).get();
    return this.DBDevPortfolioToDevPortfolio(doc.data() as DBDevPortfolio);
  }

  static async makeDevPortfolioSubmission(
    uuid: string,
    submission: DevPortfolioSubmission
  ): Promise<DevPortfolioSubmission> {
    const doc = await devPortfolioCollection.doc(uuid).get();

    const data = doc.data() as DBDevPortfolio;

    const subs = data.submissions;
    subs.push(devPortfolioSubmissionToDBDevPortfolioSubmission(submission));
    await devPortfolioCollection.doc(uuid).update({ submissions: subs });

    return submission;
  }

  static async getInstance(uuid: string): Promise<DevPortfolio> {
    const doc = await devPortfolioCollection.doc(uuid).get();

    const data = doc.data() as DBDevPortfolio;

    return DevPortfolioDao.DBDevPortfolioToDevPortfolio(data);
  }

  static async getAllInstances(
    user: IdolMember | null
  ): Promise<DevPortfolio[]> {
    const instanceRefs = await devPortfolioCollection.get();

    return Promise.all(
      instanceRefs.docs.map(async (instanceRefs) =>
        DevPortfolioDao.DBDevPortfolioToDevPortfolio(
          instanceRefs.data() as DBDevPortfolio)
      )
    );
  }

  public static async getAllDevPortfolioInfo(): Promise<DevPortfolioInfo[]> {
    const instanceInfoRefs = await devPortfolioCollection.select('deadline', 'earliestValidDate', 'name', 'uuid').get();
    return Promise.all(
      instanceInfoRefs.docs.map(async (instanceRefs) => instanceRefs.data() as DevPortfolioInfo)
    );
  }

  public static async getDevPortfolioInfo(uuid: string): Promise<DevPortfolioInfo> {
    const portfolioRef = await devPortfolioCollection.doc(uuid).get();
    return portfolioRef.data() as DevPortfolioInfo;
  }

  public static async getUsersDevPortfolioSubmissions(uuid: string, user: IdolMember): Promise<DevPortfolioSubmission[]> {
    const portfolioData = (await devPortfolioCollection.doc(uuid).get()).data() as DBDevPortfolio;
    const userDocRef = memberCollection.doc(user.email);
    const dBSubmissions = portfolioData.submissions.filter((submission) => userDocRef ? submission.member == userDocRef : false)

    return dBSubmissions.map((submission) => ({...submission, member: user}));
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
    const dbInstance = this.devPortfolioToDBDevPortfolio(updatedInstance);

    await devPortfolioCollection.doc(dbInstance.uuid).set(dbInstance);
  }

  static async deleteInstance(uuid: string): Promise<void> {
    await devPortfolioCollection.doc(uuid).delete();
  }
}
