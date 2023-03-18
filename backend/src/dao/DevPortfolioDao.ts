import { v4 as uuidv4 } from 'uuid';
import { devPortfolioCollection, memberCollection } from '../firebase';
import { DBDevPortfolio, DBDevPortfolioSubmission } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import { getSubmissionStatus } from '../utils/githubUtil';
import BaseDao from './BaseDao';

export function devPortfolioSubmissionToDBDevPortfolioSubmission(
  submission: DevPortfolioSubmission
): DBDevPortfolioSubmission {
  return {
    ...submission,
    member: memberCollection.doc(submission.member.email)
  };
}

async function DBDevPortfolioToDevPortfolio(data: DBDevPortfolio): Promise<DevPortfolio> {
  const submissions = await Promise.all(
    data.submissions.map(async (submission) => {
      const fromDb = {
        ...submission,
        member: await getMemberFromDocumentReference(submission.member)
      } as DevPortfolioSubmission;

      // since not all submissions could have this field yet
      if (!fromDb.status) {
        return { ...fromDb, status: getSubmissionStatus(fromDb) };
      }
      return fromDb;
    })
  );

  return { ...data, submissions };
}

async function devPortfolioToDBDevPortfolio(instance: DevPortfolio): Promise<DBDevPortfolio> {
  return {
    ...instance,
    uuid: instance.uuid ? instance.uuid : uuidv4(),
    submissions: instance.submissions.map((submission) => ({
      ...submission,
      member: memberCollection.doc(submission.member.email)
    }))
  };
}

export default class DevPortfolioDao extends BaseDao<DevPortfolio, DBDevPortfolio> {
  constructor() {
    super(devPortfolioCollection, DBDevPortfolioToDevPortfolio, devPortfolioToDBDevPortfolio);
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

  async getInstance(uuid: string): Promise<DevPortfolio | null> {
    return this.getDocument(uuid);
  }

  async getAllInstances(): Promise<DevPortfolio[]> {
    return this.getAllDocuments();
  }

  public static async getAllDevPortfolioInfo(): Promise<DevPortfolioInfo[]> {
    const instanceInfoRefs = await devPortfolioCollection
      .select('deadline', 'earliestValidDate', 'name', 'uuid', 'lateDeadline')
      .get();
    return Promise.all(
      instanceInfoRefs.docs.map(async (instanceRefs) => {
        const { submissions, ...devPortfolioInfo } = instanceRefs.data() as DBDevPortfolio;
        return devPortfolioInfo;
      })
    );
  }

  public static async getDevPortfolioInfo(uuid: string): Promise<DevPortfolioInfo> {
    const portfolioRef = await devPortfolioCollection.doc(uuid).get();
    const { submissions, ...devPortfolioInfo } = portfolioRef.data() as DBDevPortfolio;
    return devPortfolioInfo;
  }

  public static async getUsersDevPortfolioSubmissions(
    uuid: string,
    user: IdolMember
  ): Promise<DevPortfolioSubmission[]> {
    const portfolioData = (await devPortfolioCollection.doc(uuid).get()).data() as DBDevPortfolio;
    const dBSubmissions = portfolioData.submissions.filter(
      (submission) => submission.member.id === user.email
    );

    return dBSubmissions.map((submission) => ({ ...submission, member: user }));
  }

  async createNewInstance(instance: DevPortfolio): Promise<DevPortfolio> {
    const instanceWithUUID = {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4()
    };
    return this.createDocument(instanceWithUUID.uuid, instanceWithUUID);
  }

  async updateInstance(updatedInstance: DevPortfolio): Promise<DevPortfolio> {
    return this.updateDocument(updatedInstance.uuid, updatedInstance);
  }

  async deleteInstance(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }
}
