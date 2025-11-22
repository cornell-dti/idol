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
   * Helper to create coordinate-based document ID
   * @param latitude - The latitude coordinate
   * @param longitude - The longitude coordinate
   * @returns Document ID string (e.g. "40.7128,-74.0060")
   */
  private createCoordinateId(latitude: number, longitude: number): string {
    return `${latitude},${longitude}`;
  }

  /**
   * Gets city coordinates by lat/long coordinates
   * @param latitude - The latitude coordinate
   * @param longitude - The longitude coordinate
   * @returns The city coordinates document or null if not found
   */
  async getCityCoordinates(latitude: number, longitude: number): Promise<DBCityCoordinates | null> {
    const locationId = this.createCoordinateId(latitude, longitude);
    return this.getDocument(locationId);
  }

  /**
   * Creates a new city coordinates document
   * @param cityCoordinates - The city coordinates data
   * @returns The created city coordinates document
   */
  async createCityCoordinates(cityCoordinates: DBCityCoordinates): Promise<DBCityCoordinates> {
    const locationId = this.createCoordinateId(cityCoordinates.latitude, cityCoordinates.longitude);
    return this.createDocument(locationId, cityCoordinates);
  }

  /**
   * Updates an existing city coordinates document
   * @param cityCoordinates - The updated city coordinates data
   * @returns The updated city coordinates document
   */
  async updateCityCoordinates(cityCoordinates: DBCityCoordinates): Promise<DBCityCoordinates> {
    const locationId = this.createCoordinateId(cityCoordinates.latitude, cityCoordinates.longitude);
    return this.updateDocument(locationId, cityCoordinates);
  }

  /**
   * Deletes a city coordinates document by lat/long
   * @param latitude - The latitude coordinate
   * @param longitude - The longitude coordinate
   */
  async deleteCityCoordinates(latitude: number, longitude: number): Promise<void> {
    const locationId = this.createCoordinateId(latitude, longitude);
    return this.deleteDocument(locationId);
  }

  /**
   * Adds an alumni ID to a city coordinates document or creates location if it doesn't exist
   * @param latitude - The latitude coordinate
   * @param longitude - The longitude coordinate
   * @param alumniId - The alumni ID to add
   * @param locationName - The location name for the coordinates
   * @returns The city coordinates document
   */
  async addAlumniToLocation(
    latitude: number,
    longitude: number,
    alumniId: string,
    locationName: string
  ): Promise<DBCityCoordinates> {
    const cityCoords = await this.getCityCoordinates(latitude, longitude);

    if (!cityCoords) {
      const newLocation: DBCityCoordinates = {
        locationName,
        latitude,
        longitude,
        alumniIds: [alumniId]
      };
      return this.createCityCoordinates(newLocation);
    }

    if (cityCoords.alumniIds.includes(alumniId)) {
      return cityCoords;
    }

    const updatedAlumniIds = [...cityCoords.alumniIds, alumniId];
    const updatedCityCoords: DBCityCoordinates = {
      ...cityCoords,
      alumniIds: updatedAlumniIds
    };

    return this.updateCityCoordinates(updatedCityCoords);
  }

  /**
   * Removes an alumni ID from a city coordinates document
   * @param latitude - The latitude coordinate
   * @param longitude - The longitude coordinate
   * @param alumniId - The alumni ID to remove
   * @returns The updated city coordinates document or null if location not found
   */
  async removeAlumniFromLocation(
    latitude: number,
    longitude: number,
    alumniId: string
  ): Promise<DBCityCoordinates | null> {
    const cityCoords = await this.getCityCoordinates(latitude, longitude);
    if (!cityCoords) return null;

    const updatedAlumniIds = cityCoords.alumniIds.filter((id) => id !== alumniId);
    const updatedCityCoords: DBCityCoordinates = {
      ...cityCoords,
      alumniIds: updatedAlumniIds
    };

    return this.updateCityCoordinates(updatedCityCoords);
  }
}
