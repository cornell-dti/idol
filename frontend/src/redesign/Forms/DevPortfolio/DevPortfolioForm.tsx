import { FormEvent, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { useSelf } from '../../../components/Common/FirestoreDataProvider';
import {
  Button,
  Card,
  IconButton,
  Input,
  LabelledCheckbox,
  Link,
  Modal,
  Table,
  Textarea,
  useToast
} from '../../../design-system-2026/components';
import { Combobox } from '../../../design-system-2026/components/Combobox/Combobox';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon } from '../../../design-system-2026/icons';
import { AssignmentStatus, DeadlineSummary, PageState } from './PortfolioParts';
import {
  assignmentState,
  canSubmit,
  cleanLinks,
  errorText,
  portfolioDate,
  PortfolioDraft,
  requireData,
  validateDraft
} from './portfolioUtils';
import styles from './DevPortfolio.module.css';

const freshDraft = (): PortfolioDraft => ({
  opened: [''],
  reviewed: [''],
  other: [''],
  documentation: '',
  explanation: '',
  submitRepo: false
});
function LinkFields({
  kind,
  label,
  links,
  onChange,
  disabled
}: {
  kind: string;
  label: string;
  links: string[];
  onChange: (links: string[]) => void;
  disabled: boolean;
}): JSX.Element {
  return (
    <fieldset className={styles.fieldGroup} disabled={disabled}>
      <legend>{label}</legend>
      {links.map((link, index) => (
        <div className={styles.linkRow} key={index}>
          <Input
            id={`portfolio-${kind}-${index}`}
            aria-label={`${label} ${index + 1}`}
            placeholder={
              kind === 'opened'
                ? 'https://github.com/owner/repo/pull/123'
                : 'GitHub pull request link'
            }
            value={link}
            onChange={(event) =>
              onChange(links.map((value, i) => (i === index ? event.target.value : value)))
            }
            disabled={disabled}
          />
          <IconButton
            aria-label={`Remove ${kind} link ${index + 1}`}
            icon={<TrashIcon size={16} />}
            disabled={disabled || (links.length === 1 && !link)}
            onClick={() =>
              onChange(links.length === 1 ? [''] : links.filter((_, i) => i !== index))
            }
          />
        </div>
      ))}
      <Button
        variant="secondary"
        icon={<PlusIcon size={16} />}
        onClick={() => onChange([...links, ''])}
        disabled={disabled}
      >
        Add {kind === 'opened' ? 'link' : 'PR'}
      </Button>
    </fieldset>
  );
}

export default function DevPortfolioForm(): JSX.Element {
  const self = useSelf();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<DevPortfolioInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selected, setSelected] = useState('');
  const [draft, setDraft] = useState(freshDraft);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(false);
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(0);
  const errorRef = useRef<HTMLDivElement>(null);
  const submitLock = useRef(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    DevPortfolioAPI.getAllDevPortfolioInfo()
      .then((items) => {
        requireData(items);
        if (active) setPortfolios([...items].sort((a, b) => b.deadline - a.deadline));
      })
      .catch((reason) => {
        if (active) setLoadError(errorText(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reload]);
  useEffect(() => {
    const uuid = typeof router.query.assignment === 'string' ? router.query.assignment : '';
    if (uuid && portfolios.some((item) => item.uuid === uuid)) setSelected(uuid);
  }, [router.query.assignment, portfolios]);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  const portfolio = portfolios.find((item) => item.uuid === selected);
  const options = portfolios.filter((item) => canSubmit(item));
  const assignmentLabel = (item: DevPortfolioInfo) =>
    `${item.name} · Due ${portfolioDate(item.deadline)}`;
  const edit = <K extends keyof PortfolioDraft>(key: K, value: PortfolioDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  };
  const requestReview = (event: FormEvent) => {
    event.preventDefault();
    const message = validateDraft(draft, self?.role ?? 'developer', portfolio);
    if (message) {
      setError(message);
      return;
    }
    setError('');
    setReview(true);
  };
  const submit = async () => {
    if (!self || !portfolio || submitLock.current) return;
    const message = validateDraft(draft, self.role, portfolio);
    if (message) {
      setReview(false);
      setError(message);
      return;
    }
    submitLock.current = true;
    setBusy(true);
    try {
      const pending = (links: string[]): PullRequestSubmission[] =>
        cleanLinks(links).map((url) => ({ url, status: 'pending' }));
      const result = requireData(
        await DevPortfolioAPI.makeDevPortfolioSubmission(portfolio.uuid, {
          member: self,
          openedPRs: pending(draft.opened),
          reviewedPRs: pending(draft.reviewed),
          otherPRs: pending(draft.other),
          documentationText: draft.documentation.trim(),
          ...(draft.explanation.trim() ? { text: draft.explanation.trim() } : {}),
          status: 'pending',
          submitRepo: draft.submitRepo
        })
      );
      if (result.error) throw new Error(result.error);
      toast.add({
        title: `${portfolio.name} submitted.`,
        description: (
          <Link href={`/forms/dev-portfolio-submissions/${portfolio.uuid}`}>
            View submission and status
          </Link>
        ),
        timeout: 0
      });
      setDraft(freshDraft());
      setReview(false);
      setError('');
    } catch (reason) {
      setError(errorText(reason));
      setReview(false);
    } finally {
      submitLock.current = false;
      setBusy(false);
    }
  };
  return (
    <div className={styles.page}>
      <Head>
        <title>Dev Portfolio · IDOL</title>
      </Head>
      <header className={styles.header}>
        <h1 className="idol-heading-1">Dev Portfolio</h1>
        <p>Share the work you’ve opened, reviewed, and documented.</p>
      </header>
      {loading && <PageState title="Loading assignments…" loading />}
      {!loading && loadError && (
        <PageState title="Couldn’t load assignments" retry={() => setReload((value) => value + 1)}>
          <p>{loadError}</p>
        </PageState>
      )}
      {!loading && !loadError && (
        <>
          <div className={styles.layout}>
            <Card header="Submit a portfolio assignment">
              {!options.length && !portfolio ? (
                <PageState title="No assignments are open">
                  <p>You can still view previous assignments and submissions below.</p>
                </PageState>
              ) : (
                <form className={styles.form} onSubmit={requestReview} noValidate>
                  <p>
                    Submit recent pull requests and the documentation or tests that support your
                    work.
                  </p>
                  <Combobox
                    id="portfolio-assignment"
                    label="Select a Dev Portfolio Assignment *"
                    options={options.map(assignmentLabel)}
                    value={portfolio ? assignmentLabel(portfolio) : ''}
                    onValueChange={(label) => {
                      setSelected(
                        options.find((item) => assignmentLabel(item) === label)?.uuid ?? ''
                      );
                      setError('');
                    }}
                    placeholder="Select assignment"
                    disabled={busy}
                  />
                  {portfolio && !canSubmit(portfolio) && (
                    <p className={styles.notice}>
                      {assignmentState(portfolio) === 'Upcoming'
                        ? 'This assignment has not opened yet.'
                        : 'This assignment is closed. Choose an open assignment to submit.'}
                    </p>
                  )}
                  {portfolio && assignmentState(portfolio) === 'Late submissions' && (
                    <p className={styles.notice}>
                      The regular deadline has passed. This submission will be marked late.
                    </p>
                  )}
                  <LabelledCheckbox
                    label="Submit a personal repository instead of an opened PR"
                    checked={draft.submitRepo}
                    onCheckedChange={(value) => edit('submitRepo', value === true)}
                    disabled={busy}
                  />
                  <LinkFields
                    kind="opened"
                    label={
                      draft.submitRepo
                        ? 'Personal repository GitHub links'
                        : 'Opened pull request GitHub links'
                    }
                    links={draft.opened}
                    onChange={(value) => edit('opened', value)}
                    disabled={busy}
                  />
                  <LinkFields
                    kind="reviewed"
                    label="Reviewed pull request GitHub links"
                    links={draft.reviewed}
                    onChange={(value) => edit('reviewed', value)}
                    disabled={busy}
                  />
                  {self?.role !== 'tpm' && (
                    <details className={styles.disclosure}>
                      <summary>Other PRs & exceptions</summary>
                      <div className={styles.stack}>
                        <p>
                          Use this section if your work qualifies for an exception. Include the PR
                          links and explain how they meet the requirements.
                        </p>
                        <LinkFields
                          kind="other"
                          label="Other pull request GitHub links"
                          links={draft.other}
                          onChange={(value) => edit('other', value)}
                          disabled={busy}
                        />
                        <Textarea
                          id="portfolio-explanation"
                          label="Explanation"
                          placeholder="Explain your work and the exception you’re requesting"
                          value={draft.explanation}
                          onChange={(event) => edit('explanation', event.target.value)}
                          disabled={busy}
                        />
                      </div>
                    </details>
                  )}
                  <Textarea
                    id="portfolio-documentation"
                    label="Documentation or testing *"
                    hint="Link to documentation or tests you added or updated. If included above, reference the PR number."
                    placeholder="Describe your documentation and testing…"
                    value={draft.documentation}
                    onChange={(event) => edit('documentation', event.target.value)}
                    disabled={busy}
                  />
                  <p className={styles.notice}>
                    Only your latest submission counts toward your grade. Include all the work you
                    want reviewed each time.
                  </p>
                  {error && (
                    <div ref={errorRef} tabIndex={-1} role="alert" className={styles.error}>
                      {error}
                    </div>
                  )}
                  <div className={styles.actions}>
                    <Button
                      type="submit"
                      disabled={busy || !portfolio || !canSubmit(portfolio)}
                      icon={<PlusIcon size={16} />}
                    >
                      Review submission
                    </Button>
                  </div>
                </form>
              )}
            </Card>
            <aside aria-label="Assignment tips">
              <Card header="Tips">
                <section className={styles.tipSection}>
                  <h3 className={styles.sectionTitle}>
                    {portfolio?.name ?? 'Your next submission'}
                  </h3>
                  {portfolio ? (
                    <>
                      <AssignmentStatus portfolio={portfolio} />
                      <DeadlineSummary portfolio={portfolio} />
                      <Link href={`/forms/dev-portfolio-submissions/${portfolio.uuid}`}>
                        View assignment & submissions
                      </Link>
                    </>
                  ) : (
                    <p>Select an assignment to see its dates and submission window.</p>
                  )}
                </section>
                <section className={styles.tipSection}>
                  <h3 className={styles.sectionTitle}>Before you submit</h3>
                  <p>
                    {self?.role === 'tpm' || self?.role === 'dev-advisor'
                      ? 'Opened PRs are optional for your role. Include links when available.'
                      : 'Include at least one opened PR and one reviewed PR, or explain an exception.'}
                  </p>
                  <p>Include documentation or testing with every submission.</p>
                </section>
              </Card>
            </aside>
          </div>
          <section className={styles.stack}>
            <div className={styles.toolbar}>
              <h2 className="idol-heading-2">Assignments & submissions</h2>
              <Input
                id="portfolio-search"
                aria-label="Search assignments"
                placeholder="Search assignments"
                icon={<MagnifyingGlassIcon size={16} />}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Table
              caption="Dev portfolio assignments"
              rows={portfolios.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )}
              rowKey={(item) => item.uuid}
              emptyState={
                search
                  ? 'No assignments match your search.'
                  : 'No portfolio assignments have been created yet.'
              }
              columns={[
                {
                  id: 'name',
                  header: 'Assignment',
                  sortValue: (item) => item.name,
                  cell: (item) => (
                    <Link href={`/forms/dev-portfolio-submissions/${item.uuid}`}>{item.name}</Link>
                  )
                },
                {
                  id: 'deadline',
                  header: 'Due date',
                  sortValue: (item) => item.deadline,
                  cell: (item) => portfolioDate(item.deadline)
                },
                {
                  id: 'late',
                  header: 'Late deadline',
                  cell: (item) =>
                    item.lateDeadline ? portfolioDate(item.lateDeadline) : 'Not available'
                },
                {
                  id: 'state',
                  header: 'Submission window',
                  cell: (item) => <AssignmentStatus portfolio={item} />
                },
                {
                  id: 'action',
                  header: 'Actions',
                  cell: (item) => (
                    <Link href={`/forms/dev-portfolio-submissions/${item.uuid}`}>
                      View submissions
                    </Link>
                  )
                }
              ]}
            />
          </section>
        </>
      )}
      <Modal
        id="portfolio-review"
        open={review}
        onOpenChange={(value) => {
          if (!busy) setReview(value);
        }}
        title={`Submit ${portfolio?.name ?? 'assignment'}?`}
        description="Your latest submission replaces previous submissions for grading."
        footer={
          <>
            <Button variant="secondary" disabled={busy} onClick={() => setReview(false)}>
              Keep editing
            </Button>
            <Button disabled={busy} onClick={submit}>
              {busy ? 'Submitting…' : 'Submit assignment'}
            </Button>
          </>
        }
      >
        <div className={styles.modalContent}>
          <p>Check that this submission includes all the work you want reviewed.</p>
          <p>
            {cleanLinks(draft.opened).length} opened {draft.submitRepo ? 'repositories' : 'PRs'} ·{' '}
            {cleanLinks(draft.reviewed).length} reviewed PRs · {cleanLinks(draft.other).length}{' '}
            other PRs
          </p>
          <h3>Documentation or testing</h3>
          <p className={styles.documentation}>{draft.documentation}</p>
          {portfolio && <DeadlineSummary portfolio={portfolio} />}
        </div>
      </Modal>
    </div>
  );
}
