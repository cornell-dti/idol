import { cityCoordinatesCollection } from '../firebase';
import { DBCityCoordinates } from '../types/DataTypes';
import BaseDao from './BaseDao';

export default class CityCoordinatesDao extends BaseDao<DBCityCoordinates, DBCityCoordinates> {
  constructor() {
    super(
      cityCoordinatesCollection,
      async (dbCityCoordinates) => dbCityCoordinates,
      async (cityCoordinates) => cityCoordinates
    );
  }

  /**
   * Gets all city coordinates
   * @returns All city coordinate documents
   */
  async getAllCityCoordinates(): Promise<DBCityCoordinates[]> {
    return this.getDocuments();
  }

  /**
   * Gets city coordinates by location ID
   * @param locationId - The standardized location ID (e.g. "new-york-ny-us")
   * @returns The city coordinates document or null if not found
   */
  async getCityCoordinates(locationId: string): Promise<DBCityCoordinates | null> {
    return this.getDocument(locationId);
  }

  /**
   * Creates a new city coordinates document
   * @param cityCoordinates - The city coordinates data
   * @returns The created city coordinates document
   */
  async createCityCoordinates(cityCoordinates: DBCityCoordinates): Promise<DBCityCoordinates> {
    return this.createDocument(cityCoordinates.id, cityCoordinates);
  }

  /**
   * Updates an existing city coordinates document
   * @param locationId - The location ID to update
   * @param cityCoordinates - The updated city coordinates data
   * @returns The updated city coordinates document
   */
  async updateCityCoordinates(
    locationId: string,
    cityCoordinates: DBCityCoordinates
  ): Promise<DBCityCoordinates> {
    return this.updateDocument(locationId, cityCoordinates);
  }

  /**
   * Deletes a city coordinates document
   * @param locationId - The location ID to delete
   */
  async deleteCityCoordinates(locationId: string): Promise<void> {
    return this.deleteDocument(locationId);
  }

  /**
   * Adds an alumni ID to a city coordinates document
   * @param locationId - The location ID
   * @param alumniId - The alumni ID to add
   * @returns The updated city coordinates document or null if location not found
   */
  async addAlumniToLocation(
    locationId: string,
    alumniId: string
  ): Promise<DBCityCoordinates | null> {
    const cityCoords = await this.getCityCoordinates(locationId);
    if (!cityCoords) return null;

    const updatedAlumniIds = Array.from(new Set([...cityCoords.alumniIds, alumniId]));
    const updatedCityCoords: DBCityCoordinates = {
      ...cityCoords,
      alumniIds: updatedAlumniIds
    };

    return this.updateCityCoordinates(locationId, updatedCityCoords);
  }

  /**
   * Removes an alumni ID from a city coordinates document
   * @param locationId - The location ID
   * @param alumniId - The alumni ID to remove
   * @returns The updated city coordinates document or null if location not found
   */
  async removeAlumniFromLocation(
    locationId: string,
    alumniId: string
  ): Promise<DBCityCoordinates | null> {
    const cityCoords = await this.getCityCoordinates(locationId);
    if (!cityCoords) return null;

    const updatedAlumniIds = cityCoords.alumniIds.filter((id) => id !== alumniId);
    const updatedCityCoords: DBCityCoordinates = {
      ...cityCoords,
      alumniIds: updatedAlumniIds
    };

    return this.updateCityCoordinates(locationId, updatedCityCoords);
  }
}
