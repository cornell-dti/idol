import AlumniDao from '../dao/AlumniDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';

const alumniDao = new AlumniDao();

async function validateEditor(user: IdolMember): Promise<void> {
  const canEdit = await PermissionsManager.isLeadOrAdmin(user);
  if (!canEdit) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to edit alumni!`
    );
  }
}

/**
 * Gets all alumni records.
 * @returns an `Alumni[]' containing all currently available alumni records.
 * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`.
 */
export const getAllAlumni = async (): Promise<readonly Alumni[]> => alumniDao.getAllAlumni();

/**
 * Gets an alumni record from their uuid.
 * @param uuid - The uuid of the `Alumni`.
 * @returns The `Alumni` record with a matching uuid; null if they don't exist.
 * @throws `BadRequestError` if fields stored in `DBAlumni` do not match their types in `Alumni`.
 */
export const getAlumni = async (uuid: string): Promise<Alumni | null> => alumniDao.getAlumni(uuid);

/**
 * Creates a new alumni given their credentials.
 * @param alumni - The new `Alumni` to create.
 * @param user - The `IdolMember` making the request.
 * @returns The newly created `Alumni`.
 * @throws `PermissionError` if `user` does not have permission to edit members.
 * @throws `BadRequestError` if the fields stored in `alumni` do not match their types in `Alumni`.
 */
export const setAlumni = async (alumni: Alumni, user: IdolMember): Promise<Alumni> => {
  await validateEditor(user);
  return alumniDao.createAlumni(alumni);
};

/**
 * Updates a given alumni given their credentials.
 * @param alumni - the `Alumni` containing the new credentials.
 * @param user - the `IdolMember` submitting the request.
 * @returns The updated `Alumni`.
 * @throws `PermissionError` if the `user` does not have permission to edit members or if they try to edit another member's information.
 * @throws `BadRequestError` if the fields stored in `alumni` do not match their types in `Alumni`.
 */
export const updateAlumni = async (alumni: Alumni, user: IdolMember): Promise<Alumni> => {
  await validateEditor(user);
  return alumniDao.updateAlumni(alumni);
};

/**
 * Deletes an alumni given their uuid.
 * @param uuid - The uuid of the `Alumni`.
 * @param user - The `IdolMember` submitting the request.
 * @throws `PermissionError` if the `user` does not have permission to edit members or if they try to edit another member's information.
 * @throws `BadRequestError` if the fields stored in `alumni` do not match their types in `Alumni`.
 */
export const deleteAlumni = async (uuid: string, user: IdolMember): Promise<void> => {
  await validateEditor(user);
  return alumniDao.deleteAlumni(uuid);
};
