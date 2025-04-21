import React from 'react';
import styles from './Selector.module.css';

export interface Rating {
  value: number;
  text: string;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'darkgreen' | 'grey';
}

interface SelectorProps {
  selected: number;
  onChange: (value: number) => void;
  ratings: Rating[];
}

const Selector: React.FC<SelectorProps> = ({ selected, onChange, ratings }) => (
  <div className={styles.selectorContainer}>
    {ratings.map(({ value, text, color }) => {
      const isSelected = selected === value;

      const baseClass = styles[color];
      const selectedClass = isSelected ? `${styles.selected} ${styles[`${color}Selected`]}` : '';

      return (
        <button
          key={value}
          className={`${styles.option} ${baseClass} ${selectedClass}`}
          onClick={() => onChange(value)}
        >
          {text}
        </button>
      );
    })}
  </div>
);

export default Selector;
