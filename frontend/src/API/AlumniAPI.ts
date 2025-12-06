import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

export default class AlumniAPI {
  static async getAllAlumni(): Promise<readonly Alumni[]> {
    const response = await APIWrapper.get(`${backendURL}/alumni`);
    return response.data.alumni;
  }

  static async getAlumni(uuid: string): Promise<Alumni> {
    const response = await APIWrapper.get(`${backendURL}/alumni/${uuid}`);
    return response.data.alumni;
  }

  static async createAlumni(alumni: Alumni): Promise<Alumni> {
    const response = await APIWrapper.post(`${backendURL}/alumni`, alumni);
    return response.data.alumni;
  }

  static async updateAlumni(alumni: Alumni): Promise<Alumni> {
    const response = await APIWrapper.put(`${backendURL}/alumni`, alumni);
    return response.data.alumni;
  }

  static async deleteAlumni(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/alumni/${uuid}`);
  }
}
