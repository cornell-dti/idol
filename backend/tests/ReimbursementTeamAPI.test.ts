import ReimbursementTeamDao from '../src/dao/ReimbursementTeamDao'; // eslint-disable-line @typescript-eslint/no-unused-vars
import PermissionsManager from '../src/utils/permissionsManager';
import { fakeIdolLead, fakeReimbursementTeam } from './data/createData';
import { createReimbursementTeam } from '../src/API/reimbursementAPI';
import { BadRequestError } from '../src/utils/errors';

describe('createReimbursementTeam validation', () => {
  const user = fakeIdolLead();

  beforeAll(() => {
    PermissionsManager.isLeadOrAdmin = jest.fn().mockResolvedValue(true);
    ReimbursementTeamDao.prototype.getTeam = jest.fn().mockResolvedValue(null);
    ReimbursementTeamDao.prototype.createTeam = jest
      .fn()
      .mockImplementation(async (team: ReimbursementTeam) => team);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('rejects when displayName is missing', async () => {
    const team = { ...fakeReimbursementTeam(), displayName: '' };
    await expect(createReimbursementTeam(team, user)).rejects.toThrow(
      new BadRequestError('teamId and displayName are required.')
    );
  });

  test('rejects when teamId is missing', async () => {
    const team = { ...fakeReimbursementTeam(), teamId: '' };
    await expect(createReimbursementTeam(team, user)).rejects.toThrow(
      new BadRequestError('teamId and displayName are required.')
    );
  });

  test('persists displayName on a valid team', async () => {
    const team = fakeReimbursementTeam();
    const created = await createReimbursementTeam(team, user);
    expect(created.displayName).toBe(team.displayName);
    expect(created.teamId).toBe(team.teamId);
  });
});
