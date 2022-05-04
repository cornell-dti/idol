import DevPortfolioDao from '../dao/DevPortfolioDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError, BadRequestError, UnauthorizedError } from '../utils/errors';
import validateSubmission from '../utils/githubUtil';

export const getAllDevPortfolios = async (): Promise<DevPortfolio[]> =>
  DevPortfolioDao.getAllInstances();

export const createNewDevPortfolio = async (
  instance: DevPortfolio,
  user: IdolMember
): Promise<void> => {
  const canCreateDevPortfolio = await PermissionsManager.isLeadOrAdmin(user);
  if (!canCreateDevPortfolio) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to create dev portfolio!`
    );
  }
  await DevPortfolioDao.createNewInstance(instance);
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
): Promise<void> => {
  const devPortfolio = DevPortfolioDao.getInstance(uuid) as DevPortfolio;
  if (!devPortfolio) throw new BadRequestError(`Dev portfolio with uuid ${uuid} does not exist.`);

  if (Date.now() > devPortfolio.deadline) {
    throw new UnauthorizedError('This dev portfolio is past due.');
  }
  return DevPortfolioDao.makeDevPortfolioSubmission(
    uuid,
    await validateSubmission(devPortfolio, submission)
  );
};
