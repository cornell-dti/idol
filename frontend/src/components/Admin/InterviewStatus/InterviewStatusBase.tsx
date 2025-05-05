import { useState, useEffect } from 'react';
import { Button, Card } from 'semantic-ui-react';
import Link from 'next/link';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';
import InterviewStatusDashboard from './InterviewStatusDashboard';
import styles from './InterviewStatusBase.module.css';

const InterviewStatusBase: React.FC = () => {
  const [groups, setGroups] = useState<StatusInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<StatusInstance | null>(null);

  useEffect(() => {
    InterviewStatusAPI.getAllInterviewStatuses()
      .then((all: InterviewStatus[]) => {
        const map = all.reduce<Record<string, InterviewStatus[]>>((acc, st) => {
          (acc[st.instance] ||= []).push(st);
          return acc;
        }, {});

        const grouped: StatusInstance[] = Object.entries(map)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([instanceName, statuses]) => ({
            instanceName,
            statuses
          }));
        setGroups(grouped);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleNewEmptyInstance = async () => {
    const name = window.prompt('Enter a name for your new instance:');
    if (!name?.trim()) return;
    setIsLoading(true);
    const emptyInstance: StatusInstance = { instanceName: name, statuses: [] };
    setSelected(emptyInstance);
    setIsLoading(false);
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (selected) {
    return (
      <div>
        <Button
          onClick={() => setSelected(null)} basic>
          Back to Instances
        </Button>
        <InterviewStatusDashboard
          instanceName={selected.instanceName}
          statuses={selected.statuses}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!groups || groups.length === 0 ? (
        <h1>
          You currently do not have access to any interview status instances! Please contact{' '}
          <Link href="https://cornelldti.slack.com/channels/idol-support">#idol-support</Link> if
          you think this is a mistake.
        </h1>
      ) : (
        <Card.Group>
          {groups.map((group) => (
            <Card onClick={() => setSelected(group)} key={group.instanceName}
              className={styles.card}>
              <Card.Content>
                <Card.Header>{group.instanceName}</Card.Header>
              </Card.Content>
            </Card>
          ))}
          <Card onClick={handleNewEmptyInstance}
            className={`${styles.card} ${styles.newInstanceCard}`}>
            <Card.Content>
              <Card.Header>{'+ New Empty Instance'}</Card.Header>
            </Card.Content>
          </Card>
        </Card.Group>
      )}
    </div>
  );
};

export default InterviewStatusBase;
