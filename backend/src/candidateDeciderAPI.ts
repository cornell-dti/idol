import CandidateDeciderDao from './dao/CandidateDeciderDao';
import { NotFoundError, PermissionError } from './errors';
import PermissionsManager from './permissions';

export const getAllCandidateDeciderInstances = async (
  user: IdolMember
): Promise<CandidateDeciderInfo[]> => CandidateDeciderDao.getAllInstances();

export const createNewCandidateDeciderInstance = async (
  instance: CandidateDeciderInstance,
  user: IdolMember
): Promise<CandidateDeciderInfo> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError(
      'User does not have permission to create new Candidate Decider instance'
    );
  return CandidateDeciderDao.createNewInstance(instance);
};

export const toggleCandidateDeciderInstance = async (
  uuid: string,
  user: IdolMember
): Promise<void> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError(
      'User does not have permission to create new Candidate Decider instance'
    );
  await CandidateDeciderDao.toggleInstance(uuid);
};

export const deleteCandidateDeciderInstance = async (
  uuid: string,
  user: IdolMember
): Promise<void> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError(
      'User does not have permission to create new Candidate Decider instance'
    );
  await CandidateDeciderDao.deleteInstance(uuid);
};

export const getCandidateDeciderInstnace = async (
  uuid: string,
  user: IdolMember
): Promise<CandidateDeciderInstance> => {
  const instance = await CandidateDeciderDao.getInstance(uuid);
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
