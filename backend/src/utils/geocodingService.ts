import CityCoordinatesDao from '../dao/CityCoordinatesDao';
import { DBCityCoordinates } from '../types/DataTypes';

const cityCoordinatesDao = new CityCoordinatesDao();

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  locationName: string;
}

/** Subset of Nominatim `addressdetails` object (see Nominatim JSON format). */
interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  country?: string;
}

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

/**
 * Geocoding service that converts location strings to coordinates using Nominatim API
 * and manages city coordinates in the database to avoid redundant API calls.
 */
export class GeocodingService {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

  private static readonly USER_AGENT = 'IDOL-Alumni-Map/1.0';

  /**
   * Gets coordinates for a location string, checking the database first to avoid redundant API calls
   * @param locationString - The location string to geocode (e.g., "New York, NY", "San Francisco, CA")
   * @returns The geocoding result with latitude, longitude, and normalized location name
   */
  static async getCoordinates(locationString: string): Promise<GeocodingResult> {
    const existingCoordinates = await this.findExistingCoordinates(locationString);

    if (existingCoordinates) {
      return existingCoordinates;
    }

    return this.geocodeLocation(locationString);
  }

  /**
   * Checks if coordinates for a location already exist in the database
   * @param locationString - The location string to search for
   * @returns The geocoding result if found, null otherwise
   */
  private static async findExistingCoordinates(
    locationString: string
  ): Promise<GeocodingResult | null> {
    const allCoordinates = await cityCoordinatesDao.getAllCityCoordinates();

    const normalizedSearch = this.normalizeLocationString(locationString);

    const match = allCoordinates.find(
      (coord) => this.normalizeLocationString(coord.locationName) === normalizedSearch
    );

    if (match) {
      return {
        latitude: match.latitude,
        longitude: match.longitude,
        locationName: match.locationName
      };
    }

    return null;
  }

  /**
   * Normalizes a location string for comparison
   * @param location - The location string to normalize
   * @returns Normalized location string (lowercase, trimmed)
   */
  private static normalizeLocationString(location: string): string {
    return location.toLowerCase().trim();
  }

  /**
   * Geocodes a location string using the Nominatim API
   * @param locationString - The location string to geocode
   * @returns The geocoding result with latitude, longitude, and display name
   * @throws Error if geocoding fails or location not found
   */
  private static async geocodeLocation(locationString: string): Promise<GeocodingResult> {
    const url = new URL(`${this.NOMINATIM_BASE_URL}/search`);
    url.searchParams.append('q', locationString);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '1');
    url.searchParams.append('accept-language', 'en');
    url.searchParams.append('addressdetails', '1');

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': this.USER_AGENT
        }
      });

      if (!response.ok) {
        throw new Error(`Nominatim API request failed: ${response.status} ${response.statusText}`);
      }

      const data: NominatimResponse[] = await response.json();

      if (!data || data.length === 0) {
        throw new Error(`Location not found: ${locationString}`);
      }

      const [{ lat, lon, display_name, address }] = data;
      const { city, town, village, municipality, state, country } = address ?? {};
      const place = city || town || village || municipality;
      const formatted = [place, state, country].filter(Boolean).join(', ');

      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        locationName: formatted.length > 0 ? formatted : display_name
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Geocoding failed for "${locationString}": ${error.message}`);
      }
      throw new Error(`Geocoding failed for "${locationString}": Unknown error`);
    }
  }

  /**
   * Geocodes a location and ensures there is a CityCoordinates document for it.
   * This uses existing CityCoordinatesDao helpers to create or reuse entries.
   * @param locationString - The location string to geocode
   * @returns The CityCoordinates document for that location
   */
  static async geocodeAndStore(locationString: string): Promise<DBCityCoordinates> {
    // First, try to find by existing locationName match
    const existingByName = await this.findExistingCoordinates(locationString);
    if (existingByName) {
      const byNameDoc = await cityCoordinatesDao.getCityCoordinates(
        existingByName.latitude,
        existingByName.longitude
      );
      if (byNameDoc) return byNameDoc;
    }

    // Otherwise, geocode using Nominatim
    const result = await this.geocodeLocation(locationString);

    // If we already have a document at these coordinates, reuse it
    const existingAtCoords = await cityCoordinatesDao.getCityCoordinates(
      result.latitude,
      result.longitude
    );
    if (existingAtCoords) {
      return existingAtCoords;
    }

    // Create a new CityCoordinates entry, using the canonical display_name as locationName
    return cityCoordinatesDao.createCityCoordinates({
      locationName: result.locationName,
      latitude: result.latitude,
      longitude: result.longitude,
      alumniIds: []
    });
  }
}

export default GeocodingService;
