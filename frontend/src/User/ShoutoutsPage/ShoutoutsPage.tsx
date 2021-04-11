import React from 'react';
import ShoutoutForm from './ShoutoutForm/ShoutoutForm';
import ShoutoutList from './ShoutoutList/ShoutoutList';
import styles from './ShoutoutsPage.module.css';

export type Shoutout = {
  shoutoutGiverEmail: string;
  shoutoutRecipientEmail: string;
  message: string;
};

const ShoutoutsPage: React.FC = () => (
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
        <ShoutoutList
          shoutouts={undefined}
          emptyMessage="Give someone a shoutout!"
        />
      </div>
      <div className={styles.listContainer}>
        <h2 className={styles.shoutoutTitle}>Received Shoutouts</h2>
        <ShoutoutList
          shoutouts={undefined}
          emptyMessage="You currently have no shoutouts."
        />
      </div>
    </div>
  </div>
);

export default ShoutoutsPage;
