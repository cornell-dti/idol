import React from 'react';
import { Card } from 'semantic-ui-react';
import styles from './Homepage.module.css';
import Spotlight from './Spotlight';
import Banner from './Banner';
import ShoutoutForm from '../Forms/ShoutoutsPage/ShoutoutForm';

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
            <ShoutoutForm></ShoutoutForm>
          </Card.Content>
        </Card>
      </div>
    </div>
  </div>
);

export default Homepage;
