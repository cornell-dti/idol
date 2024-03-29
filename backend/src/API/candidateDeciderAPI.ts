import CandidateDeciderDao from '../dao/CandidateDeciderDao';
import { NotFoundError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const candidateDeciderDao = new CandidateDeciderDao();

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
