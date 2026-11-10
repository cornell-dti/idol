import { useEffect, useState } from 'react';
import Head from 'next/head';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { useBreadcrumbTitle } from '../../BreadcrumbContext';
import {
  Button,
  Input,
  Link,
  Modal,
  Pill,
  Select,
  Table
} from '../../../design-system-2026/components';
import { MagnifyingGlassIcon } from '../../../design-system-2026/icons';
import {
  AssignmentStatus,
  DeadlineSummary,
  PageState,
  PullRequestLinks,
  SubmissionStatusPill
} from './PortfolioParts';
import { canSubmit, errorText, requireData } from './portfolioUtils';
import styles from './DevPortfolio.module.css';

type Props = { uuid: string };
export default function DevPortfolioDetails({ uuid }: Props): JSX.Element {
  const [portfolio, setPortfolio] = useState<DevPortfolio>();
  useBreadcrumbTitle(portfolio?.uuid === uuid ? portfolio.name : undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<number>();
  useEffect(() => {
    if (!uuid) return undefined;
    let active = true;
    setLoading(true);
    setError('');
    setPortfolio(undefined);
    setSelected(undefined);
    const load = async () => {
      const [info, submissions] = await Promise.all([
        DevPortfolioAPI.getDevPortfolioInfo(uuid),
        DevPortfolioAPI.getUsersDevPortfolioSubmissions(uuid)
      ]);
      return { ...requireData(info), submissions: requireData(submissions) };
    };
    load()
      .then((value) => {
        if (active) setPortfolio(value);
      })
      .catch((reason) => {
        if (active) setError(errorText(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [uuid, reload]);
  const rows = (portfolio?.submissions ?? [])
    .map((submission, index) => ({ submission, index }))
    .reverse()
    .filter(
      ({ submission }) =>
        (filter === 'all' || submission.status === filter) &&
        `${submission.member.firstName} ${submission.member.lastName} ${submission.member.netid} ${submission.documentationText ?? ''}`
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  const detail = selected == null ? undefined : portfolio?.submissions[selected];
  return (
    <div className={styles.page}>
      <Head>
        <title>{portfolio?.name ?? 'Portfolio assignment'} · IDOL</title>
      </Head>
      <header className={styles.header}>
        <Link href="/forms/devPortfolio">← All dev portfolios</Link>
        <div className={styles.toolbar}>
          <h1 className="idol-heading-1">{portfolio?.name ?? 'Portfolio assignment'}</h1>
          {portfolio && <AssignmentStatus portfolio={portfolio} />}
        </div>
        <p>Track your submissions and review feedback for this assignment.</p>
      </header>
      {loading && <PageState title="Loading assignment…" loading />}
      {!loading && error && (
        <PageState
          title="Couldn’t load this assignment"
          retry={() => setReload((value) => value + 1)}
        >
          <p>{error}</p>
        </PageState>
      )}
      {!loading && !error && portfolio && (
        <>
          <div className={styles.dateCards}>
            <DeadlineSummary portfolio={portfolio} />
          </div>
          <div className={styles.toolbar}>
            <p className={styles.muted}>
              Only the latest submission per member counts toward grading. All dates use Eastern
              Time.
            </p>
            {canSubmit(portfolio) && (
              <Link href={`/forms/devPortfolio?assignment=${portfolio.uuid}`}>
                {portfolio.submissions.length
                  ? 'Submit an updated portfolio'
                  : 'Submit this assignment'}
              </Link>
            )}
          </div>
          <section className={styles.stack}>
            <div className={styles.toolbar}>
              <h2 className="idol-heading-2">
                Your submissions{' '}
                <span className={styles.muted}>({portfolio.submissions.length})</span>
              </h2>
            </div>
            <div className={styles.toolbar}>
              <Select
                id="submission-status-filter"
                aria-label="Filter by submission status"
                value={filter}
                onValueChange={(value) => setFilter(value ?? 'all')}
                options={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'valid', label: 'Approved' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'invalid', label: 'Needs changes' }
                ]}
              />
              <Input
                id="submission-search"
                aria-label="Search submissions"
                placeholder="Search submissions"
                icon={<MagnifyingGlassIcon size={16} />}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Table
              caption={`${portfolio.name} submissions`}
              rows={rows}
              rowKey={(row) => row.index}
              emptyState={
                <div className={styles.empty}>
                  <h3>
                    {portfolio.submissions.length
                      ? 'No matching submissions'
                      : 'No submissions yet'}
                  </h3>
                  <p>
                    {portfolio.submissions.length
                      ? 'Try another search or status filter.'
                      : 'Submit this assignment to see your work and its review status here.'}
                  </p>
                  {portfolio.submissions.length > 0 && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearch('');
                        setFilter('all');
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                  {!portfolio.submissions.length && canSubmit(portfolio) && (
                    <Link href={`/forms/devPortfolio?assignment=${portfolio.uuid}`}>
                      Go to submission form
                    </Link>
                  )}
                </div>
              }
              columns={[
                {
                  id: 'member',
                  header: 'Member',
                  sortValue: (row) => row.submission.member.netid,
                  cell: ({ submission, index }) => (
                    <div className={styles.tableName}>
                      <strong>
                        {submission.member.firstName} {submission.member.lastName}
                      </strong>
                      <span className={styles.muted}>{submission.member.netid}</span>
                      {index ===
                        portfolio.submissions
                          .map((item) => item.member.netid)
                          .lastIndexOf(submission.member.netid) && <Pill>Latest</Pill>}
                      {submission.isLate && <Pill color="red">Late submission</Pill>}
                    </div>
                  )
                },
                {
                  id: 'opened',
                  header: 'Opened PRs',
                  cell: ({ submission }) => (
                    <PullRequestLinks
                      items={submission.openedPRs}
                      repository={submission.submitRepo}
                    />
                  )
                },
                {
                  id: 'reviewed',
                  header: 'Reviewed PRs',
                  cell: ({ submission }) => <PullRequestLinks items={submission.reviewedPRs} />
                },
                {
                  id: 'documentation',
                  header: 'Documentation / testing',
                  cell: ({ submission }) => (
                    <p className={`${styles.documentation} ${styles.previewText}`}>
                      {submission.documentationText || 'None submitted'}
                    </p>
                  )
                },
                {
                  id: 'status',
                  header: 'Status',
                  sortValue: (row) => row.submission.status,
                  cell: ({ submission }) => <SubmissionStatusPill status={submission.status} />
                },
                {
                  id: 'actions',
                  header: 'Actions',
                  cell: ({ index }) => (
                    <div className={styles.stack}>
                      <Button variant="secondary" onClick={() => setSelected(index)}>
                        View details
                      </Button>
                    </div>
                  )
                }
              ]}
            />
          </section>
        </>
      )}
      <Modal
        id="portfolio-submission-details"
        open={detail != null}
        onOpenChange={(open) => {
          if (!open) setSelected(undefined);
        }}
        title="Submission details"
        description={
          detail
            ? `${detail.member.firstName} ${detail.member.lastName} · ${portfolio?.name}`
            : undefined
        }
        width={680}
        footer={
          <Button variant="secondary" onClick={() => setSelected(undefined)}>
            Done
          </Button>
        }
      >
        {detail && (
          <div className={styles.modalContent}>
            <div className={styles.inline}>
              <SubmissionStatusPill status={detail.status} />
              {detail.isLate && <Pill color="red">Late submission</Pill>}
            </div>
            <h3>Opened {detail.submitRepo ? 'repositories' : 'pull requests'}</h3>
            <PullRequestLinks items={detail.openedPRs} repository={detail.submitRepo} />
            <h3>Reviewed pull requests</h3>
            <PullRequestLinks items={detail.reviewedPRs} />
            {detail.otherPRs?.length > 0 && (
              <>
                <h3>Other pull requests</h3>
                <PullRequestLinks items={detail.otherPRs} />
              </>
            )}
            {detail.text && (
              <>
                <h3>Explanation</h3>
                <p className={styles.documentation}>{detail.text}</p>
              </>
            )}
            <h3>Documentation or testing</h3>
            <p className={styles.documentation}>{detail.documentationText || 'None submitted'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
