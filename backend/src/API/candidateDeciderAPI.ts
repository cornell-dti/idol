import CandidateDeciderDao from '../dao/CandidateDeciderDao';
import CandidateDeciderReviewDao from '../dao/CandidateDeciderReviewDao';
import { NotFoundError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const candidateDeciderDao = new CandidateDeciderDao();
const candidateDeciderReviewDao = new CandidateDeciderReviewDao();

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
 * Returns whether a CandidateDecier instance is assigned to the user
 * This method checks if a CandidateDecier instance is assigned to the user
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the user has access to the instance
 */
export const hasCandidateDeciderInstance = async (user: IdolMember): Promise<boolean> => {
  if (await PermissionsManager.isLeadOrAdmin(user)) return true;
  const instances = await candidateDeciderDao.getAllInstances();
  if (
      instances.some(
        (instance) =>
          instance.authorizedMembers.some((member) => member.email === user.email) ||
          instance.authorizedRoles.includes(user.role)
      )
    ) {
    return true;
  }
  return false;
};

/**
 * Creates a new CandidateDecider instance in the database.
 * This method checks if the user has admin permissions before allowing the creation of the instance.
 * @returns {Promise<CandidateDeciderInfo>} A promise that resolves with the created CandidateDeciderInfo object.
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
 * Retrieves reviews for a specific CandidateDecider instance from the database.
 * This method checks if the user has permission to access the requested instance's reviews.
 * @returns {Promise<CandidateDeciderReview[]>} A promise that resolves with a CandidateDeciderReview array if found and accessible.
 */
export const getCandidateDeciderReviews = async (
  uuid: string,
  user: IdolMember
): Promise<CandidateDeciderReview[]> => {
  const instance = await candidateDeciderDao.getInstance(uuid);
  if (!instance) {
    throw new NotFoundError(`Instance with uuid ${uuid} does not exist`);
  }
  if (!(await PermissionsManager.canAccessCandidateDeciderInstance(user, instance))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to access this Candidate Decider instance`
    );
  }
  const reviews = await candidateDeciderReviewDao.getReviewsByCandidateDeciderInstance(uuid);
  return reviews;
};

/**
 * Updates the rating and comment of a CandidateDecider instance in the database.
 * This method ensures that only users with access permission can update the rating and comment.
 * @param user - User who made the review
 * @param uuid - Candidate decider uuid
 * @param id - Candidate's id within the candidate decider instance
 * @param rating - Rating for candidate
 * @param comment - Comment for candidate
 * @returns {Promise<void>} A promise that resolves when the update is successfully applied.
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

  await candidateDeciderReviewDao.createNewReview(instance, user, id, rating, comment);
};
