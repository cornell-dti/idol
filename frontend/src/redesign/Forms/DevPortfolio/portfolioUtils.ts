export const portfolioDate = (timestamp: number, includeTime = false): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
    ...(includeTime ? ({ hour: 'numeric', minute: '2-digit', timeZoneName: 'short' } as const) : {})
  }).format(timestamp);

export function assignmentState(
  portfolio: DevPortfolioInfo,
  now = Date.now()
): 'Upcoming' | 'Open' | 'Late submissions' | 'Closed' {
  if (now < portfolio.earliestValidDate) return 'Upcoming';
  if (now > (portfolio.lateDeadline ?? portfolio.deadline)) return 'Closed';
  return now > portfolio.deadline ? 'Late submissions' : 'Open';
}
export const canSubmit = (portfolio: DevPortfolioInfo, now = Date.now()): boolean =>
  ['Open', 'Late submissions'].includes(assignmentState(portfolio, now));

export const cleanLinks = (links: readonly string[]): string[] =>
  links.map((link) => link.trim()).filter(Boolean);
/**
 * Accepts the same links as the backend and the classic form: any github.com PR URL (including
 * /files or /commits tabs, www., http, or no protocol). Repositories must be /owner/repository.
 */
export function isGithubLink(value: string, repository = false): boolean {
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return (
      ['https:', 'http:'].includes(url.protocol) &&
      ['github.com', 'www.github.com'].includes(url.hostname.toLowerCase()) &&
      !url.username &&
      !url.password &&
      (repository ? /^\/[\w.-]+\/[\w.-]+\/?$/ : /^\/[\w.-]+\/[\w.-]+\/pull\/\d+(?:\/.*)?$/).test(
        url.pathname
      )
    );
  } catch {
    return false;
  }
}
export type PortfolioDraft = {
  opened: string[];
  reviewed: string[];
  other: string[];
  documentation: string;
  explanation: string;
  submitRepo: boolean;
};
export function validateDraft(
  draft: PortfolioDraft,
  role: Role,
  portfolio?: DevPortfolioInfo,
  now = Date.now()
): string | undefined {
  if (!portfolio) return 'Select a portfolio assignment.';
  if (!canSubmit(portfolio, now))
    return assignmentState(portfolio, now) === 'Upcoming'
      ? 'This assignment is not open yet.'
      : 'The final deadline has passed. Choose an open assignment.';
  const opened = cleanLinks(draft.opened);
  const reviewed = cleanLinks(draft.reviewed);
  const other = cleanLinks(draft.other);
  if (
    !['tpm', 'dev-advisor'].includes(role) &&
    !other.length &&
    (!opened.length || !reviewed.length)
  )
    return 'Add at least one opened PR and one reviewed PR, or provide an exception.';
  if (
    opened.some((link) => !isGithubLink(link, draft.submitRepo)) ||
    [...reviewed, ...other].some((link) => !isGithubLink(link))
  )
    return 'Use valid GitHub links. Pull requests look like github.com/owner/repo/pull/123; repositories look like github.com/owner/repository.';
  if (!draft.documentation.trim())
    return 'Describe or link to the documentation or tests you added.';
  if (role !== 'dev-advisor' && other.length && !draft.explanation.trim())
    return 'Explain why your other PRs meet an exception to the requirements.';
  return undefined;
}
export const errorText = (error: unknown): string =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.';
export function requireData<T>(value: T | null | undefined): T {
  if (value == null)
    throw new Error('Could not load portfolio data. Check your connection and try again.');
  return value;
}
