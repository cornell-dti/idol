import { useState, useEffect } from 'react';
import { Button, Container, Header, Icon, Table } from 'semantic-ui-react';
import { ExportToCsv, Options } from 'export-to-csv';
import { Emitters } from '../../../utils';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import styles from './DevPortfolioDetails.module.css';

type Props = {
  uuid: string;
  isAdminView: boolean;
};

const DevPortfolioDetails: React.FC<Props> = ({ uuid, isAdminView }) => {
  const [portfolio, setPortfolio] = useState<DevPortfolio | null>(null);

  useEffect(() => {
    DevPortfolioAPI.getDevPortfolio(uuid, isAdminView).then((portfolio) => setPortfolio(portfolio));
  }, [uuid, isAdminView]);

  const handleExportToCsv = () => {
    if (portfolio?.submissions === undefined || portfolio?.submissions.length <= 0) {
      Emitters.generalError.emit({
        headerMsg: 'Failed to export Dev Portfolio Submissions to CSV',
        contentMsg: 'Please make sure there is at least 1 submission in the table.'
      });
      return;
    }
    const csvData = portfolio?.submissions.map((submission) => ({
      name: `${submission.member.firstName} ${submission.member.lastName}`,
      netid: submission.member.netid,
      opened_score: Number(submission.openedPRs.some((pr) => pr.status === 'valid')),
      reviewed_score: Number(submission.reviewedPRs.some((pr) => pr.status === 'valid')),
      total_score:
        Number(submission.reviewedPRs.some((pr) => pr.status === 'valid')) +
        Number(submission.openedPRs.some((pr) => pr.status === 'valid'))
    }));

    const options: Options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `${portfolio?.name}Submissions`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(csvData);
  };

  return !portfolio ? (
    <></>
  ) : (
    <Container className={styles.container}>
      <Header textAlign="center" as="h1">
        {portfolio.name}
      </Header>

      <Header as="h3" textAlign="center">
        Earliest Valid Date: {new Date(portfolio.earliestValidDate).toDateString()}
      </Header>
      <Header textAlign="center" as="h3">
        Deadline: {new Date(portfolio.deadline).toDateString()}
      </Header>
      <Button onClick={() => handleExportToCsv()}>Export to CSV</Button>
      <DetailsTable portfolio={portfolio} isAdminView={isAdminView} />
    </Container>
  );
};

type DevPortfolioDetailsTableProps = {
  readonly portfolio: DevPortfolio;
  readonly isAdminView: boolean;
};

const DetailsTable: React.FC<DevPortfolioDetailsTableProps> = ({ portfolio, isAdminView }) => {
  const sortedSubmissions = [...portfolio.submissions].sort((s1, s2) =>
    s1.member.netid.localeCompare(s2.member.netid)
  );

  return (
    <Table celled>
      <Table.Header>
        <Table.HeaderCell rowSpan="2">Name</Table.HeaderCell>
        <Table.HeaderCell rowSpan="2">Opened PRs</Table.HeaderCell>
        <Table.HeaderCell rowSpan="2">Reviewed PRs</Table.HeaderCell>
        {isAdminView ? <Table.HeaderCell rowSpan="2">Status</Table.HeaderCell> : <></>}
      </Table.Header>
      <Table.Body>
        {sortedSubmissions.map((submission) => (
          <SubmissionDetails submission={submission} isAdminView={isAdminView} />
        ))}
      </Table.Body>
    </Table>
  );
};

type SubmissionDetailsProps = {
  submission: DevPortfolioSubmission;
  isAdminView: boolean;
};

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({ submission, isAdminView }) => {
  const numRows = Math.max(submission.openedPRs.length, submission.reviewedPRs.length);
  const isValid =
    submission.openedPRs.some((pr) => pr.status === 'valid') &&
    submission.reviewedPRs.some((pr) => pr.status === 'valid');

  const FirstRow = () => (
    <Table.Row positive={isAdminView && isValid} negative={isAdminView && !isValid}>
      <Table.Cell
        rowSpan={`${numRows}`}
      >{`${submission.member.firstName} ${submission.member.lastName} (${submission.member.netid})`}</Table.Cell>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={submission.openedPRs.length > 0 ? submission.openedPRs[0] : undefined}
          isAdminView={isAdminView}
        />
      </Table.Cell>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={submission.reviewedPRs.length > 0 ? submission.reviewedPRs[0] : undefined}
          isAdminView={isAdminView}
        />
      </Table.Cell>
      {isAdminView ? (
        <Table.Cell rowSpan={`${numRows}`}>{isValid ? 'Valid' : 'Invalid'}</Table.Cell>
      ) : (
        <></>
      )}
    </Table.Row>
  );

  if (numRows <= 1) return <FirstRow />;

  const remainingOpenedPRs = submission.openedPRs.length > 1 ? submission.openedPRs.slice(1) : [];
  const remainingReviewedPRs =
    submission.reviewedPRs.length > 1 ? submission.reviewedPRs.slice(1) : [];
  const remainingRows = (
    remainingOpenedPRs.length > remainingReviewedPRs.length
      ? remainingOpenedPRs
      : remainingReviewedPRs
  ).map((_, i) => () => (
    <Table.Row positive={isAdminView && isValid} negative={isAdminView && !isValid}>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={i >= remainingOpenedPRs.length ? undefined : remainingOpenedPRs[i]}
          isAdminView={isAdminView}
        />
      </Table.Cell>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={i >= remainingReviewedPRs.length ? undefined : remainingReviewedPRs[i]}
          isAdminView={isAdminView}
        />
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <>
      <FirstRow />
      {remainingRows.map((Row) => (
        <Row />
      ))}
    </>
  );
};

type PullRequestDisplayProps = {
  prSubmission: PullRequestSubmission | undefined;
  isAdminView: boolean;
};

const PullRequestDisplay: React.FC<PullRequestDisplayProps> = ({ prSubmission, isAdminView }) => {
  if (prSubmission === undefined) return <></>;
  return (
    <>
      <a href={prSubmission.url}>{prSubmission.url}</a>
      {isAdminView ? (
        <>
          <Icon
            color={prSubmission.status === 'valid' ? 'green' : 'red'}
            name={prSubmission.status === 'valid' ? 'checkmark' : 'x'}
          />
          <p>{prSubmission.reason ? `(${prSubmission.reason})` : ''}</p>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default DevPortfolioDetails;
