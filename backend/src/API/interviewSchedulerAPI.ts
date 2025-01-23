import InterviewSchedulerDao from '../dao/InterviewSchedulerDao';
import { PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const interviewSchedulerDao = new InterviewSchedulerDao();

// eslint-disable-next-line import/prefer-default-export
export const getAllApplicants = async (): Promise<string[]> => {
  const instances = await interviewSchedulerDao.getAllInstances();
  const applicants = new Set<string>();
  instances.forEach((inst) => inst.applicants.forEach((app) => applicants.add(app.email)));
  return Array.from(applicants);
};

export const createInterviewScheduler = async (
  instance: InterviewScheduler,
  user: IdolMember
): Promise<string> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError(
      'User does not have permission to create new Candidate Decider instances.'
    );

  return interviewSchedulerDao.createInstance(instance);
};
