import { backendURL } from '../environment';
import APIWrapper from './APIWrapper';

type GeocodingResult = {
  latitude: number;
  longitude: number;
  locationName: string;
};

export default class CityCoordinatesAPI {
  /**
   * Retrieves all city coordinates
   * @returns Promise resolving to array of all city coordinates
   */
  static async getAllCityCoordinates(): Promise<readonly CityCoordinates[]> {
    const response = await APIWrapper.get(`${backendURL}/city-coordinates`);
    return response.data.cityCoordinates;
  }

  /**
   * Geocodes a location string and ensures a CityCoordinates entry exists for it.
   * @param location - Human-readable location string
   */
  static async geocodeAndStoreLocation(location: string): Promise<CityCoordinates> {
    const response = await APIWrapper.post(`${backendURL}/city-coordinates/geocode`, {
      location
    });
    const coords = response.data?.cityCoordinates;
    if (coords == null) {
      const err = response.data?.error;
      throw new Error(typeof err === 'string' ? err : 'Geocoding failed.');
    }
    return coords;
  }
  static async geocodeWithoutStoringLocation(location: string): Promise<GeocodingResult> {
    const response = await APIWrapper.post(`${backendURL}/city-coordinates/geocodeWithoutStoring`, {
      location
    });
    const geocodingResult = response.data?.geocodingResult;
    if (geocodingResult == null) {
      const err = response.data?.error;
      throw new Error(typeof err === 'string' ? err : 'Geocoding failed.');
    }
    return geocodingResult;
  }
  /**
   * Adds an alumni ID to a specific location by coordinates.
   */
  static async addAlumniToLocation(
    latitude: number,
    longitude: number,
    alumniId: string,
    locationName: string
  ): Promise<CityCoordinates> {
    const response = await APIWrapper.post(
      `${backendURL}/city-coordinates/${latitude}/${longitude}/alumni`,
      {
        alumniId,
        locationName
      }
    );
    return response.data.cityCoordinates;
  }

  /**
   * Removes an alumni ID from a specific location by coordinates.
   */
  static async removeAlumniFromLocation(
    latitude: number,
    longitude: number,
    alumniId: string
  ): Promise<CityCoordinates> {
    const response = await APIWrapper.delete(
      `${backendURL}/city-coordinates/${latitude}/${longitude}/alumni/${alumniId}`
    );
    return response.data.cityCoordinates;
  }

  /**
   * Resolves a human-readable location name to lat/long, then removes the alumni from that city-coordinates document.
   */
  static async removeAlumniByLocationName(
    locationName: string,
    alumniId: string
  ): Promise<CityCoordinates> {
    const coords = await CityCoordinatesAPI.geocodeWithoutStoringLocation(locationName);
    return CityCoordinatesAPI.removeAlumniFromLocation(coords.latitude, coords.longitude, alumniId);
  }
}
