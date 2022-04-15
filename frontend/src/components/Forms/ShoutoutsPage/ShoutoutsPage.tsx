import React, { useState, useEffect } from 'react';
import { Message } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { Emitters } from '../../../utils';
import ShoutoutForm from './ShoutoutForm';
import ShoutoutList from './ShoutoutList';
import styles from './ShoutoutsPage.module.css';
import { Shoutout, ShoutoutsAPI } from '../../../API/ShoutoutsAPI';

const ShoutoutsPage: React.FC = () => {
  const userEmail = useUserEmail();
  const [givenShoutouts, setGivenShoutouts] = useState<Shoutout[]>([]);
  const [receivedShoutouts, setReceivedShoutouts] = useState<Shoutout[]>([]);

  useEffect(() => {
    ShoutoutsAPI.getShoutouts(userEmail, 'given')
      .then((given) => {
        setGivenShoutouts(given);
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: `Couldn't get given shoutouts!`,
          contentMsg: `Error was: ${error}`
        });
      });

    ShoutoutsAPI.getShoutouts(userEmail, 'received')
      .then((received) => {
        setReceivedShoutouts(received);
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: `Couldn't get received shoutouts!`,
          contentMsg: `Error was: ${error}`
        });
      });
  }, [userEmail]);

  return (
    <div>
      <div className={styles.shoutoutFormContainer}>
        <ShoutoutForm />
      </div>

      <div className={styles.listsContainer}>
        <div className={styles.listContainer}>
          <h2 className={styles.shoutoutTitle}>Given Shoutouts</h2>
          {givenShoutouts.length > 0 ? (
            <ShoutoutList shoutouts={givenShoutouts} />
          ) : (
            <Message>Give someone a shoutout!</Message>
          )}
        </div>

        <div className={styles.listContainer}>
          <h2 className={styles.shoutoutTitle}>Received Shoutouts</h2>

          {receivedShoutouts.length > 0 ? (
            <ShoutoutList shoutouts={receivedShoutouts} />
          ) : (
            <Message>You currently have no shoutouts.</Message>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoutoutsPage;
