import { devPortfolioSubmissionRequestLogCollection } from '../firebase';
import { devPortfolioSubmissionToDBDevPortfolioSubmission } from './DevPortfolioDao';

export default class DPSubmissionRequestLogDao {
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
