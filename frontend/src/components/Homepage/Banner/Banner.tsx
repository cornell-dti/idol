import React from 'react';
import { Message } from 'semantic-ui-react';
import styles from './Banner.module.css';

const Banner: React.FC<{
  title: string;
  message: string;
  style?: React.CSSProperties;
}> = ({ title, message, style }) => (
  <div className={styles.messageBanner} style={style}>
    <Message info className={styles.messageBannerContent}>
      <Message.Header>{title}</Message.Header>
      <p>{message}</p>
    </Message>
  </div>
);

export default Banner;
