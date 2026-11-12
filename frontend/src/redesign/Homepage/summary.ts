export type Metric = { label: string; value: string | number };
export type SummaryState = { metrics?: Metric[]; error?: string };
export type HomeSummary = { coffee: SummaryState; tec: SummaryState; shoutouts: SummaryState };

export function coffeeMetrics(chats: CoffeeChat[]): Metric[] {
  const current = chats.filter((chat) => !chat.isArchived);
  return [
    { label: 'Submitted', value: current.length },
    { label: 'Pending', value: current.filter((chat) => chat.status === 'pending').length },
    { label: 'Rejected', value: current.filter((chat) => chat.status === 'rejected').length }
  ];
}

/** Only approved attendance earns credit; hourly events multiply the event credit value. */
export function tecMetrics(
  attendance: TeamEventAttendance[],
  events: TeamEventInfo[],
  config: TECConfig,
  now = new Date()
): Metric[] {
  const deadlines = config.periodEndDates.map((date) => new Date(date));
  const upcoming = deadlines.findIndex((date) => now <= date);
  const period = upcoming < 0 ? deadlines.length - 1 : upcoming;
  const end = deadlines[period];
  const start = deadlines[period - 1];
  const totals = { internal: 0, external: 0, total: 0 };
  attendance
    .filter((item) => item.status === 'approved')
    .forEach((item) => {
      const event = events.find((candidate) => candidate.uuid === item.eventUuid);
      if (!event || !end) return;
      const date = new Date(event.date);
      if (!Number.isFinite(date.getTime()) || date > end || (start && date <= start)) return;
      const credits = Number(event.numCredits) * (event.hasHours ? item.hoursAttended ?? 1 : 1);
      if (!Number.isFinite(credits)) return;
      totals.total += credits;
      if (event.kind) totals[event.kind] += credits;
    });
  const deadline = {
    label: end ? `${upcoming < 0 ? 'Last deadline' : 'Deadline'} ${period + 1}` : 'Deadline',
    value: end ? end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not set'
  };
  return [
    deadline,
    ...(config.considerEventKind
      ? [
          { label: 'Internal', value: totals.internal },
          { label: 'External', value: totals.external }
        ]
      : [{ label: 'Approved credits', value: totals.total }])
  ];
}
