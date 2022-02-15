import CandidateDeciderDao from './dao/CandidateDeciderDao';
import { PermissionError } from './errors';
import PermissionsManager from './permissions';

export const getAllCandidateDeciderInstances = async (
  user: IdolMember
): Promise<CandidateDeciderInfo[]> => {
  const hasPermission = PermissionsManager.isAdmin(user);
  if (!hasPermission) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to Candidate Decider!`
    );
  }
  return await CandidateDeciderDao.getAllInstances();
};

export const createNewCandidateDeciderInstance = async (
  instance: CandidateDeciderInstance,
  user: IdolMember
) => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError(
      'User does not have permission to create new Candidate Decider instance'
    );
  await CandidateDeciderDao.createNewInstance(instance);
  return instance;
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
