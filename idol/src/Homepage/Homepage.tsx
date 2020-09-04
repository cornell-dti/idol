import React from 'react';
import styles from './Homepage.module.css';
import { MembersAPI } from '../API/MembersAPI';

const Homepage: React.FC = () => {
  MembersAPI.getAllMembers().then(mems => console.log(mems));
  return (
    <div className={styles.Homepage} data-testid="Homepage">

    </div>
  )
};

export default Homepage;
