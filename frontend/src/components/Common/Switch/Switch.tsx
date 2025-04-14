import React from 'react';
import styles from './Switch.module.css';

type SwitchProps = {
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
};

const Switch = ({ checked, onChange, label, className = '' }: SwitchProps) => (
  <label className={`${styles.switchWrapper} ${className}`}>
    <div className={styles.switch}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.slider} />
      <span className={styles.focusState} />
    </div>
    <p className={styles.labelText}>{label}</p>
  </label>
);

export default Switch;
