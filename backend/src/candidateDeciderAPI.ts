import CandidateDeciderDao from './dao/CandidateDeciderDao';
import { PermissionError } from './errors';
import PermissionsManager from './permissions';

export const getAllCandidateDeciderInstances = async (): Promise<CandidateDeciderInstance[]> =>
  await CandidateDeciderDao.getAllInstances();

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
