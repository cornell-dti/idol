import { useState, useEffect } from 'react';
import { Button, Container, Header, Icon, Table, Modal } from 'semantic-ui-react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { Emitters } from '../../../utils';
import styles from './DevPortfolioDetails.module.css';

type Props = {
  uuid: string;
  isAdminView: boolean;
};

const DevPortfolioDetails: React.FC<Props> = ({ uuid, isAdminView }) => {
  const [portfolio, setPortfolio] = useState<DevPortfolio | null>(null);
  const [isRegrading, setIsRegrading] = useState<boolean>(false);

  useEffect(() => {
    DevPortfolioAPI.getDevPortfolio(uuid, isAdminView).then((portfolio) => setPortfolio(portfolio));
  }, [uuid, isAdminView]);

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
        >
          Regrade All Submissions
        </Button>
      ) : (
        <> </>
      )}
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
        {sortedSubmissions.some((submission) => submission.text) ? (
          <Table.HeaderCell rowSpan="2"></Table.HeaderCell>
        ) : (
          <></>
        )}
      </Table.Header>
      <Table.Body>
        {sortedSubmissions.map((submission, i) => (
          <SubmissionDetails submission={submission} isAdminView={isAdminView} key={i} />
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
  const [viewText, setViewText] = useState(false);

  const numRows = Math.max(submission.openedPRs.length, submission.reviewedPRs.length);
  const isValid =
    submission.openedPRs.some((pr) => pr.status === 'valid') &&
    submission.reviewedPRs.some((pr) => pr.status === 'valid');
  const hasText = Boolean(submission.text);

  const FirstRow = () => (
    <Table.Row
      positive={isAdminView && isValid}
      negative={isAdminView && !isValid}
      warning={isAdminView && hasText}
    >
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
        <Table.Cell rowSpan={`${numRows}`}>
          {<div>{(hasText && 'Pending') || (isValid ? 'Valid' : 'Invalid')}</div>}
        </Table.Cell>
      ) : (
        <></>
      )}
      {submission.text ? (
        <Table.Cell rowSpan={`${numRows}`}>
          <Modal
            onClose={() => setViewText(false)}
            onOpen={() => setViewText(true)}
            open={viewText}
            trigger={<Button>Show Text</Button>}
          >
            <Modal.Header>
              Paragraph Response for {submission.member.firstName} {submission.member.lastName}
            </Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>{submission.text}</p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" onClick={() => setViewText(false)}>
                Close
              </Button>
            </Modal.Actions>
          </Modal>
        </Table.Cell>
      ) : (
        <div></div>
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
    <Table.Row positive={isAdminView && isValid} negative={isAdminView && !isValid} key={i}>
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
      {remainingRows.map((Row, i) => (
        <Row key={i} />
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
  const isValid = prSubmission.status === 'valid';
  return (
    <>
      <a href={prSubmission.url}>{prSubmission.url}</a>
      {isAdminView ? (
        <>
          <Icon color={isValid ? 'green' : 'red'} name={isValid ? 'checkmark' : 'x'} />
          <p>{prSubmission.reason ? `(${prSubmission.reason})` : ''}</p>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default DevPortfolioDetails;
