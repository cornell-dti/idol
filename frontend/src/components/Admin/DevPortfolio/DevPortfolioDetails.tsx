import { useState, useEffect } from 'react';
import { Container, Header, Icon, Table } from 'semantic-ui-react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import styles from './DevPortfolioDetails.module.css';

type Props = {
  uuid: string;
};

const portfolio = {
  uuid: 'test test',
  name: 'Dev Portfolio #1',
  earliestValidDate: new Date().getTime(),
  deadline: new Date().getTime(),
  submissions: [
    {
      member: {
        firstName: 'Jackson',
        lastName: 'Staniec',
        netid: 'jks273'
      },
      openedPRs: [
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'invalid',
          reason: 'hello world'
        }
      ],
      reviewedPRs: [
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'invalid',
          reason: 'hello world'
        }
      ]
    },
    {
      member: {
        firstName: 'Henry',
        lastName: 'Li',
        netid: 'hl738'
      },
      openedPRs: [
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'valid',
          reason: 'hello world'
        },
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'valid',
          reason: 'hello world'
        }
      ],
      reviewedPRs: [
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'valid',
          reason: 'hello world'
        }
      ]
    },
    {
      member: {
        firstName: 'Riya',
        lastName: 'Jaggi',
        netid: 'rj356'
      },
      openedPRs: [
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'valid',
          reason: 'hello world'
        },
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'invalid',
          reason: 'hello world'
        },
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'invalid',
          reason: 'hello world'
        }
      ],
      reviewedPRs: [
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'invalid',
          reason: 'hello world'
        },
        {
          url: 'https://github.com/cornell-dti/idol/pull/288',
          status: 'invalid',
          reason: 'hello world'
        }
      ]
    }
  ]
};

const DevPortfolioDetails: React.FC<Props> = ({ uuid }) => {
  // const [portfolio, setPortfolio] = useState<DevPortfolio | null>(null);

  // useEffect(() => {
  //   DevPortfolioAPI.getDevPortfolio(uuid).then((portfolio) => setPortfolio(portfolio));
  // }, [uuid]);
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
      <DetailsTable portfolio={portfolio} />
    </Container>
  );
};

type DevPortfolioDetailsTableProps = {
  readonly portfolio: DevPortfolio;
};

const DetailsTable: React.FC<DevPortfolioDetailsTableProps> = ({ portfolio }) => {
  const sortedSubmissions = [...portfolio.submissions].sort((s1, s2) =>
    s1.member.netid.localeCompare(s2.member.netid)
  );

  return (
    <Table celled>
      <Table.Header>
        <Table.HeaderCell rowSpan="2">Name</Table.HeaderCell>
        <Table.HeaderCell rowSpan="2">Opened PRs</Table.HeaderCell>
        <Table.HeaderCell rowSpan="2">Reviewed PRs</Table.HeaderCell>
        <Table.HeaderCell rowSpan="2">Status</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {sortedSubmissions.map((submission) => (
          <SubmissionDetails submission={submission} />
        ))}
      </Table.Body>
    </Table>
  );
};

type SubmissionDetailsProps = {
  submission: DevPortfolioSubmission;
};

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({ submission }) => {
  const numRows = Math.max(submission.openedPRs.length, submission.reviewedPRs.length);
  const isValid =
    submission.openedPRs.some((pr) => pr.status === 'valid') &&
    submission.reviewedPRs.some((pr) => pr.status === 'valid');

  const FirstRow = () => (
    <Table.Row positive={isValid} negative={!isValid}>
      <Table.Cell
        rowSpan={`${numRows}`}
      >{`${submission.member.firstName} ${submission.member.lastName} (${submission.member.netid})`}</Table.Cell>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={submission.openedPRs.length > 0 ? submission.openedPRs[0] : undefined}
        />
      </Table.Cell>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={submission.reviewedPRs.length > 0 ? submission.reviewedPRs[0] : undefined}
        />
      </Table.Cell>
      <Table.Cell rowSpan={`${numRows}`}>{isValid ? 'Valid' : 'Invalid'}</Table.Cell>
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
    <Table.Row positive={isValid} negative={!isValid}>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={i >= remainingOpenedPRs.length ? undefined : remainingOpenedPRs[i]}
        />
      </Table.Cell>
      <Table.Cell>
        <PullRequestDisplay
          prSubmission={i >= remainingReviewedPRs.length ? undefined : remainingReviewedPRs[i]}
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
};

const PullRequestDisplay: React.FC<PullRequestDisplayProps> = ({ prSubmission }) => {
  if (prSubmission === undefined) return <></>;
  return (
    <>
      <a href={prSubmission.url}>{prSubmission.url}</a>
      {
        <Icon
          color={prSubmission.status === 'valid' ? 'green' : 'red'}
          name={prSubmission.status === 'valid' ? 'checkmark' : 'x'}
        />
      }
    </>
  );
};

export default DevPortfolioDetails;
