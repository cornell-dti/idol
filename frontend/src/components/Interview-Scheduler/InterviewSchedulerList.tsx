import { useEffect, useState } from 'react';
import { Card, Header, Loader } from 'semantic-ui-react';
import styles from './InterviewSchedulerList.module.css';
import InterviewSchedulerAPI from '../../API/InterviewSchedulerAPI';
import { useHasMemberPermission } from '../Common/FirestoreDataProvider';

const InterviewSchedulerList = () => {
  const [schedulers, setSchedulers] = useState<InterviewScheduler[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMember = useHasMemberPermission();

  useEffect(() => {
    InterviewSchedulerAPI.getAllInstances(!isMember)
      .then((val) => setSchedulers(val))
      .then(() => setIsLoading(false));
  }, [isMember]);

  return isLoading ? (
    <Loader size="massive" />
  ) : (
    <div className={styles.listContainer}>
      <Header as="h2">Interview Schedulers</Header>
      {!schedulers || schedulers.length === 0 ? (
        <p>
          You currently do not have access to any interview schedulers. If you think this is an
          error please contact {isMember ? '#idol-support' : 'hello@cornelldti.org'}.
        </p>
      ) : (
        <Card.Group>
          {schedulers.map((scheduler) => (
            <Card href={`interview-scheduler/${scheduler.uuid}`} key={scheduler.uuid}>
              <Card.Content>
                <Card.Header>{scheduler.name}</Card.Header>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      )}
    </div>
  );
};

export default InterviewSchedulerList;
