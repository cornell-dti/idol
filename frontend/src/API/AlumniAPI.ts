import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

export default class AlumniAPI {
  /**
   * Retrieves all alumni records
   * @returns Promise resolving to array of all alumni records
   */
  static async getAllAlumni(): Promise<readonly Alumni[]> {
    const response = await APIWrapper.get(`${backendURL}/alumni`);
    return response.data.alumni;
  }

  /**
   * Retrieves a specific alumni record by uuid
   * @param uuid - Unique id for the alumni
   * @returns Promise resolving to the retrieved alumni record
   */
  static async getAlumni(uuid: string): Promise<Alumni> {
    const response = await APIWrapper.get(`${backendURL}/alumni/${uuid}`);
    return response.data.alumni;
  }

  /**
   * Creates a new alumni record
   * @param alumni - Alumni data to create
   * @returns Promise resolving to the created alumni record
   */
  static async createAlumni(alumni: Alumni): Promise<Alumni> {
    const response = await APIWrapper.post(`${backendURL}/alumni`, alumni);
    return response.data.alumni;
  }

  /**
   * Updates an existing alumni record
   * @param alumni - Alumni data with updated information
   * @returns Promise resolving to the updated alumni record
   */
  static async updateAlumni(alumni: Alumni): Promise<Alumni> {
    const response = await APIWrapper.put(`${backendURL}/alumni`, alumni);
    return response.data.alumni;
  }

  /**
   * Deletes an alumni record by uuid
   * @param uuid - Unique id for the alumni to delete
   * @returns Promise that resolves when deletion is complete
   */
  static async deleteAlumni(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/alumni/${uuid}`);
  }
}
