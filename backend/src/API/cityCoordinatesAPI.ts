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
 * Gets city coordinates by location ID
 * @param locationId - The standardized location ID (e.g., "new-york-ny-us")
 * @returns the CityCoordinates document or undefined if not found
 */
export const getCityCoordinates = async (
  locationId: string
): Promise<CityCoordinates | undefined> => {
  const result = await cityCoordinatesDao.getCityCoordinates(locationId);
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

  if (!cityCoordinates.id || cityCoordinates.id === '') {
    throw new BadRequestError('City coordinates ID cannot be empty!');
  }

  if (!cityCoordinates.locationName || cityCoordinates.locationName === '') {
    throw new BadRequestError('Location name cannot be empty!');
  }

  return cityCoordinatesDao.createCityCoordinates(cityCoordinates);
};

/**
 * Updates an existing city coordinates document
 * @param locationId - The location ID to update
 * @param cityCoordinates - The updated city coordinates data
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 * @throws NotFoundError if city coordinates document doesn't exist
 * @returns the updated CityCoordinates document
 */
export const updateCityCoordinates = async (
  locationId: string,
  cityCoordinates: CityCoordinates,
  user: IdolMember
): Promise<CityCoordinates> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  const existing = await cityCoordinatesDao.getCityCoordinates(locationId);
  if (!existing) {
    throw new NotFoundError(`City coordinates with ID ${locationId} not found!`);
  }

  return cityCoordinatesDao.updateCityCoordinates(locationId, cityCoordinates);
};

/**
 * Deletes a city coordinates document
 * @param locationId - The location ID to delete
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 * @throws NotFoundError if city coordinates document doesn't exist
 */
export const deleteCityCoordinates = async (
  locationId: string,
  user: IdolMember
): Promise<void> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  const existing = await cityCoordinatesDao.getCityCoordinates(locationId);
  if (!existing) {
    throw new NotFoundError(`City coordinates with ID ${locationId} not found!`);
  }

  return cityCoordinatesDao.deleteCityCoordinates(locationId);
};

/**
 * Adds an alumni ID to a city coordinates document
 * @param locationId - The location ID
 * @param alumniId - The alumni ID to add
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 * @throws NotFoundError if city coordinates document doesn't exist
 * @returns the updated CityCoordinates document
 */
export const addAlumniToLocation = async (
  locationId: string,
  alumniId: string,
  user: IdolMember
): Promise<CityCoordinates> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  const result = await cityCoordinatesDao.addAlumniToLocation(locationId, alumniId);
  if (!result) {
    throw new NotFoundError(`City coordinates with ID ${locationId} not found!`);
  }

  return result;
};

/**
 * Removes an alumni ID from a city coordinates document
 * @param locationId - The location ID
 * @param alumniId - The alumni ID to remove
 * @param user - The user making the request
 * @throws PermissionError if user is not lead or admin
 * @throws NotFoundError if city coordinates document doesn't exist
 * @returns the updated CityCoordinates document
 */
export const removeAlumniFromLocation = async (
  locationId: string,
  alumniId: string,
  user: IdolMember
): Promise<CityCoordinates> => {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit city coordinates!`
    );
  }

  const result = await cityCoordinatesDao.removeAlumniFromLocation(locationId, alumniId);
  if (!result) {
    throw new NotFoundError(`City coordinates with ID ${locationId} not found!`);
  }

  return result;
};
