import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

type DevPortfolioSubmissionResponseObj = {
  error?: string;
};

export default class DevPortfolioAPI {
  static async getAllDevPortfolios(): Promise<DevPortfolio[]> {
    const response = APIWrapper.get(`${backendURL}/getAllDevPortfolios`);
    return response.then((val) => val.data.portfolios);
  }

  static async getAllDevPortfolioInfo(): Promise<DevPortfolioInfo[]> {
    const response = APIWrapper.get(`${backendURL}/getAllDevPortfolioInfo`);
    return response.then((val) => val.data.portfolioInfo);
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

  public static async getDevPortfolio(uuid: string): Promise<DevPortfolio> {
    return APIWrapper.get(`${backendURL}/getDevPortfolio/${uuid}`).then(
      (res) => res.data.portfolio
    );
  }

  public static async getDevPortfolioInfo(uuid: string): Promise<DevPortfolioInfo> {
    return APIWrapper.get(`${backendURL}/getDevPortfolioInfo/${uuid}`).then(
      (res) => res.data.portfolioInfo
    );
  }

  public static async getUsersDevPortfolioSubmissions(
    uuid: string
  ): Promise<DevPortfolioSubmission[]> {
    return APIWrapper.get(`${backendURL}/getUsersDevPortfolioSubmissions/${uuid}`).then(
      (res) => res.data.submissions
    );
  }

  public static async regradeSubmissions(uuid: string): Promise<DevPortfolio> {
    return APIWrapper.post(`${backendURL}/regradeDevPortfolioSubmissions`, { uuid }).then(
      (res) => res.data.portfolio
    );
  }

  public static async updateSubmissions(
    uuid: string,
    updatedSubmissions: DevPortfolioSubmission[]
  ): Promise<DevPortfolio> {
    return APIWrapper.post(`${backendURL}/updateDevPortfolioSubmissions`, {
      uuid,
      updatedSubmissions
    }).then((res) => res.data.portfolio);
  }
}
