import { groupSlotsByLead } from '../src/utils/interviewSlotUtil';

const slot = (uuid: string, leadEmail: string | null, startTime: number): InterviewSlot => ({
  interviewSchedulerUuid: 'scheduler',
  startTime,
  room: 'Gates G01',
  lead: leadEmail ? ({ email: leadEmail } as IdolMember) : null,
  members: [],
  applicant: null,
  uuid
});

describe('groupSlotsByLead', () => {
  test('groups slots by lead email', () => {
    const groups = groupSlotsByLead([
      slot('a', 'lead1@cornell.edu', 1),
      slot('b', 'lead2@cornell.edu', 2),
      slot('c', 'lead1@cornell.edu', 3)
    ]);
    expect(Array.from(groups.keys())).toEqual(['lead1@cornell.edu', 'lead2@cornell.edu']);
    expect(groups.get('lead1@cornell.edu')?.map((s) => s.uuid)).toEqual(['a', 'c']);
    expect(groups.get('lead2@cornell.edu')?.map((s) => s.uuid)).toEqual(['b']);
  });

  test("sorts each lead's slots by start time", () => {
    const groups = groupSlotsByLead([
      slot('late', 'lead1@cornell.edu', 300),
      slot('early', 'lead1@cornell.edu', 100),
      slot('middle', 'lead1@cornell.edu', 200)
    ]);
    expect(groups.get('lead1@cornell.edu')?.map((s) => s.uuid)).toEqual([
      'early',
      'middle',
      'late'
    ]);
  });

  test('skips slots without a lead', () => {
    const groups = groupSlotsByLead([slot('a', null, 1), slot('b', 'lead1@cornell.edu', 2)]);
    expect(groups.size).toBe(1);
    expect(groups.get('lead1@cornell.edu')?.map((s) => s.uuid)).toEqual(['b']);
  });

  test('returns an empty map when no slot has a lead', () => {
    expect(groupSlotsByLead([slot('a', null, 1)]).size).toBe(0);
  });
});
