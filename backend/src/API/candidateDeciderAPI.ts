import CandidateDeciderDao from '../dao/CandidateDeciderDao';
import { NotFoundError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const candidateDeciderDao = new CandidateDeciderDao();

export const getAllCandidateDeciderInstances = async (
  user: IdolMember
): Promise<CandidateDeciderInfo[]> => candidateDeciderDao.getAllInstances();

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

export const updateCandidateDeciderRating = async (
  user: IdolMember,
  uuid: string,
  id: number,
  rating: Rating
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
  const updatedInstance: CandidateDeciderInstance = {
    ...instance,
    candidates: instance.candidates.map((cd) =>
      cd.id !== id
        ? cd
        : {
            ...cd,
            ratings: [
              ...cd.ratings.filter((rt) => rt.reviewer.email !== user.email),
              { reviewer: user, rating }
            ]
          }
    )
  };
  candidateDeciderDao.updateInstance(updatedInstance);
};

export const updateCandidateDeciderComment = async (
  user: IdolMember,
  uuid: string,
  id: number,
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
  const updatedInstance: CandidateDeciderInstance = {
    ...instance,
    candidates: instance.candidates.map((cd) =>
      cd.id !== id
        ? cd
        : {
            ...cd,
            comments: [
              ...cd.comments.filter((cmt) => cmt.reviewer.email !== user.email),
              { reviewer: user, comment }
            ]
          }
    )
  };
  candidateDeciderDao.updateInstance(updatedInstance);
};
