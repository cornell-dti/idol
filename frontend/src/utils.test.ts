import { calculateCredits, formatLink, getPeriods, getTECPeriod } from './utils';

const fakeEvent = (name: string, date: string): TeamEvent => ({
  name,
  date,
  numCredits: '1',
  hasHours: false,
  uuid: name,
  isInitiativeEvent: false,
  maxCredits: '',
  requests: []
});

describe('formatLink', () => {
  test('Formats LinkedIn links correctly', () => {
    expect(formatLink('linkedin.com/in/jujulcrane', 'linkedin')).toEqual(
      'https://linkedin.com/in/jujulcrane'
    );
    expect(formatLink('www.linkedin.com/in/jujulcrane', 'linkedin')).toEqual(
      'https://www.linkedin.com/in/jujulcrane'
    );
    expect(formatLink('https://linkedin.com/in/jujulcrane', 'linkedin')).toEqual(
      'https://linkedin.com/in/jujulcrane'
    );
  });

  test('Formats GitHub links correctly', () => {
    expect(formatLink('https://github.com/jujulcrane', 'github')).toEqual(
      'https://github.com/jujulcrane'
    );
    expect(formatLink('github.com/jujulcrane', 'github')).toEqual('https://github.com/jujulcrane');
  });

  test('Handles malformed inputs correctly', () => {
    expect(formatLink('www.github.com/jujulcrane.', 'github')).toEqual(
      'https://www.github.com/jujulcrane'
    );
    expect(formatLink('linkedin jujulcrane', 'linkedin')).toBeUndefined();
  });

  test('Handles multiple matches correctly', () => {
    expect(
      formatLink(
        'Visit my profiles: https://linkedin.com/in/jujulcrane and https://github.com/jujulcrane',
        'linkedin'
      )
    ).toBeUndefined();
  });

  test('Handles raw usernames correctly', () => {
    expect(formatLink('jujulcrane', 'linkedin')).toEqual('https://www.linkedin.com/in/jujulcrane');
    expect(formatLink('jujulcrane', 'github')).toEqual('https://github.com/jujulcrane');
  });

  test('Extracts non-specific links correctly', () => {
    expect(formatLink('Look at my awesome website https://en.wikipedia.org/wiki/Cat!!')).toEqual(
      'https://en.wikipedia.org/wiki/Cat'
    );
  });
});

describe('getTECPeriod', () => {
  const deadlines = [
    new Date('2026-02-22T23:59:59'),
    new Date('2026-03-19T23:59:59'),
    new Date('2026-05-04T23:59:59')
  ];

  test('returns 0 for a date before the first deadline', () => {
    expect(getTECPeriod(new Date('2026-02-10T12:00:00'), deadlines)).toBe(0);
  });

  test('returns the deadline index for a date that lands exactly on a deadline', () => {
    expect(getTECPeriod(new Date('2026-02-22T23:59:59'), deadlines)).toBe(0);
    expect(getTECPeriod(new Date('2026-03-19T23:59:59'), deadlines)).toBe(1);
  });

  test('returns the next deadline index for a date between two deadlines', () => {
    expect(getTECPeriod(new Date('2026-03-10T12:00:00'), deadlines)).toBe(1);
    expect(getTECPeriod(new Date('2026-04-15T12:00:00'), deadlines)).toBe(2);
  });

  test('returns the last index for a date after every deadline', () => {
    expect(getTECPeriod(new Date('2026-12-31T12:00:00'), deadlines)).toBe(deadlines.length - 1);
  });
});

describe('getPeriods', () => {
  // `getPeriods` computes the first period's start from `new Date()` (Jan 1 or
  // Aug 1 of the current year). Fix "today" so the test is deterministic
  // regardless of when CI runs.
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-01T12:00:00'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  const deadlines = [
    new Date('2026-02-22T23:59:59'),
    new Date('2026-03-19T23:59:59'),
    new Date('2026-05-04T23:59:59')
  ];

  test('returns one period per deadline with sequential names', () => {
    const result = getPeriods([], deadlines);
    expect(result).toHaveLength(deadlines.length);
    expect(result.map((p) => p.name)).toEqual(['Period 1', 'Period 2', 'Period 3']);
  });

  test('buckets each event into the period whose deadline it falls within', () => {
    const events = [
      fakeEvent('inP1', '2026-02-10'),
      fakeEvent('inP2', '2026-03-10'),
      fakeEvent('inP3', '2026-04-01')
    ];
    const [p1, p2, p3] = getPeriods(events, deadlines);
    expect(p1.events.map((e) => e.name)).toEqual(['inP1']);
    expect(p2.events.map((e) => e.name)).toEqual(['inP2']);
    expect(p3.events.map((e) => e.name)).toEqual(['inP3']);
  });

  test('sorts events within a period from latest to earliest', () => {
    const events = [fakeEvent('earlier', '2026-04-01'), fakeEvent('later', '2026-04-15')];
    const [, , p3] = getPeriods(events, deadlines);
    expect(p3.events.map((e) => e.name)).toEqual(['later', 'earlier']);
  });

  test('excludes events that fall outside every period', () => {
    const events = [
      fakeEvent('beforeFirstStart', '2025-12-15'),
      fakeEvent('afterLastDeadline', '2026-06-01')
    ];
    const periods = getPeriods(events, deadlines);
    const allEventNames = periods.flatMap((p) => p.events.map((e) => e.name));
    expect(allEventNames).toEqual([]);
  });
});

describe('calculateCredits', () => {
  test('returns 0 when the requirement is exactly met', () => {
    expect(calculateCredits(1, 1)).toBe(0);
    expect(calculateCredits(5, 5)).toBe(0);
  });

  test('returns 0 when the requirement is exceeded', () => {
    expect(calculateCredits(3, 1)).toBe(0);
  });

  test('returns the remaining credits when the requirement is not met', () => {
    expect(calculateCredits(0, 1)).toBe(1);
    expect(calculateCredits(2, 5)).toBe(3);
  });

  test('defaults requiredCredits to 1 when omitted', () => {
    expect(calculateCredits(0)).toBe(1);
    expect(calculateCredits(1)).toBe(0);
  });
});
