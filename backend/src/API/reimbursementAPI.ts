import { v4 as uuidv4 } from 'uuid';
import ReimbursementRequestDao from '../dao/ReimbursementRequestDao';
import ReimbursementTeamDao from '../dao/ReimbursementTeamDao';
import PermissionsManager from '../utils/permissionsManager';
import { BadRequestError, NotFoundError, PermissionError } from '../utils/errors';

const requestDao = new ReimbursementRequestDao();
const teamDao = new ReimbursementTeamDao();

//teams

export const getAllReimbursementTeams = async (user: IdolMember): Promise<ReimbursementTeam[]> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to view reimbursement teams.`
    );
  }
  return teamDao.getAllTeams();
};

export const getReimbursementTeam = async (
  teamId: string,
  user: IdolMember
): Promise<ReimbursementTeam> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to view reimbursement team ${teamId}.`
    );
  }
  const team = await teamDao.getTeam(teamId);
  if (!team) throw new NotFoundError(`Reimbursement team with ID ${teamId} not found.`);
  return team;
};

export const createReimbursementTeam = async (
  team: ReimbursementTeam,
  user: IdolMember
): Promise<ReimbursementTeam> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to create a reimbursement team.`
    );
  }
  if (!team.teamId || !team.teamName) {
    throw new BadRequestError('teamId and teamName are required.');
  }
  const existing = await teamDao.getTeam(team.teamId);
  if (existing) throw new BadRequestError(`Team with ID ${team.teamId} already exists.`);

  const newTeam: ReimbursementTeam = {
    ...team,
    totalSpent: team.totalSpent ?? 0,
    assignedAdmins: team.assignedAdmins ?? []
  };
  return teamDao.createTeam(newTeam);
};

export const updateReimbursementTeam = async (
  team: ReimbursementTeam,
  user: IdolMember
): Promise<ReimbursementTeam> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to update a reimbursement team.`
    );
  }
  const existing = await teamDao.getTeam(team.teamId);
  if (!existing) throw new NotFoundError(`Reimbursement team with ID ${team.teamId} not found.`);
  return teamDao.updateTeam(team);
};

export const deleteReimbursementTeam = async (teamId: string, user: IdolMember): Promise<void> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to delete a reimbursement team.`
    );
  }
  const existing = await teamDao.getTeam(teamId);
  if (!existing) throw new NotFoundError(`Reimbursement team with ID ${teamId} not found.`);
  await teamDao.deleteTeam(teamId);
};

export const resetReimbursementTeamBudget = async (
  teamId: string,
  newBudget: number | undefined,
  user: IdolMember
): Promise<ReimbursementTeam> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to reset a team's budget.`
    );
  }
  return teamDao.resetTeamBudget(teamId, newBudget);
};

//requests

export const getAllReimbursementRequests = async (
  user: IdolMember
): Promise<ReimbursementRequest[]> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to view all reimbursement requests.`
    );
  }
  return requestDao.getAllRequests();
};

export const getMyReimbursementRequests = async (
  user: IdolMember
): Promise<ReimbursementRequest[]> => requestDao.getRequestsByRequester(user.email);

export const getReimbursementRequest = async (
  requestId: string,
  user: IdolMember
): Promise<ReimbursementRequest> => {
  const request = await requestDao.getRequest(requestId);
  if (!request) throw new NotFoundError(`Reimbursement request with ID ${requestId} not found.`);
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && request.requesterId !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to view request ${requestId}.`
    );
  }
  return request;
};

export const createReimbursementRequest = async (
  request: Partial<ReimbursementRequest>,
  user: IdolMember
): Promise<ReimbursementRequest> => {
  if (!request.teamId) throw new BadRequestError('teamId is required.');
  if (request.amount == null || request.amount <= 0) {
    throw new BadRequestError('amount must be a positive number.');
  }
  const team = await teamDao.getTeam(request.teamId);
  if (!team) throw new NotFoundError(`Reimbursement team with ID ${request.teamId} not found.`);

  const now = Date.now();
  const newRequest: ReimbursementRequest = {
    requestId: request.requestId ?? uuidv4(),
    requesterId: user.email,
    requesterPhoneNumber: request.requesterPhoneNumber ?? '',
    requesterAddress: request.requesterAddress ?? '',
    teamId: request.teamId,
    amount: request.amount,
    reason: request.reason ?? '',
    attendees: request.attendees ?? [],
    dateOfPurchase: request.dateOfPurchase ?? now,
    dateSubmitted: now,
    status: 'pending',
    receiptUrl: request.receiptUrl ?? '',
    messages: [],
    statusLog: [{ status: 'pending', changedBy: user.email, changedAt: now, note: 'Submitted' }],
    isImmutable: false,
    resolvedAt: null
  };
  return requestDao.createRequest(newRequest);
};

export const updateReimbursementRequest = async (
  request: ReimbursementRequest,
  user: IdolMember
): Promise<ReimbursementRequest> => {
  const existing = await requestDao.getRequest(request.requestId);
  if (!existing) {
    throw new NotFoundError(`Reimbursement request with ID ${request.requestId} not found.`);
  }
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && existing.requesterId !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to edit request ${request.requestId}.`
    );
  }
  if (existing.isImmutable) {
    throw new BadRequestError('Cannot update an immutable reimbursement request.');
  }
  const merged: ReimbursementRequest = {
    ...request,
    requesterId: existing.requesterId,
    dateSubmitted: existing.dateSubmitted,
    status: existing.status,
    statusLog: existing.statusLog,
    messages: existing.messages,
    resolvedAt: existing.resolvedAt
  };
  return requestDao.updateRequest(merged);
};

export const deleteReimbursementRequest = async (
  requestId: string,
  user: IdolMember
): Promise<void> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to delete a reimbursement request.`
    );
  }
  const existing = await requestDao.getRequest(requestId);
  if (!existing) throw new NotFoundError(`Reimbursement request with ID ${requestId} not found.`);
  await requestDao.deleteRequest(requestId);
};

export const updateReimbursementRequestStatus = async (
  requestId: string,
  newStatus: ReimbursementRequestStatus,
  note: string,
  user: IdolMember
): Promise<ReimbursementRequest> => {
  if (!(await PermissionsManager.isLeadOrAdmin(user))) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to change request status.`
    );
  }
  const existing = await requestDao.getRequest(requestId);
  if (!existing) throw new NotFoundError(`Reimbursement request with ID ${requestId} not found.`);

  const updated = await requestDao.updateStatus(requestId, newStatus, user.email, note);

  if (newStatus === 'settled' && existing.status !== 'settled') {
    await teamDao.updateTotalSpent(updated.teamId, updated.amount);
  }
  return updated;
};

export const addReimbursementRequestMessage = async (
  requestId: string,
  content: string,
  user: IdolMember
): Promise<ReimbursementRequest> => {
  if (!content || !content.trim()) throw new BadRequestError('Message content is required.');
  const existing = await requestDao.getRequest(requestId);
  if (!existing) throw new NotFoundError(`Reimbursement request with ID ${requestId} not found.`);

  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin && existing.requesterId !== user.email) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to message on request ${requestId}.`
    );
  }
  return requestDao.addMessage(requestId, {
    authorId: user.email,
    content,
    sentAt: Date.now()
  });
};
