import { coffeeMetrics, tecMetrics } from './summary';
import receivedShoutouts from '../Forms/Shoutouts/receivedShoutouts';

const config: TECConfig = {
  periodEndDates: ['2026-10-09T23:59:59Z', '2026-11-09T23:59:59Z'],
  considerEventKind: true,
  requiredMemberTecCredits: 3,
  requiredLeadTecCredits: 5,
  requiredMemberInternalTecCredits: 1,
  requiredMemberExternalTecCredits: 2,
  requiredLeadInternalTecCredits: 1,
  requiredLeadExternalTecCredits: 4
};
const event = (
  uuid: string,
  date: string,
  kind: TeamEventKind,
  hasHours = false
): TeamEventInfo => ({
  uuid,
  date,
  kind,
  hasHours,
  name: uuid,
  numCredits: '0.5',
  maxCredits: '5',
  isInitiativeEvent: false
});
const attendance = (eventUuid: string, status: Status, hoursAttended = 1): TeamEventAttendance => ({
  eventUuid,
  status,
  hoursAttended,
  uuid: `${eventUuid}-${status}`,
  image: '',
  reason: '',
  member: {} as IdolMember
});

it('counts active coffee chats without including archived semesters', () => {
  const chats = [
    { status: 'approved', isArchived: false },
    { status: 'pending', isArchived: false },
    { status: 'rejected', isArchived: false },
    { status: 'approved', isArchived: true }
  ] as CoffeeChat[];
  expect(coffeeMetrics(chats).map((metric) => metric.value)).toEqual([3, 1, 1]);
});

it('counts approved credits in the current period, multiplying hours and excluding pending/rejected submissions', () => {
  const events = [
    event('previous', '2026-10-09T23:59:59Z', 'internal'),
    event('hourly', '2026-10-12', 'internal', true),
    event('external', '2026-10-15', 'external')
  ];
  const requests = [
    attendance('previous', 'approved'),
    attendance('hourly', 'approved', 3),
    attendance('external', 'approved'),
    attendance('external', 'pending'),
    attendance('external', 'rejected'),
    attendance('missing', 'approved')
  ];
  expect(tecMetrics(requests, events, config, new Date('2026-11-01')).slice(1)).toEqual([
    { label: 'Internal', value: 1.5 },
    { label: 'External', value: 0.5 }
  ]);
});

it('uses a total when internal/external requirements are disabled and handles missing deadlines', () => {
  expect(
    tecMetrics(
      [attendance('a', 'approved')],
      [event('a', '2026-10-15', 'external')],
      { ...config, considerEventKind: false },
      new Date('2026-11-01')
    )[1]
  ).toEqual({ label: 'Approved credits', value: 0.5 });
  expect(tecMetrics([], [], { ...config, periodEndDates: [] })[0]).toEqual({
    label: 'Deadline',
    value: 'Not set'
  });
});

it('counts received shoutouts with the same name/tag matching as the Shoutouts page', () => {
  const all = [
    { receiver: 'CLÉMENT ROZÉ', tags: [] },
    { receiver: 'The whole team', tags: ['Clément'] },
    { receiver: 'Someone else', tags: [] }
  ] as unknown as Shoutout[];
  expect(receivedShoutouts(all, 'Clément', 'Rozé')).toEqual(all.slice(0, 2));
  expect(receivedShoutouts(all, '', '')).toEqual([]);
});
