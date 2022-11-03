import { useState, useEffect } from 'react';
import { Card } from 'semantic-ui-react';
import Link from 'next/link';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import styles from './CandidateDeciderBase.module.css';

const CandidateDeciderBase: React.FC = () => {
  const [instances, setInstances] = useState<CandidateDeciderInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    CandidateDeciderAPI.getAllInstances()
      .then((instances) => setInstances(instances))
      .then(() => setIsLoading(false));
  }, []);
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={styles.instanceGroup}>
      {!instances || instances.length === 0 ? (
        <h1 className={styles.emptyMessage}>
          You currently do not have access to any candidate decider instances! Please contact{' '}
          <Link href="https://cornelldti.slack.com/channels/idol-support">#idol-support</Link> if
          you think this is a mistake.
        </h1>
      ) : (
        <Card.Group>
          {instances.map((instance) => (
            <Card href={`/candidate-decider/${instance.uuid}`} key={instance.uuid}>
              <Card.Content>
                <Card.Header>{instance.name}</Card.Header>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      )}
    </div>
  );
};

export default CandidateDeciderBase;
