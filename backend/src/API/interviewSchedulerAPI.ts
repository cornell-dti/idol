import InterviewSchedulerDao from '../dao/InterviewSchedulerDao';
import InterviewSlotDao from '../dao/InterviewSlotDao';
import { NotFoundError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const interviewSchedulerDao = new InterviewSchedulerDao();
const interviewSlotDao = new InterviewSlotDao();

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

export const getAllInterviewSchedulerInstances = async (
  email: string,
  isApplicant: boolean
): Promise<InterviewScheduler[]> => {
  const instances = await interviewSchedulerDao.getAllInstances();

  if (!isApplicant) {
    return instances;
  }

  const filteredInstances = instances
    .filter((instance) => instance.applicants.some((applicant) => applicant.email === email))
    .map((instance) => ({
      ...instance,
      applicants: []
    }));
  return filteredInstances;
};

export const getInterviewSchedulerInstance = async (
  uuid: string,
  email: string,
  isApplicant: boolean
): Promise<InterviewScheduler> => {
  const instance = await interviewSchedulerDao.getInstance(uuid);

  if (!instance)
    throw new NotFoundError(`Interview scheduler instance with uuid ${uuid} does not exist!`);

  if (isApplicant) {
    if (instance.applicants.some((applicant) => applicant.email === email)) {
      return { ...instance, applicants: [] };
    }
    throw new PermissionError('User does not have permission to get interview scheduler instance');
  }

  return instance;
};

export const updateInterviewSchedulerInstance = async (
  user: IdolMember,
  updates: InterviewSchedulerEdit
): Promise<InterviewScheduler> => {
  if (!PermissionsManager.isLeadOrAdmin(user))
    throw new PermissionError(
      'User does not have permission to update interview scheduler instance.'
    );

  const instance = await interviewSchedulerDao.getInstance(updates.uuid);

  if (!instance)
    throw new NotFoundError(
      `Interview scheduler instance with uuid ${updates.uuid} does not exist!`
    );

  const newInstance: InterviewScheduler = {
    ...instance,
    ...updates
  };

  return interviewSchedulerDao.updateInstance(newInstance);
};

export const deleteInterviewSchedulerInstance = async (
  uuid: string,
  user: IdolMember
): Promise<void> => {
  if (!PermissionsManager.isLeadOrAdmin(user))
    throw new PermissionError(
      'User does not have permission to update interview scheduler instance.'
    );

  return interviewSchedulerDao.deleteInstance(uuid);
};

export const getInterviewSlots = async (
  uuid: string,
  email: string,
  isApplicant: boolean
): Promise<InterviewSlot[]> => {
  const slots = await interviewSlotDao.getSlotsForScheduler(uuid);

  if (isApplicant) {
    return slots.map((slot) => ({
      ...slot,
      lead: {
        netid: '',
        email: '',
        firstName: '',
        lastName: '',
        pronouns: '',
        semesterJoined: '',
        graduation: '',
        major: '',
        hometown: '',
        about: '',
        subteams: [],
        role: 'ops-lead',
        roleDescription: 'Full Team Lead'
      },
      members: [],
      applicant: slot.applicant === email ? email : ''
    }));
  }
  
  return slots;
};
