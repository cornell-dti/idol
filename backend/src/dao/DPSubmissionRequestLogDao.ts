import { devPortfolioSubmissionRequestLogCollection } from '../firebase';

export default class DPSubmissionRequestLogDao {
  public static async logRequest(
    email: string,
    uuid: string,
    submission: DevPortfolioSubmission
  ): Promise<void> {
    const requestLog = {
      timestamp: new Date().toLocaleString(),
      email,
      body: {
        submission,
        uuid
      }
    };
    await devPortfolioSubmissionRequestLogCollection.doc().set(requestLog);
  }
}
