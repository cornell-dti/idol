import { useState, useEffect } from 'react';
import { Button, Container, Header, Icon, Table, Dropdown } from 'semantic-ui-react';
import { ExportToCsv, Options } from 'export-to-csv';
import DevPortfolioTextModal from '../../Modals/DevPortfolioTextModal';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { Emitters } from '../../../utils';
import styles from './DevPortfolioDetails.module.css';

type Props = {
  uuid: string;
  isAdminView: boolean;
};

const sortSubmissions = (submissions: DevPortfolioSubmission[]) =>
  submissions.sort((s1, s2) => s1.member.netid.localeCompare(s2.member.netid));

const DevPortfolioDetails: React.FC<Props> = ({ uuid, isAdminView }) => {
  const [portfolio, setPortfolio] = useState<DevPortfolio | null>(null);
  const [isRegrading, setIsRegrading] = useState<boolean>(false);

  useEffect(() => {
    if (isAdminView) {
      DevPortfolioAPI.getDevPortfolio(uuid).then((portfolio) => setPortfolio(portfolio));
    } else {
      DevPortfolioAPI.getDevPortfolioInfo(uuid).then((portfolioInfo) => {
        const portfolio = portfolioInfo as DevPortfolio;
        DevPortfolioAPI.getUsersDevPortfolioSubmissions(uuid).then((portfolioSubmissions) => {
          setPortfolio({ ...portfolio, submissions: portfolioSubmissions });
        });
      });
    }
  }, [uuid, isAdminView]);

  const handleExportToCsv = () => {
    if (portfolio?.submissions === undefined || portfolio?.submissions.length <= 0) {
      Emitters.generalError.emit({
        headerMsg: 'Failed to export Dev Portfolio Submissions to CSV',
        contentMsg: 'Please make sure there is at least 1 submission in the table.'
      });
      return;
    }

    const reverseSubmissions = portfolio.submissions.reverse();

    const sortedSubmissions = sortSubmissions(reverseSubmissions);

    const uniqueIds = new Set();

    const uniqueSubmissions = sortedSubmissions.filter((submission) => {
      const isDuplicate = uniqueIds.has(submission.member.netid);
      uniqueIds.add(submission.member.netid);
      if (!isDuplicate) {
        return true;
      }
      return false;
    });

    const csvData = uniqueSubmissions.map((submission) => {
      const open = Number(submission.openedPRs.some((pr) => pr.status === 'valid'));
      const review = Number(submission.reviewedPRs.some((pr) => pr.status === 'valid'));
      return {
        name: `${submission.member.firstName} ${submission.member.lastName}`,
        netid: submission.member.netid,
        opened_score: open,
        reviewed_score: review,
        total_score:
          (submission.status === 'valid' && 2) || // in case admin gave full points
          (submission.status === 'invalid' && '0') || // in case admin gave zero points
          open + review,
        status: submission.status,
        late: submission.isLate ? 1 : 0
      };
    });

    const options: Options = {
      filename: `${portfolio?.name}_Submissions`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `${portfolio?.name} Submissions`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(csvData);
  };

  const timeLabel = (isoDate: number) => new Date(isoDate).toLocaleString();

  return !portfolio ? (
    <></>
  ) : (
    <Container className={styles.container}>
      <Header textAlign="center" as="h1">
        {portfolio.name}
      </Header>

      <Header as="h3" textAlign="center">
        Earliest Valid Date: {timeLabel(portfolio.earliestValidDate)}
      </Header>
      <Header textAlign="center" as="h3">
        Deadline: {timeLabel(portfolio.deadline)}
      </Header>
      {portfolio.lateDeadline && (
        <Header textAlign="center" as="h3">
          Late Deadline: {timeLabel(portfolio.lateDeadline)}
        </Header>
      )}
      {isAdminView ? <Button onClick={() => handleExportToCsv()}>Export to CSV</Button> : <></>}
      {isAdminView ? (
        <Button
          onClick={() => {
            setIsRegrading(true);
            DevPortfolioAPI.regradeSubmissions(portfolio.uuid)
              .then((portfolio) => {
                setPortfolio(portfolio);
                setIsRegrading(false);
                Emitters.generalSuccess.emit({
                  headerMsg: 'Success!',
                  contentMsg: 'Submissions successfully regraded.'
                });
              })
              .catch((e) =>
                Emitters.generalError.emit({
                  headerMsg: 'Failed to regrade all submissions',
                  contentMsg: 'Please try again or contact the IDOL team'
                })
              );
          }}
          loading={isRegrading}
          className="right-button"
        >
          Regrade All Submissions
        </Button>
      ) : (
        <> </>
      )}
      {!isAdminView && (
        <p>
          Please note that we only use the most recent submission for your grade. You can reach out
          to the dev leads if you have any questions about the validation process.
        </p>
      )}
      <DetailsTable portfolio={portfolio} isAdminView={isAdminView} />
      <span>
        <Icon name="exclamation circle" color="red" />
        <b>= Late submission</b>
      </span>
    </Container>
  );
};

type DevPortfolioDetailsTableProps = {
  readonly portfolio: DevPortfolio;
  readonly isAdminView: boolean;
};

const DetailsTable: React.FC<DevPortfolioDetailsTableProps> = ({ portfolio, isAdminView }) => {
  const sortedSubmissions = sortSubmissions([...portfolio.submissions]);

  const updateStatus = async (
    submission: DevPortfolioSubmission,
    submissionIndex: number,
    status: SubmissionStatus
  ) => {
    const updatedSubmission: DevPortfolioSubmission = {
      ...submission,
      status
    };

    // update submission
    const updatedSubmissions = portfolio.submissions;
    updatedSubmissions[submissionIndex] = updatedSubmission;

    return DevPortfolioAPI.updateSubmissions(portfolio.uuid, updatedSubmissions);
  };

  return (
    <Table celled unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Opened PRs</Table.HeaderCell>
          <Table.HeaderCell>Reviewed PRs</Table.HeaderCell>
          <Table.HeaderCell>Documentation/Testing</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          {sortedSubmissions.some((submission) => submission.text) && (
            <Table.HeaderCell></Table.HeaderCell>
          )}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedSubmissions.map((submission, i) => {
          const index = portfolio.submissions.indexOf(submission);
          return (
            <SubmissionDetails
              submission={submission}
              updateStatus={(status) => updateStatus(submission, index, status)}
              isAdminView={isAdminView}
              key={i}
            />
          );
        })}
      </Table.Body>
    </Table>
  );
};

type SubmissionDetailsProps = {
  submission: DevPortfolioSubmission;
  updateStatus: (status: SubmissionStatus) => Promise<DevPortfolio>;
  isAdminView: boolean;
};

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  submission,
  updateStatus,
  isAdminView
}) => {
  const numRows = Math.max(1, Math.max(submission.openedPRs.length, submission.reviewedPRs.length));
  const [submissionStatus, setSubmissionStatus] = useState(submission.status);

  // in case of regrade, need to reinitialize to correct status
  useEffect(() => {
    setSubmissionStatus(submission.status);
  }, [submission]);

  const FirstRow = () => {
    const statusOptions = ['valid', 'invalid', 'pending'].map((state) => ({
      key: state,
      value: state,
      text: state[0].toUpperCase() + state.slice(1) // uppercase first letter
    }));

    const [isLoading, setIsLoading] = useState(false);
    return (
      <Table.Row
        positive={submissionStatus === 'valid'}
        negative={submissionStatus === 'invalid'}
        warning={submissionStatus === 'pending'}
      >
        <Table.Cell rowSpan={`${numRows}`}>
          {`${submission.member.firstName} ${submission.member.lastName} (${submission.member.netid})`}
          {submission.isLate && <Icon name="exclamation circle" color="red" />}
        </Table.Cell>
        <Table.Cell>
          <PullRequestDisplay
            prSubmission={submission.openedPRs.length > 0 ? submission.openedPRs[0] : undefined}
            submitRepo={submission.submitRepo}
          />
        </Table.Cell>
        <Table.Cell>
          <PullRequestDisplay
            prSubmission={submission.reviewedPRs.length > 0 ? submission.reviewedPRs[0] : undefined}
          />
        </Table.Cell>
        <Table.Cell className={styles.documentation}>{submission.documentationText}</Table.Cell>

        {isAdminView ? (
          <Table.Cell rowSpan={`${numRows}`}>
            <Dropdown
              options={statusOptions}
              disabled={isLoading}
              defaultValue={submissionStatus}
              fluid
              className={`ui selection ${isLoading ? 'loading' : ''}`}
              onChange={(_, d) => {
                setIsLoading(true);
                const status = d.value as SubmissionStatus;
                updateStatus(status).then((_) => {
                  setIsLoading(false);
                  setSubmissionStatus(status);
                });
              }}
            />
          </Table.Cell>
        ) : (
          <Table.Cell rowSpan={`${numRows}`}>
            {submissionStatus[0].toUpperCase() + submissionStatus.slice(1)}
          </Table.Cell>
        )}
        {submission.text ? (
          <Table.Cell rowSpan={`${numRows}`}>
            <DevPortfolioTextModal
              title={`${submission.member.firstName} ${submission.member.lastName}`}
              text={submission.text}
              member={submission.member}
              otherPRs={submission.otherPRs}
            ></DevPortfolioTextModal>
          </Table.Cell>
        ) : (
          <div></div>
        )}
      </Table.Row>
    );
  };

  if (numRows <= 1) return <FirstRow />;

  const remainingOpenedPRs = submission.openedPRs.length > 1 ? submission.openedPRs.slice(1) : [];
  const remainingReviewedPRs =
    submission.reviewedPRs.length > 1 ? submission.reviewedPRs.slice(1) : [];
  const remainingRows = (
    remainingOpenedPRs.length > remainingReviewedPRs.length
      ? remainingOpenedPRs
      : remainingReviewedPRs
  ).map((_, i) => () => (
    <Table.Row
      positive={submissionStatus === 'valid'}
      negative={submissionStatus === 'invalid'}
      warning={submissionStatus === 'pending'}
      key={i}
    >
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={i >= remainingOpenedPRs.length ? undefined : remainingOpenedPRs[i]}
          submitRepo={submission.submitRepo}
        />
      </Table.Cell>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={i >= remainingReviewedPRs.length ? undefined : remainingReviewedPRs[i]}
        />
      </Table.Cell>
      <Table.Cell />
      {!submission.text ? <div></div> : <></>}
    </Table.Row>
  ));

  return (
    <>
      <FirstRow />
      {remainingRows.map((Row, i) => (
        <Row key={i} />
      ))}
    </>
  );
};

type PullRequestDisplayProps = {
  prSubmission: PullRequestSubmission | undefined;
  submitRepo?: boolean;
};

const PullRequestDisplay: React.FC<PullRequestDisplayProps> = ({ prSubmission, submitRepo }) => {
  if (prSubmission === undefined || !prSubmission.url) return <></>;
  const isValid = prSubmission.status === 'valid';

  return (
    <>
      <a href={prSubmission.url} target="_blank" rel="noreferrer noopener">
        {prSubmission.url}
      </a>
      <>
        <Icon color={isValid ? 'green' : 'red'} name={isValid ? 'checkmark' : 'x'} />
        <p>{prSubmission.reason ? `(${prSubmission.reason})` : ''}</p>
        {submitRepo && <p>{'Submitted a Personal Repository'}</p>}
      </>
    </>
  );
};

export default DevPortfolioDetails;
