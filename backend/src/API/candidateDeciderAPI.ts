import CandidateDeciderDao from '../dao/CandidateDeciderDao';
import { NotFoundError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const candidateDeciderDao = new CandidateDeciderDao();

/**
 * Retrieves all Candidate Decider instances, filtering based on the user's role and permissions.
 * @param {IdolMember} user - The user requesting the instances.
 * @returns {Promise<CandidateDeciderInfo[]>} - A promise that resolves to an array of CandidateDeciderInfo objects.
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
 * Creates a new Candidate Decider instance.
 * @param {CandidateDeciderInstance} instance - The instance details to be created.
 * @param {IdolMember} user - The user creating the instance.
 * @returns {Promise<CandidateDeciderInfo>} - A promise that resolves to the created CandidateDeciderInfo.
 * @throws {PermissionError} - If the user lacks admin permissions.
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
 * Updates an existing Candidate Decider instance.
 * @param {CandidateDeciderEdit} instanceEdit - The edits to be applied to the instance.
 * @param {IdolMember} user - The user performing the update.
 * @returns {Promise<CandidateDeciderInstance>} - A promise that resolves to the updated CandidateDeciderInstance.
 * @throws {PermissionError} - If the user lacks admin permissions.
 * @throws {NotFoundError} - If the instance does not exist.
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
 * Deletes a Candidate Decider instance.
 * @param {string} uuid - The unique identifier of the instance to be deleted.
 * @param {IdolMember} user - The user attempting to delete the instance.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {PermissionError} - If the user lacks admin permissions.
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
 * Retrieves a specific Candidate Decider instance.
 * @param {string} uuid - The unique identifier of the instance.
 * @param {IdolMember} user - The user requesting the instance.
 * @returns {Promise<CandidateDeciderInstance>} - A promise that resolves to the CandidateDeciderInstance.
 * @throws {NotFoundError} - If the instance does not exist.
 * @throws {PermissionError} - If the user lacks the necessary permissions.
 */
export const getCandidateDeciderInstance = async (
  uuid: string,
  user: IdolMember
): Promise<CandidateDeciderInstance> => {
  const instance = await candidateDeciderDao.getInstance(uuid);
  if (!instance) {
    throw new NotFoundError(`Instance with uuid ${uuid} does not exist`);
  }
  if (
    !(
      (await PermissionsManager.isAdmin(user)) ||
      instance.authorizedMembers.includes(user) ||
      instance.authorizedRoles.includes(user.role)
    )
  ) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to access this Candidate Decider instance`
    );
  }
  return instance;
};

/**
 * Updates the rating and comment for a Candidate Decider instance.
 * @param {IdolMember} user - The user updating the rating and comment.
 * @param {string} uuid - The unique identifier of the instance.
 * @param {number} id - The identifier of the specific candidate.
 * @param {Rating} rating - The new rating.
 * @param {string} comment - The new comment.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {NotFoundError} - If the instance does not exist.
 * @throws {PermissionError} - If the user lacks the necessary permissions.
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
  if (
    !(
      (await PermissionsManager.isAdmin(user)) ||
      instance.authorizedMembers.includes(user) ||
      instance.authorizedRoles.includes(user.role)
    )
  )
    throw new PermissionError(
      `User with email ${user.email} does not have permission to access this Candidate Decider instance`
    );

  await candidateDeciderDao.updateInstanceWithTransaction(instance, user, id, rating, comment);
};
