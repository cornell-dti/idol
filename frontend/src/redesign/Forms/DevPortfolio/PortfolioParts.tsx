import { ReactNode } from 'react';
import { Button, Card, Link, Pill } from '../../../design-system-2026/components';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowSquareOutIcon
} from '../../../design-system-2026/icons';
import { assignmentState, portfolioDate } from './portfolioUtils';
import styles from './DevPortfolio.module.css';

export function SubmissionStatusPill({ status }: { status: SubmissionStatus }): JSX.Element {
  const Icon = { valid: CheckCircleIcon, pending: ClockIcon, invalid: XCircleIcon }[status];
  return (
    <Pill color={({ valid: 'green', invalid: 'red', pending: 'accent' } as const)[status]}>
      <span className={styles.inline}>
        <Icon size={14} aria-hidden="true" />
        {{ valid: 'Approved', pending: 'Pending', invalid: 'Needs changes' }[status]}
      </span>
    </Pill>
  );
}
export function AssignmentStatus({ portfolio }: { portfolio: DevPortfolioInfo }): JSX.Element {
  const status = assignmentState(portfolio);
  return (
    <Pill
      color={
        (
          {
            Open: 'green',
            'Late submissions': 'red',
            Closed: 'accent',
            Upcoming: 'accent'
          } as const
        )[status]
      }
    >
      {status}
    </Pill>
  );
}
export function DeadlineSummary({ portfolio }: { portfolio: DevPortfolioInfo }): JSX.Element {
  return (
    <dl className={styles.deadlines}>
      <div>
        <dt>Opens</dt>
        <dd>{portfolioDate(portfolio.earliestValidDate, true)}</dd>
      </div>
      <div>
        <dt>Due</dt>
        <dd>{portfolioDate(portfolio.deadline, true)}</dd>
      </div>
      {portfolio.lateDeadline != null && (
        <div>
          <dt>Late deadline</dt>
          <dd>{portfolioDate(portfolio.lateDeadline, true)}</dd>
        </div>
      )}
    </dl>
  );
}
export function PageState({
  title,
  children,
  retry,
  loading = false
}: {
  title: string;
  children?: ReactNode;
  retry?: () => void;
  loading?: boolean;
}): JSX.Element {
  return (
    <Card>
      <div
        className={styles.empty}
        role={loading ? 'status' : undefined}
        aria-live={retry ? 'assertive' : undefined}
      >
        <h2>{title}</h2>
        {children}
        {retry && (
          <Button variant="secondary" onClick={retry}>
            Try again
          </Button>
        )}
      </div>
    </Card>
  );
}
export function PullRequestLinks({
  items,
  repository = false
}: {
  items: readonly PullRequestSubmission[];
  repository?: boolean;
}): JSX.Element {
  if (!items.length) return <span className={styles.muted}>None submitted</span>;
  return (
    <ul className={styles.prLinks}>
      {items.map((item, index) => {
        let label = `Link ${index + 1}`;
        let safe = false;
        try {
          const url = new URL(item.url);
          safe = ['http:', 'https:'].includes(url.protocol);
          label = url.pathname.replace(/^\//, '').replace('/pull/', ' #');
        } catch {
          /* Keep malformed historical links readable. */
        }
        return (
          <li key={`${item.url}-${index}`}>
            {safe ? (
              <Link href={item.url} target="_blank" rel="noopener noreferrer">
                {label}
                <ArrowSquareOutIcon size={12} aria-hidden="true" />
              </Link>
            ) : (
              <span>{item.url}</span>
            )}
            <SubmissionStatusPill status={item.status} />
            {repository && <span className={styles.muted}>Personal repository</span>}
            {item.reason && <p className={styles.muted}>{item.reason}</p>}
          </li>
        );
      })}
    </ul>
  );
}
