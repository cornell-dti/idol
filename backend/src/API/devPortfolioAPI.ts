import DevPortfolioDao from '../dao/DevPortfolioDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError, BadRequestError } from '../utils/errors';
import validateSubmission from '../utils/githubUtil';

export const getAllDevPortfolios = async (): Promise<DevPortfolio[]> => DevPortfolioDao.getAllInstances();


export const createNewDevPortfolio = async (
  instance: DevPortfolio, user: IdolMember
): Promise<void> => {
  const leadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!leadOrAdmin) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to create dev portfolio!`
    );
  }
  await DevPortfolioDao.createNewInstance(instance);
};

export const deleteDevPortfolio = async (
  uuid: string, user: IdolMember
): Promise<void> => {
  const leadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!leadOrAdmin) {
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

  const devPortfolio = DevPortfolioDao.getInstance(uuid) as DevPortfolio
  if(!devPortfolio) throw new BadRequestError(`Dev portfolio with uuid ${uuid} does not exist.`);
  const today = new Date();
  const todayDate = Date.parse(today.getDate()+"/"+(today.getMonth() + 1)+"/"+today.getFullYear())
  
  if(Date.parse(devPortfolio.earliestValidDate) <= todayDate && todayDate <= Date.parse(devPortfolio.deadline)) {
    submission = await validateSubmission(devPortfolio, submission)
  } else {
    submission.status = 'invalid'
  }

  return DevPortfolioDao.makeDevPortfolioSubmission(uuid, submission);
};