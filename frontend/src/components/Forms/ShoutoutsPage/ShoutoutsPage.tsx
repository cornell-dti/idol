/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import { Message, Loader } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { Emitters } from '../../../utils';
import ShoutoutForm from './ShoutoutForm';
import ShoutoutList from './ShoutoutList';
import styles from './ShoutoutsPage.module.css';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';


const ShoutoutsPage: React.FC = () => {
  const userEmail = useUserEmail();
  const [givenShoutouts, setGivenShoutouts] = useState<Shoutout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const getGivenShoutouts = useCallback(() => {
    setIsLoading(true);
    ShoutoutsAPI.getShoutouts(userEmail, 'given')
      .then((given) => {
        setGivenShoutouts(given);
        setIsLoading(false);
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: `Couldn't get given shoutouts!`,
          contentMsg: `Error was: ${error}`
        });
        setIsLoading(false);
      });
  }, [userEmail]);
  
  useEffect(() => {
    getGivenShoutouts();
  }, [userEmail, getGivenShoutouts]);

  return (
    <div>
      <div className={styles.shoutoutFormContainer}>
        <ShoutoutForm getGivenShoutouts={getGivenShoutouts} />
      </div>

      <div className={styles.shoutoutListContainer}>
        <h2>Given Shoutouts</h2>
        {isLoading ? ( 
          <Loader active inline='centered' />
        ) : givenShoutouts.length > 0 ? (
          <ShoutoutList
            shoutouts={givenShoutouts.sort((a, b) => a.timestamp - b.timestamp)}
            setGivenShoutouts={setGivenShoutouts}
          />
        ) : (
          <Message>Give someone a shoutout!</Message>
        )}
      </div>
    </div>
  );
};

export default ShoutoutsPage;
