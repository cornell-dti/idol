import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

type DevPortfolioSubmissionResponseObj = {
  error?: string;
};

export default class DevPortfolioAPI {
  static async getAllDevPortfolios(isAdminReq: boolean): Promise<DevPortfolio[]> {
    const response = APIWrapper.get(
      `${backendURL}/getAllDevPortfolios${isAdminReq ? '' : 'NonAdmin'}`
    );
    return response.then((val) => val.data.portfolios);
  }

  public static async createDevPortfolio(devPortfolio: DevPortfolio): Promise<DevPortfolio> {
    return APIWrapper.post(`${backendURL}/createNewDevPortfolio`, devPortfolio).then(
      (res) => res.data.portfolio
    );
  }

  public static async makeDevPortfolioSubmission(
    uuid: string,
    submission: DevPortfolioSubmission
  ): Promise<DevPortfolioSubmissionResponseObj> {
    return APIWrapper.post(`${backendURL}/makeDevPortfolioSubmission`, {
      uuid,
      submission
    }).then((res) => res.data);
  }

  public static async deleteDevPortfolio(uuid: string): Promise<void> {
    APIWrapper.post(`${backendURL}/deleteDevPortfolio`, { uuid });
  }

  public static async getDevPortfolio(uuid: string, isAdminReq: boolean): Promise<DevPortfolio> {
    return APIWrapper.get(
      `${backendURL}/getDevPortfolio${isAdminReq ? '' : 'NonAdmin'}/${uuid}`
    ).then((res) => res.data.portfolio);
  }
}
