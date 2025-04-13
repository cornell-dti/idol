import React from 'react';
import styles from './Switch.module.css';

type SwitchProps = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
};

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, className }) => {
  return (
    <label className={`${styles.switchWrapper} ${className}`}>
      <div className={styles.switch} onClick={onChange}>
        <div className={`${styles.thumb} ${checked ? styles.checked : ''}`} />
      </div>
      <span className={styles.label}>{label}</span>
    </label>
  );
};

export default Switch;
