import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

type DevPortfolioSubmissionResponseObj = {
  error?: string;
};

export default class DevPortfolioAPI {
  static async getAllDevPortfolios(): Promise<DevPortfolio[]> {
    const response = APIWrapper.get(`${backendURL}/dev-portfolio`);
    return response.then((val) => val.data.portfolios);
  }

  static async getAllDevPortfolioInfo(): Promise<DevPortfolioInfo[]> {
    const response = APIWrapper.get(`${backendURL}/dev-portfolio?meta_only=true`);
    return response.then((val) => val.data.portfolios);
  }

  public static async createDevPortfolio(devPortfolio: DevPortfolio): Promise<DevPortfolio> {
    return APIWrapper.post(`${backendURL}/dev-portfolio`, devPortfolio).then(
      (res) => res.data.portfolio
    );
  }

  public static updateDevPortfolio(devPortfolio: DevPortfolio): Promise<DevPortfolio> {
    return APIWrapper.put(`${backendURL}/dev-portfolio`, devPortfolio).then(
      (res) => res.data.portfolio
    );
  }

  public static async makeDevPortfolioSubmission(
    uuid: string,
    submission: DevPortfolioSubmission
  ): Promise<DevPortfolioSubmissionResponseObj> {
    return APIWrapper.post(`${backendURL}/dev-portfolio/submission`, {
      uuid,
      submission
    }).then((res) => res.data);
  }

  public static async deleteDevPortfolio(uuid: string): Promise<void> {
    APIWrapper.delete(`${backendURL}/dev-portfolio/${uuid}`);
  }

  public static async getDevPortfolio(uuid: string): Promise<DevPortfolio> {
    return APIWrapper.get(`${backendURL}/dev-portfolio/${uuid}`).then(
      (res) => res.data.portfolioInfo
    );
  }

  public static async getDevPortfolioInfo(uuid: string): Promise<DevPortfolioInfo> {
    return APIWrapper.get(`${backendURL}/dev-portfolio/${uuid}?meta_only=true`).then(
      (res) => res.data.portfolioInfo
    );
  }

  public static async getUsersDevPortfolioSubmissions(
    uuid: string
  ): Promise<DevPortfolioSubmission[]> {
    return APIWrapper.get(`${backendURL}/dev-portfolio/${uuid}/submission`).then(
      (res) => res.data.submissions
    );
  }

  public static async regradeSubmissions(uuid: string): Promise<DevPortfolio> {
    return APIWrapper.put(`${backendURL}/dev-portfolio/${uuid}/submission/regrade`, {}).then(
      (res) => res.data.portfolio
    );
  }

  public static async updateSubmissions(
    uuid: string,
    updatedSubmissions: DevPortfolioSubmission[]
  ): Promise<DevPortfolio> {
    return APIWrapper.put(`${backendURL}/dev-portfolio/${uuid}/submission`, {
      uuid,
      updatedSubmissions
    }).then((res) => res.data.portfolio);
  }
}
