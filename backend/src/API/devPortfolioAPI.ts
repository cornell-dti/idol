import DevPortfolioDao from '../dao/DevPortfolioDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError, BadRequestError } from '../utils/errors';
import { validateSubmission, isWithinDates } from '../utils/githubUtil';

export const getAllDevPortfolios = async (
  user: IdolMember
): Promise<DevPortfolio[]> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to view dev portfolios!`
    );
  return DevPortfolioDao.getAllInstances(user);
};

export const getAllDevPortfolioInfo = async (): Promise<DevPortfolioInfo[]> => DevPortfolioDao.getAllDevPortfolioInfo();

export const getDevPortfolioInfo = async (uuid: string): Promise<DevPortfolioInfo> => DevPortfolioDao.getDevPortfolioInfo(uuid);

export const getUsersDevPortfolioSubmissions = async (
  uuid: string, 
  user: IdolMember
  ): Promise<DevPortfolioSubmission[]> => {
    return DevPortfolioDao.getUsersDevPortfolioSubmissions(uuid, user);
  };

export const getDevPortfolio = async (
  uuid: string,
  user: IdolMember
): Promise<DevPortfolio> => {
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

  const updatedDeadline = new Date(instance.deadline);
  const updatedEarliestValidDate = new Date(instance.earliestValidDate);
  const modifiedInstance = {
    ...instance,
    deadline: updatedDeadline.setHours(23, 59, 59),
    earliestValidDate: updatedEarliestValidDate.setHours(0, 0, 0)
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

  if (!isWithinDates(Date.now(), devPortfolio.earliestValidDate, devPortfolio.deadline)) {
    const startDate = new Date(devPortfolio.earliestValidDate).toDateString();
    const endDate = new Date(devPortfolio.deadline).toDateString();
    throw new BadRequestError(
      `This dev portfolio must be created between ${startDate} and ${endDate}.`
    );
  }
  return DevPortfolioDao.makeDevPortfolioSubmission(
    uuid,
    await validateSubmission(devPortfolio, submission)
  );
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
