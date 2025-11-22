import CityCoordinatesDao from '../dao/CityCoordinatesDao';
import PermissionsManager from '../utils/permissionsManager';
import { BadRequestError, PermissionError, NotFoundError } from '../utils/errors';

const cityCoordinatesDao = new CityCoordinatesDao();

/**
 * Gets all city coordinates
 * @returns all CityCoordinates documents
 */
export const getAllCityCoordinates = (): Promise<readonly CityCoordinates[]> =>
  cityCoordinatesDao.getAllCityCoordinates();

/**
 * Gets city coordinates by lat/long coordinates
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @returns the CityCoordinates document or undefined if not found
 */
export const getCityCoordinates = async (
  latitude: number,
  longitude: number
): Promise<CityCoordinates | undefined> => {
  const result = await cityCoordinatesDao.getCityCoordinates(latitude, longitude);
  return result || undefined;
};

/**
 * Creates a new city coordinates document
 * @param cityCoordinates - The city coordinates data
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 * @throws BadRequestError if required fields are missing
 * @returns the newly created CityCoordinates document
 */
export const createCityCoordinates = async (
  cityCoordinates: CityCoordinates,
  user: IdolMember
): Promise<CityCoordinates> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  if (!cityCoordinates.latitude || !cityCoordinates.longitude) {
    throw new BadRequestError('Latitude and longitude are required!');
  }

  const existing = await cityCoordinatesDao.getCityCoordinates(
    cityCoordinates.latitude,
    cityCoordinates.longitude
  );
  if (existing) {
    throw new BadRequestError(
      `City coordinates at ${cityCoordinates.latitude},${cityCoordinates.longitude} already exists!`
    );
  }

  return cityCoordinatesDao.createCityCoordinates(cityCoordinates);
};

/**
 * Updates an existing city coordinates document
 * @param cityCoordinates - The updated city coordinates data
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 * @throws NotFoundError if city coordinates document doesn't exist
 * @returns the updated CityCoordinates document
 */
export const updateCityCoordinates = async (
  cityCoordinates: CityCoordinates,
  user: IdolMember
): Promise<CityCoordinates> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  if (!cityCoordinates.latitude || !cityCoordinates.longitude) {
    throw new BadRequestError('Latitude and longitude are required!');
  }

  const existing = await cityCoordinatesDao.getCityCoordinates(
    cityCoordinates.latitude,
    cityCoordinates.longitude
  );
  if (!existing) {
    throw new NotFoundError(
      `City coordinates at ${cityCoordinates.latitude},${cityCoordinates.longitude} not found!`
    );
  }

  return cityCoordinatesDao.updateCityCoordinates(cityCoordinates);
};

/**
 * Deletes a city coordinates document
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 */
export const deleteCityCoordinates = async (
  latitude: number,
  longitude: number,
  user: IdolMember
): Promise<void> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  return cityCoordinatesDao.deleteCityCoordinates(latitude, longitude);
};

/**
 * Adds an alumni ID to a city coordinates document or creates location if it doesn't exist
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @param alumniId - The alumni ID to add
 * @param locationName - The location name for the coordinates
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 * @returns the CityCoordinates document
 */
export const addAlumniToLocation = async (
  latitude: number,
  longitude: number,
  alumniId: string,
  locationName: string,
  user: IdolMember
): Promise<CityCoordinates> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  return cityCoordinatesDao.addAlumniToLocation(latitude, longitude, alumniId, locationName);
};

/**
 * Removes an alumni ID from a city coordinates document
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @param alumniId - The alumni ID to remove
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 * @throws NotFoundError if city coordinates document doesn't exist
 * @returns the updated CityCoordinates document
 */
export const removeAlumniFromLocation = async (
  latitude: number,
  longitude: number,
  alumniId: string,
  user: IdolMember
): Promise<CityCoordinates> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  const result = await cityCoordinatesDao.removeAlumniFromLocation(latitude, longitude, alumniId);
  if (!result) {
    throw new NotFoundError(`City coordinates at ${latitude},${longitude} not found!`);
  }

  return result;
};
