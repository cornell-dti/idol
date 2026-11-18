/// <reference types="jest" />
import { sendLeadConfirmations } from '../src/API/interviewSchedulerAPI';
import { sendLeadInterviewSummary, sendMemberInterviewInvite } from '../src/API/mailAPI';
import PermissionsManager from '../src/utils/permissionsManager';
import { NotFoundError, PermissionError } from '../src/utils/errors';

// Mock modules that send email or talk to Firestore, so these tests run without either.
jest.mock('../src/API/mailAPI', () => ({
  sendInterviewInvite: jest.fn(),
  sendInterviewCancellation: jest.fn(),
  sendMemberInterviewCancellation: jest.fn(),
  sendMemberInterviewInvite: jest.fn().mockResolvedValue({}),
  sendLeadInterviewSummary: jest.fn((email: string) => Promise.resolve(`<thread-${email}>`))
}));
jest.mock('../src/dao/InterviewSchedulerDao', () =>
  jest.fn().mockImplementation(() => ({
    getInstance: (uuid: string) => mockGetInstance(uuid)
  }))
);
jest.mock('../src/dao/InterviewSlotDao', () =>
  jest.fn().mockImplementation(() => ({
    getSlotsForScheduler: (uuid: string) => mockGetSlotsForScheduler(uuid)
  }))
);
jest.mock('../src/utils/permissionsManager', () => ({ isLeadOrAdmin: jest.fn() }));
jest.mock('../src/API/memberAPI', () => ({ getMember: jest.fn() }));

const mockGetInstance = jest.fn();
const mockGetSlotsForScheduler = jest.fn();

const scheduler = { uuid: 'scheduler', name: 'Spring 2027 Interviews' } as InterviewScheduler;
const user = { email: 'admin@cornell.edu' } as IdolMember;
const slot = (uuid: string, leadEmail: string | null, startTime: number): InterviewSlot => ({
  interviewSchedulerUuid: 'scheduler',
  startTime,
  room: 'Gates G01',
  lead: leadEmail ? ({ email: leadEmail } as IdolMember) : null,
  members: [],
  applicant: null,
  uuid
});

describe('sendLeadConfirmations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (PermissionsManager.isLeadOrAdmin as jest.Mock).mockResolvedValue(true);
    mockGetInstance.mockResolvedValue(scheduler);
  });

  test('throws if the user is not a lead or admin', async () => {
    (PermissionsManager.isLeadOrAdmin as jest.Mock).mockResolvedValue(false);
    await expect(sendLeadConfirmations('scheduler', user)).rejects.toThrow(PermissionError);
    expect(sendLeadInterviewSummary).not.toHaveBeenCalled();
  });

  test('throws if the instance does not exist', async () => {
    mockGetInstance.mockResolvedValue(null);
    await expect(sendLeadConfirmations('missing', user)).rejects.toThrow(NotFoundError);
  });

  test('sends one summary per lead and threads each invite onto it', async () => {
    mockGetSlotsForScheduler.mockResolvedValue([
      slot('a2', 'lead1@cornell.edu', 200),
      slot('b1', 'lead2@cornell.edu', 150),
      slot('a1', 'lead1@cornell.edu', 100),
      slot('none', null, 50)
    ]);

    const invitesSent = await sendLeadConfirmations('scheduler', user);

    expect(invitesSent).toBe(3);
    expect(sendLeadInterviewSummary).toHaveBeenCalledTimes(2);
    expect(sendLeadInterviewSummary).toHaveBeenCalledWith('lead1@cornell.edu', scheduler, [
      expect.objectContaining({ uuid: 'a1' }),
      expect.objectContaining({ uuid: 'a2' })
    ]);

    const invites = (sendMemberInterviewInvite as jest.Mock).mock.calls.map(
      ([email, , s, threadId]) => [email, s.uuid, threadId]
    );
    expect(invites).toHaveLength(3);
    // lead1's invites are in time order and reply to lead1's summary
    expect(invites.filter(([email]) => email === 'lead1@cornell.edu')).toEqual([
      ['lead1@cornell.edu', 'a1', '<thread-lead1@cornell.edu>'],
      ['lead1@cornell.edu', 'a2', '<thread-lead1@cornell.edu>']
    ]);
    expect(invites).toContainEqual(['lead2@cornell.edu', 'b1', '<thread-lead2@cornell.edu>']);
  });

  test('sends nothing when no slot has a lead', async () => {
    mockGetSlotsForScheduler.mockResolvedValue([slot('none', null, 50)]);
    expect(await sendLeadConfirmations('scheduler', user)).toBe(0);
    expect(sendLeadInterviewSummary).not.toHaveBeenCalled();
    expect(sendMemberInterviewInvite).not.toHaveBeenCalled();
  });
});
