import DevPortfolioDao from '../src/dao/DevPortfolioDao'; // eslint-disable-line  @typescript-eslint/no-unused-vars
import PermissionsManager from '../src/utils/permissionsManager';
import { fakeIdolMember, fakeDevPortfolio, fakeDevPortfolioSubmission } from './data/createData';
import {
  getDevPortfolio,
  deleteDevPortfolio,
  createNewDevPortfolio,
  makeDevPortfolioSubmission,
  regradeSubmissions
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

  test('regradeSubmissions should throw permission error', async () => {
    await expect(regradeSubmissions('<kewl-uuid>', user)).rejects.toThrow(
      new PermissionError(
        `User with email ${user.email} does not have permission to regrade dev portfolio submissions`
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

  describe('regradeSubmissions tests', () => {
    test("regradeSubmissions should fail if uuid isn't valid", async () => {
      const mockGetInstance = jest.fn().mockResolvedValue(null);
      DevPortfolioDao.getInstance = mockGetInstance;
      expect(regradeSubmissions('<fake-uuid>', user)).rejects.toThrow(
        new BadRequestError('Dev portfolio with uuid: <kewl-uuid> does not exist')
      );
    });

    test('validateSubmission is called for every submission', async () => {
      const mockValidateSubmission = jest.spyOn(githubUtils, 'validateSubmission');
      const dp = {
        ...devPortfolio,
        submissions: [fakeDevPortfolioSubmission(), fakeDevPortfolioSubmission()]
      };
      const mockGetInstance = jest.fn().mockResolvedValue(dp);
      const mockUpdateInstance = jest.fn();
      DevPortfolioDao.getInstance = mockGetInstance;
      DevPortfolioDao.updateInstance = mockUpdateInstance;

      await regradeSubmissions('<kewl-uuid>', user);
      expect(mockValidateSubmission.mock.calls.length).toBeGreaterThan(1);
      expect(mockUpdateInstance.mock.calls.length).toEqual(1);
    });
  });

  test('getDevPortfolio should be successful', async () => {
    const dp = await getDevPortfolio(devPortfolio.uuid, user);
    expect(PermissionsManager.isLeadOrAdmin).toBeCalled();
    expect(DevPortfolioDao.getDevPortfolio).toBeCalled();
    expect(dp.uuid).toEqual(devPortfolio.uuid);
  });

  test('createDevPortfolio should be successful', async () => {
    const expectedDeadline = new Date(devPortfolio.deadline).setHours(23, 59, 59);
    const expectedEarliestValidDate = new Date(devPortfolio.earliestValidDate).setHours(0, 0, 0);
    const expectedLateDeadline = new Date(devPortfolio.lateDeadline).setHours(23, 59, 59);
    await createNewDevPortfolio(devPortfolio, user);
    expect(PermissionsManager.isLeadOrAdmin).toBeCalled();
    expect(DevPortfolioDao.createNewInstance).toBeCalled();
    expect(DevPortfolioDao.createNewInstance.mock.calls[0][0].deadline).toEqual(expectedDeadline);
    expect(DevPortfolioDao.createNewInstance.mock.calls[0][0].earliestValidDate).toEqual(
      expectedEarliestValidDate
    );
    expect(DevPortfolioDao.createNewInstance.mock.calls[0][0].lateDeadline).toEqual(
      expectedLateDeadline
    );
  });

  describe('test createNewDevPortfolio validation', () => {
    test('name validation', () => {
      const dp = fakeDevPortfolio();
      dp.name = '';
      expect(createNewDevPortfolio(dp, user)).rejects.toThrow(
        new BadRequestError(
          `Unable to create the new dev portfolio instance: The provided dev portfolio is invalid.`
        )
      );
    });

    test('deadline and earliestValidDate validation', () => {
      const dp = fakeDevPortfolio();
      dp.earliestValidDate = dp.deadline + 52;
      expect(createNewDevPortfolio(dp, user)).rejects.toThrow(
        new BadRequestError(
          `Unable to create the new dev portfolio instance: The provided dev portfolio is invalid.`
        )
      );
    });

    test('deadline and late deadline validateion', () => {
      const dp = fakeDevPortfolio();
      dp.lateDeadline = dp.deadline - 52;
      expect(createNewDevPortfolio(dp, user)).rejects.toThrow(
        new BadRequestError(
          `Unable to create the new dev portfolio instance: The provided dev portfolio is invalid.`
        )
      );
    });
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
    const mockGetDevPortfolio = jest.fn().mockResolvedValue(null);
    DevPortfolioDao.getDevPortfolio = mockGetDevPortfolio;
    expect(makeDevPortfolioSubmission(devPortfolio.uuid, dpSubmission)).rejects.toThrow(
      new BadRequestError(`Dev portfolio with uuid ${devPortfolio.uuid} does not exist.`)
    );
  });

  describe('Dev portfolio exists', () => {
    const mockIsWithinDates = jest.spyOn(githubUtils, 'isWithinDates');

    beforeAll(() => {
      const mockGetDevPortfolio = jest.fn().mockResolvedValue(devPortfolio);
      DevPortfolioDao.getDevPortfolio = mockGetDevPortfolio;
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
        expect(mockIsWithinDates.mock.calls[0][2]).toEqual(devPortfolio.lateDeadline);
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
