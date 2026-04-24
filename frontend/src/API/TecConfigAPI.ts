import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

export default class TecConfigAPI {
  static async getTecConfig(): Promise<TECConfig> {
    const response = await APIWrapper.get(`${backendURL}/tec-config`);
    return response.data.config;
  }

  static async updateTecConfig(config: TECConfig): Promise<TECConfig> {
    const response = await APIWrapper.put(`${backendURL}/tec-config`, config);
    if (!response.data?.config) {
      throw new Error(response.data?.error ?? 'Failed to update TEC Periods');
    }
    return response.data.config;
  }
}
