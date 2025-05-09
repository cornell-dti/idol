import InterviewSchedulerDao from '../dao/InterviewSchedulerDao';
import InterviewSlotDao from '../dao/InterviewSlotDao';
import { NotFoundError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';
import { getMember } from './memberAPI';

const interviewSchedulerDao = new InterviewSchedulerDao();
const interviewSlotDao = new InterviewSlotDao();

const censoredApplicant: Applicant = {
  email: '',
  firstName: '',
  lastName: '',
  netid: ''
};

/**
 * Gets all Applicants
 * @returns - emails of all applicants
 */
export const getAllApplicants = async (): Promise<string[]> => {
  const instances = await interviewSchedulerDao.getAllInstances();
  const applicants = new Set<string>();
  instances.forEach((inst) => inst.applicants.forEach((app) => applicants.add(app.email)));
  return Array.from(applicants);
};

/**
 * Creates a new Interview Scheduler
 * @param instane - newly created InterviewScheduler object
 * @param user - user who is creating the instance
 * @return - uuid of the created instance.
 * The user must be an admin to create instance
 */
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

/**
 * Gets all interview scheduler instances
 * If user is an applicant, filters instances to just instances they applied to
 * @param email - the users email
 * @param isApplicant - whether the user is an applicant
 * @returns - all interview scheduler instances
 */
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

/**
 * Gets a specific interview scheduler instance
 * @param uuid - the instances uuid
 * @param email - the users email
 * @param isApplicant - whether the user is an applicant
 * @returns - the requested interview scheduler instance
 */
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

/**
 * Updates an interview scheduler instance
 * The user must be an admin or lead to update
 * @param user - member making the update
 * @param updates - the updates to apply to instance
 * @returns - the updated instance of interview scheduler
 */
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

/**
 * Deletes an interview scheduler instance
 * The user must be a lead or admin to delete
 * @param uuid - the uuid of the instance to delete
 * @param user - the user deleting the instance
 */
export const deleteInterviewSchedulerInstance = async (
  uuid: string,
  user: IdolMember
): Promise<void> => {
  if (!PermissionsManager.isLeadOrAdmin(user))
    throw new PermissionError(
      'User does not have permission to update interview scheduler instance.'
    );

  const slots = await getInterviewSlots(uuid, user.email, false);
  await Promise.all(slots.map((slot) => interviewSlotDao.deleteSlot(slot.uuid)));
  return interviewSchedulerDao.deleteInstance(uuid);
};

/**
 * Gets interview slots for a given scheduler
 * @param uuid - the uuid of the scheduler
 * @param email - the email of user
 * @param isApplicant - whether the user is an applicant
 * @returns - list of interview slots
 */
export const getInterviewSlots = async (
  uuid: string,
  email: string,
  isApplicant: boolean
): Promise<InterviewSlot[]> => {
  const slots = await interviewSlotDao.getSlotsForScheduler(uuid);

  if (isApplicant) {
    return slots.map((slot) => ({
      ...slot,
      lead: null,
      members: slot.members.map((_) => null),
      applicant:
        slot.applicant === null || slot.applicant.email === email
          ? slot.applicant
          : censoredApplicant
    }));
  }

  return slots;
};

/**
 * Updates an interview slot
 * Users can't update slots that are occupied or if they aren't an applicant of the scheduler instance
 * @param edits - the updates or edits to apply
 * @param email - email of the user
 * @param isApplicant - whether the user is an applicant
 * @returns - whether the update was successful
 */
export const updateInterviewSlot = async (
  edits: InterviewSlotEdit,
  email: string,
  isApplicant: boolean
): Promise<boolean> => {
  const slot = await interviewSlotDao.getSlot(edits.uuid);

  if (!slot) throw new NotFoundError(`Interview slot with uuid ${edits.uuid} does not exist!`);
  const scheduler = await getInterviewSchedulerInstance(
    edits.interviewSchedulerUuid,
    email,
    isApplicant
  );

  if (
    isApplicant &&
    (!scheduler.isOpen ||
      !scheduler.applicants.some((applicant) => applicant.email === email) || // Applicants should be an applicant of the scheduler instance
      (slot.applicant && slot.applicant.email !== email) || // Applicants may not edit an occupied slot
      (edits.applicant && edits.applicant.email !== email)) // Applicants may not sign up or cancel other applicants
  )
    throw new PermissionError('User does not have permission to edit this interview slot.');

  const newSlot: InterviewSlot = {
    ...slot,
    ...edits
  };

  const user = await getMember(email);

  return interviewSlotDao.updateSlot(
    newSlot,
    user !== undefined && (await PermissionsManager.isLeadOrAdmin(user))
  );
};

/**
 * Deletes a specific interview slot
 * User must be a lead of admin to delete
 * @param uuid - the uuid of slot
 * @param user - the user deleting the slot
 */
export const deleteInterviewSlot = async (uuid: string, user: IdolMember): Promise<void> => {
  if (!PermissionsManager.isLeadOrAdmin(user))
    throw new PermissionError('User does not have permission to update interview slots.');

  return interviewSlotDao.deleteSlot(uuid);
};

/**
 * Adds new interview slots to instance
 * User must be an admin or lead to add slots, slots are added to database
 * @param slots - the slots to add
 * @param user - the user adding the slots
 * @returns - the new interview slots
 */
export const addInterviewSlots = async (
  slots: InterviewSlot[],
  user: IdolMember
): Promise<InterviewSlot[]> => {
  if (!PermissionsManager.isLeadOrAdmin(user))
    throw new PermissionError('User does not have permission to create interview slots.');

  return interviewSlotDao.addSlots(slots);
};
