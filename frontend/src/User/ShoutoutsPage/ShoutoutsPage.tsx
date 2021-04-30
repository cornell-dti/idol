import React, { useContext, useState, useEffect } from 'react';
import { Message } from 'semantic-ui-react';
import { UserContext } from '../../UserProvider/UserProvider';
import Emitters from '../../EventEmitter/constant-emitters';
import ShoutoutForm from './ShoutoutForm/ShoutoutForm';
import ShoutoutList from './ShoutoutList/ShoutoutList';
import styles from './ShoutoutsPage.module.css';
import { Shoutout, ShoutoutsAPI } from '../../API/ShoutoutsAPI';

const ShoutoutsPage: React.FC = () => {
  const userEmail = useContext(UserContext).user?.email;
  const [givenShoutouts, setGivenShoutouts] = useState<Shoutout[] | undefined>(
    undefined
  );
  const [receivedShoutouts, setReceivedShoutouts] = useState<
    Shoutout[] | undefined
  >(undefined);

  const getShoutouts = async (
    email: string,
    type: string
  ): Promise<Shoutout[]> => {
    const shoutouts = await ShoutoutsAPI.getShoutouts(email, type);
    return shoutouts;
  };

  useEffect(() => {
    if (userEmail) {
      getShoutouts(userEmail, 'given')
        .then((given) => {
          setGivenShoutouts(given);
        })
        .catch((error) => {
          Emitters.generalError.emit({
            headerMsg: `Couldn't get given shoutouts!`,
            contentMsg: `Error was: ${error}`
          });
        });

      getShoutouts(userEmail, 'received')
        .then((received) => {
          setReceivedShoutouts(received);
        })
        .catch((error) => {
          Emitters.generalError.emit({
            headerMsg: `Couldn't get received shoutouts!`,
            contentMsg: `Error was: ${error}`
          });
        });
    }
  }, [userEmail]);

  return (
    <div>
      <div
        style={{
          width: '50%',
          alignSelf: 'center',
          margin: 'auto',
          paddingTop: '10vh',
          height: 'calc(100vh - 80px - 25vh)'
        }}
      >
        <ShoutoutForm />
      </div>

      <div className={styles.listsContainer}>
        <div className={styles.listContainer}>
          <h2 className={styles.shoutoutTitle}>Given Shoutouts</h2>
          {givenShoutouts && givenShoutouts.length > 0 ? (
            <ShoutoutList shoutouts={givenShoutouts} />
          ) : (
            <Message>Give someone a shoutout!</Message>
          )}
        </div>

        <div className={styles.listContainer}>
          <h2 className={styles.shoutoutTitle}>Received Shoutouts</h2>

          {receivedShoutouts && receivedShoutouts.length > 0 ? (
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
