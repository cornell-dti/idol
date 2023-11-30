import { devPortfolioSubmissionRequestLogCollection } from '../firebase';
import { devPortfolioSubmissionToDBDevPortfolioSubmission } from './DevPortfolioDao';

export default class DPSubmissionRequestLogDao {
  /**
   * Adds a dev portfolio submission request to the database.
   * @param email - Email of the member who made the request.
   * @param uuid - DB uuid of the request.
   * @param submission - Dev Portfolio Submission object.
   */
  public static async logRequest(
    email: string,
    uuid: string,
    submission: DevPortfolioSubmission
  ): Promise<void> {
    const dbSubmission = devPortfolioSubmissionToDBDevPortfolioSubmission(submission);
    const requestLog = {
      timestamp: new Date().toLocaleString(),
      email,
      body: {
        submission: dbSubmission,
        uuid
      }
    };
    await devPortfolioSubmissionRequestLogCollection.doc().set(requestLog);
  }
}
