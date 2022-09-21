import React from 'react';
import { Card } from 'semantic-ui-react';
import styles from './Homepage.module.css';
import ShoutoutForm from '../../Forms/ShoutoutsPage/ShoutoutForm';
import Banner from '../Banner/Banner';
import Spotlight from '../Spotlight/Spotlight';

const Homepage: React.FC = () => (
  <div className={styles.Homepage} data-testid="Homepage">
    <div className={styles.content}>
      <Banner
        title="Welcome to IDOL!"
        message="IDOL is the new internal DTI organization management tool!"
        style={{ marginBottom: '2rem' }}
      ></Banner>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Spotlight></Spotlight>
        <Card style={{ width: '50%', display: 'flex', justfiyContent: 'center' }} size="medium">
          <Card.Content style={{ height: '100%' }}>
            <ShoutoutForm getGivenShoutouts={() => undefined} />
          </Card.Content>
        </Card>
      </div>
    </div>
  </div>
);

export default Homepage;
