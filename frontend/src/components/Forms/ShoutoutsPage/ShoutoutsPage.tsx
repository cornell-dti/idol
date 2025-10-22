/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import { Message, Loader, Button } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider/UserProvider';
import { useMembers } from '../../Common/FirestoreDataProvider';
import { Emitters } from '../../../utils';
import ShoutoutForm from './ShoutoutForm';
import ShoutoutList from './ShoutoutList';
import styles from './ShoutoutsPage.module.css';
import ShoutoutsAPI from '../../../API/ShoutoutsAPI';

type ShoutoutView = 'given' | 'mentions';

const ShoutoutsPage: React.FC = () => {
  const userEmail = useUserEmail();
  const members = useMembers();
  const user = members.find((it) => it.email === userEmail);
  const [givenShoutouts, setGivenShoutouts] = useState<Shoutout[]>([]);
  const [mentionShoutouts, setMentionShoutouts] = useState<Shoutout[]>([]);
  const [currentView, setCurrentView] = useState<ShoutoutView>('given');
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

  const getMentionShoutouts = useCallback(() => {
    if (!user) return;

    setIsLoading(true);
    ShoutoutsAPI.getAllShoutouts()
      .then((allShoutouts) => {
        const mentions = allShoutouts.filter((shoutout) => {
          const firstName = user.firstName.toLowerCase();
          const lastName = user.lastName.toLowerCase();
          const fullName = `${firstName} ${lastName}`;
          const receiverLower = shoutout.receiver.toLowerCase();
          return (
            receiverLower.includes(firstName) ||
            receiverLower.includes(lastName) ||
            receiverLower.includes(fullName)
          );
        });

        setMentionShoutouts(mentions);
        setIsLoading(false);
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: `Couldn't get mention shoutouts!`,
          contentMsg: `Error was: ${error}`
        });
        setIsLoading(false);
      });
  }, [user]);

  useEffect(() => {
    getGivenShoutouts();
    getMentionShoutouts();
  }, [userEmail, getGivenShoutouts, getMentionShoutouts]);

  const displayedShoutouts = currentView === 'given' ? givenShoutouts : mentionShoutouts;
  const emptyMessage =
    currentView === 'given' ? 'Give someone a shoutout!' : 'No one has mentioned you yet!';

  return (
    <div>
      <div className={styles.shoutoutFormContainer}>
        <ShoutoutForm getGivenShoutouts={getGivenShoutouts} />
      </div>

      <div className={styles.shoutoutListContainer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>
            {currentView === 'given' ? 'Given Shoutouts' : 'Shoutouts Mentioning You'}
          </h2>
          <Button.Group>
            <Button active={currentView === 'given'} onClick={() => setCurrentView('given')}>
              Given
            </Button>
            <Button active={currentView === 'mentions'} onClick={() => setCurrentView('mentions')}>
              Mentions
            </Button>
          </Button.Group>
        </div>
        {isLoading ? (
          <Loader active inline="centered" />
        ) : displayedShoutouts.length > 0 ? (
          <ShoutoutList
            shoutouts={displayedShoutouts.sort((a, b) => a.timestamp - b.timestamp)}
            setGivenShoutouts={setGivenShoutouts}
          />
        ) : (
          <Message>{emptyMessage}</Message>
        )}
      </div>
    </div>
  );
};

export default ShoutoutsPage;
