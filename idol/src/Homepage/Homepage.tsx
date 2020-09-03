import React from 'react';
import styles from './Homepage.module.css';
import { Button } from 'semantic-ui-react';
import { auth } from '../firebase';

const Homepage: React.FC = () => {
  return (
    <div className={styles.Homepage} data-testid="Homepage">

    </div>
  )
};

export default Homepage;
