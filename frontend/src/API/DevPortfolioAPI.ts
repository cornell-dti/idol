import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

type DevPortfolioSubmissionResponseObj = {
  submission?: DevPortfolioSubmission;
  error?: string;
};

export default class DevPortfolioAPI {
  static async getAllDevPortfolios(): Promise<DevPortfolio[]> {
    const response = APIWrapper.get(`${backendURL}/getAllDevPortfolios`);
    return response.then((val) => val.data.portfolios);
  }

  public static async createDevPortfolio(devPortfolio: DevPortfolio): Promise<DevPortfolio> {
    return APIWrapper.post(`${backendURL}/createNewDevPortfolio`, devPortfolio).then(
      (res) => res.data.portfolio
    );
  }

  public static async makeDevPortfolioSubmission(uuid: string, devPortfolioSubmission: DevPortfolioSubmission): Promise<DevPortfolioSubmissionResponseObj> {
    return APIWrapper.post(`${backendURL}/makeDevPortfolioSubmission`, {uuid: uuid, submission: devPortfolioSubmission}).then(
      (res) => res.data
    );
  }

  public static async deleteDevPortfolio(uuid: string): Promise<void> {
    APIWrapper.post(`${backendURL}/deleteDevPortfolio`, { uuid });
  }

  public static async getDevPortfolio(uuid: string): Promise<DevPortfolio> {
    return APIWrapper.get(`${backendURL}/getDevPortfolio/${uuid}`).then(
      (res) => res.data.portfolio
    );
  }
}
