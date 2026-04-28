import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

export default class CityCoordinatesAPI {
  /**
   * Retrieves all city coordinates
   * @returns Promise resolving to array of all city coordinates
   */
  static async getAllCityCoordinates(): Promise<readonly CityCoordinates[]> {
    const response = await APIWrapper.get(`${backendURL}/city-coordinates`);
    return response.data.cityCoordinates;
  }
}
