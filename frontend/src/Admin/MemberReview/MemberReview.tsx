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

const MemberReview: React.FC = () => {
  const [diffs, setDiffs] = useState<readonly IdolMemberDiff[] | null>(null);
  const [approved, setApproved] = useState<readonly string[]>([]);

  useEffect(() => {
    getDiffs().then((fetchedDiffs) => {
      setDiffs(fetchedDiffs);
      setApproved([]);
    });
  }, []);

  if (diffs == null) return <Loader active={true} size="massive" />;

  const toggleApprove = (email: string) =>
    setApproved((currentApproved) =>
      currentApproved.includes(email)
        ? currentApproved.filter((it) => it !== email)
        : [...currentApproved, email]
    );

  const sendApproveRequest = async () => {
    await APIWrapper.post(`${backendURL}/approveMemberDiffs`, { approved });
    const fetchedDiffs = await getDiffs();
    setDiffs(fetchedDiffs);
    setApproved([]);
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
            {diffs.map(({ email, diffString }) => (
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
                    <Button
                      basic
                      color={approved.includes(email) ? 'red' : 'green'}
                      onClick={() => toggleApprove(email)}
                    >
                      {approved.includes(email) ? 'Unapprove' : 'Approve'}
                    </Button>
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
                  {approved.map((email) => (
                    <li key={email}>Email: {email}</li>
                  ))}
                </ul>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons" style={{ width: '100%' }}>
                  <Button
                    basic
                    disabled={approved.length === 0}
                    color="green"
                    onClick={sendApproveRequest}
                  >
                    Submit Approvals
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
