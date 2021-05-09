import React, { useEffect, useState } from 'react';
import { Button, Card, Loader } from 'semantic-ui-react';
import APIWrapper from '../../API/APIWrapper';
import { backendURL } from '../../environment';

import styles from './MemberReview.module.css';

const DiffRenderer = ({ children }: { readonly children: string }) => (
  <pre className="language-diff-json diff-highlight">
    <code className="language-diff-json diff-highlight">
      {children.split('\n').map((l, lineNo) => {
        const line = `${l}\n`;
        let backgroundColor: string | undefined;
        if (line.startsWith('@@')) {
          backgroundColor = 'rgba(0,0,255,0.2)';
        }
        if (line.startsWith('+')) {
          backgroundColor = 'rgba(0,255,0,0.2)';
        }
        if (line.startsWith('-')) {
          backgroundColor = 'rgba(255,0,0,0.2)';
        }
        return (
          <span key={lineNo} style={{ backgroundColor }}>
            {line}
          </span>
        );
      })}
    </code>
  </pre>
);

const getDiffs = async (): Promise<readonly IdolMemberDiff[]> => {
  const resp = await APIWrapper.get(`${backendURL}/memberDiffs`);
  return resp.data.diffs;
};

type Status = 'accepted' | 'rejected' | 'no-action';

const MemberReview: React.FC = () => {
  const [diffs, setDiffs] = useState<readonly IdolMemberDiff[] | null>(null);
  const [statusList, setStatusList] = useState<readonly Status[]>([]);

  useEffect(() => {
    getDiffs().then((fetchedDiffs) => {
      setDiffs(fetchedDiffs);
      setStatusList(fetchedDiffs.map(() => 'no-action'));
    });
  }, []);

  if (diffs == null) return <Loader active={true} size="massive" />;

  const changeStatus = (index: number, status: Status) =>
    setStatusList((oldList) => {
      const newList = [...oldList];
      newList[index] = status;
      return newList;
    });

  const approvedEmails = diffs
    .filter((_, index) => statusList[index] === 'accepted')
    .map((it) => it.email);
  const rejectedEmails = diffs
    .filter((_, index) => statusList[index] === 'rejected')
    .map((it) => it.email);

  const sendReviewRequest = async () => {
    await APIWrapper.post(`${backendURL}/reviewMemberDiffs`, {
      approved: approvedEmails,
      rejected: rejectedEmails
    });
    const fetchedDiffs = await getDiffs();
    setDiffs(fetchedDiffs);
    setStatusList(fetchedDiffs.map(() => 'no-action'));
  };

  return (
    <div className={styles.Wrapper}>
      {diffs.length === 0 && (
        <Card style={{ width: '100%', whiteSpace: 'pre-wrap' }}>
          <Card.Content>No changes need to approve.</Card.Content>
        </Card>
      )}
      {diffs.length > 0 && (
        <div className={styles.ApprovingContainer}>
          <div className={styles.ApprovingContainerCards}>
            {diffs.map(({ email, diffString }, index) => (
              <Card
                key={email}
                style={{ width: '100%', whiteSpace: 'pre-wrap' }}
              >
                <Card.Content>
                  <h2>{email}</h2>
                  <DiffRenderer>{diffString}</DiffRenderer>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui one buttons" style={{ width: '100%' }}>
                    {statusList[index] !== 'accepted' && (
                      <Button
                        basic
                        color="green"
                        onClick={() => changeStatus(index, 'accepted')}
                      >
                        Approve
                      </Button>
                    )}
                    {statusList[index] !== 'rejected' && (
                      <Button
                        basic
                        color="red"
                        onClick={() => changeStatus(index, 'rejected')}
                      >
                        Reject
                      </Button>
                    )}
                    {statusList[index] !== 'no-action' && (
                      <Button
                        basic
                        color="grey"
                        onClick={() => changeStatus(index, 'no-action')}
                      >
                        No Action
                      </Button>
                    )}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
          <div className={styles.ApprovingContainerSideBar}>
            <Card style={{ width: '100%', whiteSpace: 'pre-wrap' }}>
              <Card.Content>
                <h2>Current Approved Member Change List</h2>
              </Card.Content>
              <Card.Content>
                <ul>
                  {approvedEmails.map((email) => (
                    <li key={email}>Email: {email}</li>
                  ))}
                </ul>
              </Card.Content>
              <Card.Content>
                <h2>Current Rejected Member Change List</h2>
              </Card.Content>
              <Card.Content>
                <ul>
                  {rejectedEmails.map((email) => (
                    <li key={email}>Email: {email}</li>
                  ))}
                </ul>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons" style={{ width: '100%' }}>
                  <Button
                    basic
                    disabled={
                      approvedEmails.length + rejectedEmails.length === 0
                    }
                    color="green"
                    onClick={sendReviewRequest}
                  >
                    Submit Reviews
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberReview;
