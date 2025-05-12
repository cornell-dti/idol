import { useState, useEffect } from 'react';
import { Card } from 'semantic-ui-react';
import Link from 'next/link';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';
import InterviewStatusDashboard from './InterviewStatusDashboard';
import styles from './InterviewStatusBase.module.css';
import { Emitters } from '../../../utils';
import Button from '../../Common/Button/Button';

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
  }, [selected]);

  const handleNewEmptyInstance = async () => {
    const raw = window.prompt('Enter a name for your new instance:');
    const name = raw?.trim();
    if (!name) return;
    if (groups.some((g) => g.instanceName === name)) {
      Emitters.generalError.emit({
        headerMsg: `${name} Instance Already Exists`,
        contentMsg: `Please choose a different name to proceed.`
      });
      return;
    }
    setIsLoading(true);
    const emptyInstance: StatusInstance = { instanceName: name, statuses: [] };
    setSelected(emptyInstance);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className={styles.loading}>
      <p>Loading...</p>
    </div>;
  }

  if (selected) {
    return (
      <div className={styles.selectedView}>
        <div className={styles.buttonRow}>
          <Button
            label="Back to Instances"
            onClick={() => setSelected(null)}
          />
        </div>
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
            <Card
              onClick={() => setSelected(group)}
              key={group.instanceName}
              className={styles.card}
              as="button"
              type="button"
            >
              <Card.Content>
                <Card.Header>{group.instanceName}</Card.Header>
              </Card.Content>
            </Card>
          ))}
          <Card
            onClick={handleNewEmptyInstance}
            className={`${styles.card} ${styles.newInstanceCard}`}
            as="button"
            type="button"
          >
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
