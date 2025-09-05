import React from 'react';
import styles from './Selector.module.css';

export interface RatingOptions {
  value: number;
  text: string;
  color: 'red' | 'orange' | 'yellow' | 'lightgreen' | 'green' | 'teal' | 'gray';
}

interface SelectorProps {
  selected: number;
  onChange: (value: number) => void;
  ratings: RatingOptions[];
}

const Selector: React.FC<SelectorProps> = ({ selected, onChange, ratings }) => (
  <div className={styles.selectorContainer}>
    {ratings.map(({ value, text, color }) => {
      const isSelected = selected === value;

      const baseClass = styles[color];
      const selectedClass = isSelected ? `${styles.selected} ${styles[`${color}Selected`]}` : '';

      return (
        <>
          <label key={value} className={`${styles.option} ${baseClass} ${selectedClass}`}>
            <input
              type="radio"
              name="rating"
              value={value}
              checked={isSelected}
              onChange={() => onChange(value)}
              className={styles.hiddenInput}
            />
            {text}
            <div className={styles.focusState} />
          </label>
        </>
      );
    })}
  </div>
);

export default Selector;
