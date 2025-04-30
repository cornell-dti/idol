import React from 'react';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  value: number;
  total: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ value, total }) => (
  <div className={styles.progressBarContainer}>
    <label htmlFor="progress">
      <h4>My progress:</h4>
    </label>
    <div className={styles.progressBarWrapper}>
      <progress id="progress" max={total} value={value} className={styles.progressBar}>
        70%
      </progress>

      <div className={styles.annotation}>
        <p className="small">{value}</p>
        <p className="small">/</p>
        <p className="small">{total}</p>
      </div>
    </div>
  </div>
);

export default ProgressBar;
