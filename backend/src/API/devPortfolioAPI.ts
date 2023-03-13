import { DateTime } from 'luxon';
import DevPortfolioDao from '../dao/DevPortfolioDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError, BadRequestError } from '../utils/errors';
import { validateSubmission, isWithinDates } from '../utils/githubUtil';

const zonedTime = (timestamp: number, ianatz = 'America/New_York') =>
  DateTime.fromMillis(timestamp, { zone: ianatz });

export const getAllDevPortfolios = async (user: IdolMember): Promise<DevPortfolio[]> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to view dev portfolios!`
    );
  return DevPortfolioDao.getAllInstances();
};

export const getAllDevPortfolioInfo = async (): Promise<DevPortfolioInfo[]> =>
  DevPortfolioDao.getAllDevPortfolioInfo();

export const getDevPortfolioInfo = async (uuid: string): Promise<DevPortfolioInfo> =>
  DevPortfolioDao.getDevPortfolioInfo(uuid);

export const getUsersDevPortfolioSubmissions = async (
  uuid: string,
  user: IdolMember
): Promise<DevPortfolioSubmission[]> => DevPortfolioDao.getUsersDevPortfolioSubmissions(uuid, user);

export const getDevPortfolio = async (uuid: string, user: IdolMember): Promise<DevPortfolio> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to view dev portfolios!`
    );
  return DevPortfolioDao.getDevPortfolio(uuid);
};

export const createNewDevPortfolio = async (
  instance: DevPortfolio,
  user: IdolMember
): Promise<DevPortfolio> => {
  const canCreateDevPortfolio = await PermissionsManager.isLeadOrAdmin(user);
  if (!canCreateDevPortfolio) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to create dev portfolio!`
    );
  }
  if (
    !instance.name ||
    instance.name.length === 0 ||
    instance.deadline < instance.earliestValidDate ||
    (instance.lateDeadline && instance.lateDeadline < instance.deadline)
  ) {
    throw new BadRequestError(
      `Unable to create the new dev portfolio instance: The provided dev portfolio is invalid.`
    );
  }

  const updatedDeadline = zonedTime(instance.deadline).endOf('day');
  const updatedEarliestValidDate = zonedTime(instance.earliestValidDate).startOf('day');
  const updatedLateDeadline = instance.lateDeadline
    ? zonedTime(instance.lateDeadline).endOf('day')
    : null;

  const modifiedInstance: DevPortfolio = {
    ...instance,
    deadline: updatedDeadline.valueOf(),
    earliestValidDate: updatedEarliestValidDate.valueOf(),
    lateDeadline: updatedLateDeadline ? updatedLateDeadline.valueOf() : null
  };

  return DevPortfolioDao.createNewInstance(modifiedInstance);
};

export const deleteDevPortfolio = async (uuid: string, user: IdolMember): Promise<void> => {
  const canDeleteDevPortfolio = await PermissionsManager.isLeadOrAdmin(user);
  if (!canDeleteDevPortfolio) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to delete dev portfolio!`
    );
  }
  await DevPortfolioDao.deleteInstance(uuid);
};

export const makeDevPortfolioSubmission = async (
  uuid: string,
  submission: DevPortfolioSubmission
): Promise<DevPortfolioSubmission> => {
  const devPortfolio = await DevPortfolioDao.getDevPortfolio(uuid);
  if (!devPortfolio) throw new BadRequestError(`Dev portfolio with uuid ${uuid} does not exist.`);

  const latestDeadline = devPortfolio.lateDeadline
    ? devPortfolio.lateDeadline
    : devPortfolio.deadline;

  if (!isWithinDates(Date.now(), devPortfolio.earliestValidDate, latestDeadline)) {
    const startDate = new Date(devPortfolio.earliestValidDate).toDateString();
    const endDate = new Date(latestDeadline).toDateString();
    throw new BadRequestError(
      `This dev portfolio must be created between ${startDate} and ${endDate}.`
    );
  }
  const validatedSubmission = await validateSubmission(devPortfolio, submission);
  return DevPortfolioDao.makeDevPortfolioSubmission(uuid, {
    ...validatedSubmission,
    isLate: Boolean(devPortfolio.lateDeadline && Date.now() > devPortfolio.deadline)
  });
};

export const updateSubmissions = async (
  uuid: string,
  updatedSubmissions: DevPortfolioSubmission[],
  user: IdolMember
): Promise<DevPortfolio> => {
  const canChangeSubmission = await PermissionsManager.isLeadOrAdmin(user);

  if (!canChangeSubmission) {
    throw new PermissionError(
      `User with email ${user.email} does not have permission to update dev portfolio submissions`
    );
  }

  const devPortfolio = await DevPortfolioDao.getInstance(uuid);
  if (!devPortfolio) {
    throw new BadRequestError(`Dev portfolio with uuid: ${uuid} does not exist`);
  }

  const updatedDP = {
    ...devPortfolio,
    submissions: updatedSubmissions
  };
  await DevPortfolioDao.updateInstance(updatedDP);
  return updatedDP;
};

export const regradeSubmissions = async (uuid: string, user: IdolMember): Promise<DevPortfolio> => {
  const canRequestRegrade = await PermissionsManager.isLeadOrAdmin(user);
  if (!canRequestRegrade)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to regrade dev portfolio submissions`
    );

  const devPortfolio = await DevPortfolioDao.getInstance(uuid);
  if (!devPortfolio) {
    throw new BadRequestError(`Dev portfolio with uuid: ${uuid} does not exist`);
  }

  const updatedDP = {
    ...devPortfolio,
    submissions: await Promise.all(
      devPortfolio.submissions.map((submission) => validateSubmission(devPortfolio, submission))
    )
  };
  await DevPortfolioDao.updateInstance(updatedDP);
  return updatedDP;
};
