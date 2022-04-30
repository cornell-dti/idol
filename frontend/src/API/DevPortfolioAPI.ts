import APIWrapper from './APIWrapper';
import { backendURL } from '../environment';

type DevPortfolioResponseObj = {
  devPortfolio: DevPortfolio;
  error?: string;
};

export default class DevPortfolioAPI {
  static async getAllDevPortfolios(): Promise<DevPortfolio[]> {
    const response = APIWrapper.get(`${backendURL}/getAllDevPortfolios`);
    return response.then((val) => val.data.instances);
  }

  public static requestDevPortfolio(devPortfolio: DevPortfolio): Promise<DevPortfolioResponseObj> {
    return APIWrapper.post(`${backendURL}/updateDevPortfolio`, devPortfolio).then(
      (res) => res.data.event
    );
  }
}
