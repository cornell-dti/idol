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

async function materializeDevPortfolio(data: DBDevPortfolio): Promise<DevPortfolio> {
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

async function serializeDevPortfolio(instance: DevPortfolio): Promise<DBDevPortfolio> {
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
    super(devPortfolioCollection, materializeDevPortfolio, serializeDevPortfolio);
  }

  /**
   * Creates a new Dev Portfolio submission
   * @param uuid - DB uuid of DevPortfolioSubmission
   * @param submission - Newly created DevPortfolioSubmission object
   */
  async makeDevPortfolioSubmission(
    uuid: string,
    submission: DevPortfolioSubmission
  ): Promise<DevPortfolioSubmission> {
    const doc = await devPortfolioCollection.doc(uuid).get();

    const data = doc.data() as DBDevPortfolio;

    const subs = data.submissions;
    subs.push(devPortfolioSubmissionToDBDevPortfolioSubmission(submission));
    await this.collection.doc(uuid).update({ submissions: subs });

    return submission;
  }

  /**
   * Gets a specific Dev Portfolio
   * @param uuid - DB uuid of DevPortfolio
   */
  async getInstance(uuid: string): Promise<DevPortfolio | null> {
    return this.getDocument(uuid);
  }

  /**
   * Gets all Dev Portfolios
   */
  async getAllInstances(): Promise<DevPortfolio[]> {
    return this.getDocuments();
  }

  /**
   * Gets the deadline, earliest valid date, name, uuid, and late deadline
   * of all Dev Portfolios
   */
  async getAllDevPortfolioInfo(): Promise<DevPortfolioInfo[]> {
    const instanceInfoRefs = await this.collection
      .select('deadline', 'earliestValidDate', 'name', 'uuid', 'lateDeadline')
      .get();
    return Promise.all(
      instanceInfoRefs.docs.map(async (instanceRefs) => {
        const { submissions, ...devPortfolioInfo } = instanceRefs.data() as DBDevPortfolio;
        return devPortfolioInfo;
      })
    );
  }

  /**
   * Gets information from a specific Dev Portfolio
   * @param uuid - DB uuid of DevPortfolio
   */
  async getDevPortfolioInfo(uuid: string): Promise<DevPortfolioInfo> {
    const portfolioRef = await this.collection.doc(uuid).get();
    const { submissions, ...devPortfolioInfo } = portfolioRef.data() as DBDevPortfolio;
    return devPortfolioInfo;
  }

  /**
   * Gets a specific member's Dev Portfolio by checking if the member id of a submission
   * is the user's email
   * @param uuid - DB uuid of DevPortfolio
   * @param user - the member we are getting a portfolio from
   */
  async getUsersDevPortfolioSubmissions(
    uuid: string,
    user: IdolMember
  ): Promise<DevPortfolioSubmission[]> {
    const portfolioData = (await this.collection.doc(uuid).get()).data() as DBDevPortfolio;
    const dBSubmissions = portfolioData.submissions.filter(
      (submission) => submission.member.id === user.email
    );

    return dBSubmissions.map((submission) => ({ ...submission, member: user }));
  }

  /**
   * Creates a new Dev Portfolio
   * A new uuid is created if the instance does not have an existing uuid
   * @param instance - Newly created DevPortfolio object
   */
  async createNewInstance(instance: DevPortfolio): Promise<DevPortfolio> {
    const instanceWithUUID = {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4()
    };
    return this.createDocument(instanceWithUUID.uuid, instanceWithUUID);
  }

  /**
   * Updates a Dev Portfolio
   * @param updatedInstance - updated DevPortfolio object
   */
  async updateInstance(updatedInstance: DevPortfolio): Promise<DevPortfolio> {
    return this.updateDocument(updatedInstance.uuid, updatedInstance);
  }

  /**
   * Deletes a Dev Portfolio
   * @param uuid - DB uuid of DevPortfolio
   */
  async deleteInstance(uuid: string): Promise<void> {
    await this.deleteDocument(uuid);
  }
}
