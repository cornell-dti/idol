import { DateTime } from 'luxon';
import DevPortfolioDao from '../dao/DevPortfolioDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError, BadRequestError, NotFoundError } from '../utils/errors';
import { validateSubmission, isWithinDates } from '../utils/githubUtil';

const zonedTime = (timestamp: number, ianatz = 'America/New_York') =>
  DateTime.fromMillis(timestamp, { zone: ianatz });

export const devPortfolioDao = new DevPortfolioDao();

/**
 * Gets all Dev Portfolios
 * @param user - The user that is requesting to get all portfolios
 * @returns - All Dev Portfolios (if the user is a lead or admin)
 */
export const getAllDevPortfolios = async (user: IdolMember): Promise<DevPortfolio[]> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to view dev portfolios!`
    );
  return devPortfolioDao.getAllInstances();
};

/**
 * Gets all Dev Portfolios without the submissions field
 */
export const getAllDevPortfolioInfo = async (): Promise<DevPortfolioInfo[]> =>
  devPortfolioDao.getAllDevPortfolioInfo();

/**
 * Gets a specific dev portfolio without submissions
 * @param uuid - DB uuid of the portfolio we want to get information from
 */
export const getDevPortfolioInfo = async (uuid: string): Promise<DevPortfolioInfo> =>
  devPortfolioDao.getDevPortfolioInfo(uuid);

/**
 * Gets a specific member's Dev Portfolio by checking if the member id of a submission
 * is the user's email
 * @param uuid - DB uuid of DevPortfolio
 * @param user - the member we are getting a portfolio from
 */
export const getUsersDevPortfolioSubmissions = async (
  uuid: string,
  user: IdolMember
): Promise<DevPortfolioSubmission[]> => devPortfolioDao.getUsersDevPortfolioSubmissions(uuid, user);

/**
 * Gets a specific Dev Portfolio
 * @param user - The user that is requesting to get all portfolios
 * @param uuid - DB uuid of DevPortfolio
 * @returns - The specific Dev Portfolio (if the user is a lead or admin)
 */
export const getDevPortfolio = async (uuid: string, user: IdolMember): Promise<DevPortfolio> => {
  const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
  if (!isLeadOrAdmin)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to view dev portfolios!`
    );
  const devPortfolio = await devPortfolioDao.getInstance(uuid);
  if (!devPortfolio) throw new NotFoundError(`Dev portfolio with uuid: ${uuid} does not exist!`);
  return devPortfolio;
};

/**
 * Creates a new Dev Portfolio
 * @param instance - The new Dev Portfolio instance
 * @param user - The user that is requesting to create a dev portfolio
 * @returns - The new Dev Portfolio (if successfully created)
 */
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
  return devPortfolioDao.createNewInstance(modifiedInstance);
};

/**
 * Updates a Dev Portfolio
 * @param devPortfolio - The modified Dev Portfolio instance
 * @param user - The user that is requesting to modify a dev portfolio
 * @returns - The updated Dev Portfolio (if successfully modified)
 */
export const updateDevPortfolio = async (
  devPortfolio: DevPortfolio,
  user: IdolMember
): Promise<DevPortfolioInfo> => {
  const canEditDevPortfolio = await PermissionsManager.canEditDevPortfolio(user);
  if (!canEditDevPortfolio) {
    throw new PermissionError(
      `User with email ${user.email} does not have permissions to update dev portfolios`
    );
  }
  const updatedDevPortfolio = await devPortfolioDao.updateInstance(devPortfolio);
  return updatedDevPortfolio;
};

/**
 * Deletes new Dev Portfolio (if the user has permission)
 * @param uuid - DB uuid of DevPortfolio
 * @param user - The user that is requesting to delete a dev portfolio
 */
export const deleteDevPortfolio = async (uuid: string, user: IdolMember): Promise<void> => {
  const canDeleteDevPortfolio = await PermissionsManager.isLeadOrAdmin(user);
  if (!canDeleteDevPortfolio) {
    throw new PermissionError(
      `User with email: ${user.email} does not have permission to delete dev portfolio!`
    );
  }
  await devPortfolioDao.deleteInstance(uuid);
};

/**
 * Makes a Dev Portfolio submission
 * @param uuid - DB uuid of DevPortfolio
 * @param submission - The submission that is being made
 * @returns - The Dev Portfolio submission (if successfully made)
 */
export const makeDevPortfolioSubmission = async (
  uuid: string,
  submission: DevPortfolioSubmission
): Promise<DevPortfolioSubmission> => {
  const devPortfolio = await devPortfolioDao.getInstance(uuid);
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
  return devPortfolioDao.makeDevPortfolioSubmission(uuid, {
    ...validatedSubmission,
    isLate: Boolean(devPortfolio.lateDeadline && Date.now() > devPortfolio.deadline)
  });
};

/**
 * Updates Dev Portfolio submissions
 * @param uuid - DB uuid of DevPortfolio
 * @param updatedSubmissions - The updated Dev Portfolio submissions
 * @param user - The user that is requesting to modify submissions
 * @returns - The updated Dev Portfolio (if the submissions are successfully modified)
 */
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

  const devPortfolio = await devPortfolioDao.getInstance(uuid);
  if (!devPortfolio) {
    throw new BadRequestError(`Dev portfolio with uuid: ${uuid} does not exist`);
  }

  const updatedDP = {
    ...devPortfolio,
    submissions: updatedSubmissions
  };
  await devPortfolioDao.updateInstance(updatedDP);
  return updatedDP;
};

/**
 * Regrades Dev Portfolio submissions
 * @param uuid - DB uuid of DevPortfolio
 * @param user - The user that is requesting to regrade submissions
 * @returns - The updated Dev Portfolio (if the submissions are successfully regraded)
 */
export const regradeSubmissions = async (uuid: string, user: IdolMember): Promise<DevPortfolio> => {
  const canRequestRegrade = await PermissionsManager.isLeadOrAdmin(user);
  if (!canRequestRegrade)
    throw new PermissionError(
      `User with email ${user.email} does not have permission to regrade dev portfolio submissions`
    );

  const devPortfolio = await devPortfolioDao.getInstance(uuid);
  if (!devPortfolio) {
    throw new BadRequestError(`Dev portfolio with uuid: ${uuid} does not exist`);
  }

  const updatedDP = {
    ...devPortfolio,
    submissions: await Promise.all(
      devPortfolio.submissions.map((submission) => validateSubmission(devPortfolio, submission))
    )
  };
  await devPortfolioDao.updateInstance(updatedDP);
  return updatedDP;
};
