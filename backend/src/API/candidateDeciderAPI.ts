import CandidateDeciderDao from '../dao/CandidateDeciderDao';
import { NotFoundError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const candidateDeciderDao = new CandidateDeciderDao();

/**
 * Retrieves all CandidateDecider instances accessible to the user.
 * This method filters the instances based on the user's role and permissions.
 * Administrators and leads get access to all instances, while other roles are limited to instances they are authorized for.
 * @returns {Promise<CandidateDeciderInfo[]>} A promise that resolves with an array of CandidateDeciderInfo objects.
 */
export const getAllCandidateDeciderInstances = async (
  user: IdolMember
): Promise<CandidateDeciderInfo[]> => {
  const instances = await candidateDeciderDao.getAllInstances();
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);

  let filteredInstances;
  if (isLeadOrAdmin) {
    filteredInstances = instances;
  } else {
    filteredInstances = instances.filter(
      (instance) =>
        instance.authorizedRoles.includes(user.role) ||
        instance.authorizedMembers.some((member) => member.email === user.email)
    );
  }

  return filteredInstances.map((instance) => {
    const { name, uuid, isOpen } = instance;
    return { name, uuid, isOpen };
  });
};

/**
 * Creates a new CandidateDecider instance in the database.
 * This method checks if the user has admin permissions before allowing the creation of the instance.
 * @returns {Promise<CandidateDeciderInfo>} A promise that resolves with the created CandidateDeciderInfo object.
 * @throws {PermissionError} If the user does not have permission to create a new instance.
 */
export const createNewCandidateDeciderInstance = async (
  instance: CandidateDeciderInstance,
  user: IdolMember
): Promise<CandidateDeciderInfo> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError(
      'User does not have permission to create new Candidate Decider instances.'
    );
  return candidateDeciderDao.createNewInstance(instance);
};

/**
 * Updates a specific CandidateDecider instance in the database.
 * Only admin users are permitted to update instances.
 * @returns {Promise<CandidateDeciderInstance>} A promise that resolves with the updated CandidateDeciderInstance object.
 * @throws {NotFoundError} If the specified instance does not exist.
 * @throws {PermissionError} If the user does not have permission to update the instance.
 */
export const updateCandidateDeciderInstance = async (
  instanceEdit: CandidateDeciderEdit,
  user: IdolMember
): Promise<CandidateDeciderInstance> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError('User does not have permission to update Candidate Decider instance');
  const instance = await candidateDeciderDao.getInstance(instanceEdit.uuid);
  if (!instance)
    throw new NotFoundError(
      `Candidate decider instance with uuid ${instanceEdit.uuid} does not exist!`
    );
  const updatedInstance = await candidateDeciderDao.updateInstance({
    ...instance,
    ...instanceEdit
  });
  return updatedInstance;
};

/**
 * Deletes a specific CandidateDecider instance from the database.
 * Only admin users are allowed to delete instances.
 * @returns {Promise<void>} A promise that resolves when the instance is successfully deleted.
 * @throws {PermissionError} If the user does not have permission to delete the instance.
 */
export const deleteCandidateDeciderInstance = async (
  uuid: string,
  user: IdolMember
): Promise<void> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError(
      'User does not have permission to delete new Candidate Decider instance'
    );
  await candidateDeciderDao.deleteInstance(uuid);
};

/**
 * Retrieves a specific CandidateDecider instance from the database.
 * This method checks if the user has permission to access the requested instance.
 * @returns {Promise<CandidateDeciderInstance>} A promise that resolves with the CandidateDeciderInstance object if found and accessible.
 * @throws {NotFoundError} If the instance with the specified uuid does not exist.
 * @throws {PermissionError} If the user does not have access permission to the instance.
 */
export const getCandidateDeciderInstance = async (
  uuid: string,
  user: IdolMember
): Promise<CandidateDeciderInstance> => {
  const instance = await candidateDeciderDao.getInstance(uuid);
  if (!instance) {
    throw new NotFoundError(`Instance with uuid ${uuid} does not exist`);
  }
  if (!(await PermissionsManager.canAccessCandidateDeciderInstance(user, instance))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to access this Candidate Decider instance`
    );
  }
  return instance;
};

/**
 * Updates the rating and comment of a CandidateDecider instance in the database.
 * This method ensures that only users with access permission can update the rating and comment.
 * @returns {Promise<void>} A promise that resolves when the update is successfully applied.
 * @throws {NotFoundError} If the instance with the specified uuid does not exist.
 * @throws {PermissionError} If the user does not have permission to access the instance.
 */
export const updateCandidateDeciderRatingAndComment = async (
  user: IdolMember,
  uuid: string,
  id: number,
  rating: Rating,
  comment: string
): Promise<void> => {
  const instance = await candidateDeciderDao.getInstance(uuid);
  if (!instance) {
    throw new NotFoundError(`Instance with uuid ${uuid} does not exist`);
  }
  if (!(await PermissionsManager.canAccessCandidateDeciderInstance(user, instance)))
    throw new PermissionError(
      `User with email ${user.email} does not have permission to access this Candidate Decider instance`
    );

  await candidateDeciderDao.updateInstanceWithTransaction(instance, user, id, rating, comment);
};
