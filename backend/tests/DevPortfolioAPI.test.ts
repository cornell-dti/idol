import DevPortfolioDao from '../src/dao/DevPortfolioDao'; // eslint-disable-line  @typescript-eslint/no-unused-vars
import PermissionsManager from '../src/utils/permissionsManager';
import { fakeIdolMember, fakeDevPortfolio, fakeDevPortfolioSubmission } from './data/createData';
import {
  getDevPortfolio,
  deleteDevPortfolio,
  createNewDevPortfolio,
  makeDevPortfolioSubmission
} from '../src/API/devPortfolioAPI';
import { PermissionError, BadRequestError } from '../src/utils/errors';
import * as githubUtils from '../src/utils/githubUtil';

describe('User is not lead or admin', () => {
  beforeAll(() => {
    const mockIsLeadOrAdmin = jest.fn().mockResolvedValue(false);
    PermissionsManager.isLeadOrAdmin = mockIsLeadOrAdmin;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user = fakeIdolMember();
  const devPortfolio = fakeDevPortfolio();

  test('test', async () => {
    const isLeadOrAdmin = await PermissionsManager.isLeadOrAdmin(user);
    expect(isLeadOrAdmin).toBeDefined();
  });

  test('getDevPortfolio should throw permission error', async () => {
    await expect(getDevPortfolio('fake-uuid', user)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have permission to view dev portfolios!`
      )
    );
  });

  test('createDevPortfolio should throw permission error', async () => {
    await expect(createNewDevPortfolio(devPortfolio, user)).rejects.toThrow(
      new PermissionError(
        `User with email: ${user.email} does not have permission to create dev portfolio!`
      )
    );
  });

  test('deleteDevPortfolio shoudl throw permission error', async () => {
    await expect(deleteDevPortfolio('fake-uuid', user)).rejects.toThrow(
      new PermissionError(
        `User with email: ${user.email} does not have permission to delete dev portfolio!`
      )
    );
  });
});

describe('User is lead or admin', () => {
  const devPortfolio = fakeDevPortfolio();
  const user = fakeIdolMember();
  user.email = 'hl738@cornell.edu';

  beforeAll(() => {
    const mockIsLeadOrAdmin = jest.fn().mockResolvedValue(true);
    const mockGetInstance = jest.fn().mockResolvedValue(devPortfolio);
    const mockCreateInstance = jest.fn().mockResolvedValue(devPortfolio);
    const mockDeleteInstance = jest.fn().mockResolvedValue(undefined);

    PermissionsManager.isLeadOrAdmin = mockIsLeadOrAdmin;
    DevPortfolioDao.createNewInstance = mockCreateInstance;
    DevPortfolioDao.getDevPortfolio = mockGetInstance;
    DevPortfolioDao.deleteInstance = mockDeleteInstance;
  });

  test('getDevPortfolio should be successful', async () => {
    const dp = await getDevPortfolio(devPortfolio.uuid, user);
    expect(PermissionsManager.isLeadOrAdmin).toBeCalled();
    expect(DevPortfolioDao.getDevPortfolio).toBeCalled();
    expect(dp.uuid).toEqual(devPortfolio.uuid);
  });

  test('createDevPortfolio should be successful', async () => {
    await createNewDevPortfolio(devPortfolio, user);
    expect(PermissionsManager.isLeadOrAdmin).toBeCalled();
    expect(DevPortfolioDao.createNewInstance).toBeCalled();
  });

  test('deleteDevPortfolio should be successful', async () => {
    await deleteDevPortfolio(devPortfolio.uuid, user);
    expect(PermissionsManager.isLeadOrAdmin).toBeCalled();
    expect(DevPortfolioDao.deleteInstance).toBeCalled();
  });
});

describe('makeDevPortfolioSubmission tests', () => {
  const dpSubmission = fakeDevPortfolioSubmission();
  const devPortfolio = fakeDevPortfolio();

  beforeAll(() => {
    const mockMakeDevPortfolioSubmission = jest.fn().mockResolvedValue(dpSubmission);
    DevPortfolioDao.makeDevPortfolioSubmission = mockMakeDevPortfolioSubmission;
  });

  it('should throw BadRequestError', async () => {
    const mockGetInstance = jest.fn().mockResolvedValue(null);
    DevPortfolioDao.getInstance = mockGetInstance;
    expect(makeDevPortfolioSubmission(devPortfolio.uuid, dpSubmission)).rejects.toThrow(
      new BadRequestError(`Dev portfolio with uuid ${devPortfolio.uuid} does not exist.`)
    );
  });

  describe('Dev portfolio exists', () => {
    const mockIsWithinDates = jest.spyOn(githubUtils, 'isWithinDates');

    beforeAll(() => {
      const mockGetInstance = jest.fn().mockResolvedValue(devPortfolio);
      DevPortfolioDao.getInstance = mockGetInstance;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('Submission is within dates', () => {
      beforeAll(() => {
        mockIsWithinDates.mockReturnValue(true);
      });

      it('should successfully submit', async () => {
        await makeDevPortfolioSubmission(devPortfolio.uuid, dpSubmission);
        expect(mockIsWithinDates.mock.calls[0][1]).toEqual(devPortfolio.earliestValidDate);
        expect(mockIsWithinDates.mock.calls[0][2]).toEqual(devPortfolio.deadline);
        expect(DevPortfolioDao.makeDevPortfolioSubmission).toBeCalled();
      });
    });

    describe('Submission is not within dates', () => {
      beforeAll(() => {
        mockIsWithinDates.mockReturnValue(false);
      });

      it('should not successfully submit', async () => {
        expect(makeDevPortfolioSubmission(devPortfolio.uuid, dpSubmission)).rejects.toThrow(
          new BadRequestError(
            `This dev portfolio must be created between ${new Date(
              devPortfolio.earliestValidDate
            ).toDateString()} and ${new Date(devPortfolio.deadline).toDateString()}.`
          )
        );
        expect(DevPortfolioDao.makeDevPortfolioSubmission).not.toBeCalled();
      });
    });
  });
});
