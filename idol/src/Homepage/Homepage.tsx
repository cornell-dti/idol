import React from 'react';
import styles from './Homepage.module.css';
import Spotlight from './Spotlight/Spotlight';
import Banner from '../Banner/Banner';

const Homepage: React.FC = () => {
  return (
    <div className={styles.Homepage} data-testid="Homepage">
      <div className={styles.content}>
        <Banner title="Welcome to IDOL!"
          message="IDOL is the new internal DTI oragnization management tool!"
          style={{ marginBottom: '2rem' }}>
        </Banner>
        <Spotlight></Spotlight>
      </div>
    </div>
  )
};

export default Homepage;
