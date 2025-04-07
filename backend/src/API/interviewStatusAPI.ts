import InterviewStatusDao from '../dao/InterviewStatusDao';
import { BadRequestError, NotFoundError, PermissionError } from '../utils/errors';
import PermissionsManager from '../utils/permissionsManager';

const interviewStatusDao = new InterviewStatusDao();

/**
 * Fetch all interview statuses.
 */
export const getAllInterviewStatuses = async (user : IdolMember): Promise<InterviewStatus[]> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin){
    throw new PermissionError(`User with email ${user.email} cannot get all interview statuses`);
  }
  return interviewStatusDao.getAllInterviewStatuses();
}

/**
 * Fetch a specific interview status by UUID.
 * @param uuid The UUID of the interview status document.
 * @param user - The user getting the interview status.
 */
export const getInterviewStatus = async (uuid: string, user : IdolMember): Promise<InterviewStatus> => {
  const interviewStatus = await interviewStatusDao.getInterviewStatus(uuid);
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin){
    throw new PermissionError(`User with email ${user.email} cannot get an interview status`);
  }
  if (!interviewStatus){
    throw new NotFoundError(`Interview status with UUID ${uuid} does not exist!`);
  }
  return interviewStatus;
}

/**
 * Create a new interview status.
 * @param data - The data for the new interview status.
 * @param user - The user creating the interview status.
 */
export const createInterviewStatus = async (
  data: InterviewStatus,
  user: IdolMember
): Promise<InterviewStatus> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError('User does not have permission to create an interview status.');
  }

  if (!data.netid || !data.role || !data.round || !data.status) {
    throw new BadRequestError('Missing required fields to create an interview status.');
  }

  return interviewStatusDao.createInterviewStatus(data);
};

/**
 * Update an existing interview status by UUID.
 * @param user - The user updating the interview status.
 * @param updates - The updated fields for the interview status.
 * @param uuid - The UUID of the document to update.
 */
export const updateInterviewStatus = async (
  user: IdolMember,
  updates: Partial<InterviewStatus>,
  uuid: string
): Promise<InterviewStatus> => {
  if (!PermissionsManager.isLeadOrAdmin(user))
    throw new PermissionError(
      'User does not have permission to update interview status instance.'
    );

  const instance = await interviewStatusDao.getInterviewStatus(uuid);

  if (!instance)
    throw new NotFoundError(
      `Interview status instance with uuid ${uuid} does not exist!`
    );

  const updatedData: InterviewStatus = {
    ...instance,
    ...updates,
    uuid,
  };

  return interviewStatusDao.updateInterviewStatus(updatedData);
};

/**
 * Delete an existing interview status by UUID.
 * @param uuid - The UUID of the document to delete.
 * @param user - The user deleting the interview status.
 */
export const deleteInterviewStatus = async (
  uuid: string,
  user: IdolMember
): Promise<void> => {
  if (!PermissionsManager.isLeadOrAdmin(user))
    throw new PermissionError(
      'User does not have permission to delete an interview status.'
    );

  const existing = await getInterviewStatus(uuid, user);

  if (!existing) {
    throw new NotFoundError(`Interview status with UUID ${uuid} does not exist!`);
  }
  await interviewStatusDao.deleteInterviewStatus(uuid);
};

/**
 * Fetch all interview statuses for a specific netid.
 * @param netid - The NetID of the applicant.
 */
export const getInterviewStatusesByNetId = async (netid: string, user : IdolMember): Promise<InterviewStatus[]> => {
  const interviewStatus = await interviewStatusDao.getInterviewStatusesByNetId(netid);
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin){
    throw new PermissionError(`User with email ${user.email} cannot get an interview status`);
  }
  if (!interviewStatus){
    throw new NotFoundError(`Interview status with netid ${netid} does not exist!`);
  }
  return interviewStatus;
}

/**
 * Fetch all interview statuses for a specific round.
 * @param round - The round name.
 */
export const getInterviewStatusesByRound = async (round: string, user : IdolMember): Promise<InterviewStatus[]> => {
  const interviewStatus = await interviewStatusDao.getInterviewStatusesByRound(round);
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin){
    throw new PermissionError(`User with email ${user.email} cannot get an interview status`);
  }
  if (!interviewStatus){
    throw new NotFoundError(`Interview status with for ${round} does not exist!`);
  }
  return interviewStatus;
}

/**
 * Fetch all interview statuses for a specific role.
 * @param role - The role name.
 */
export const getInterviewStatusesByRole = async (role: string, user : IdolMember): Promise<InterviewStatus[]> => {
  const interviewStatus = await interviewStatusDao.getInterviewStatusesByRole(role);
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin){
    throw new PermissionError(`User with email ${user.email} cannot get an interview status`);
  }
  if (!interviewStatus){
    throw new NotFoundError(`Interview status with role ${role} does not exist!`);
  }
  return interviewStatus;
}

