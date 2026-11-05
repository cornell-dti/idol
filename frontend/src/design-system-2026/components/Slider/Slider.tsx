import { InputHTMLAttributes } from 'react';
import styles from './Slider.module.css';

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  id: string;
  label: string;
};

export function Slider({ id, label, className = '', ...props }: SliderProps): JSX.Element {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input {...props} id={id} type="range" className={`${styles.slider} ${className}`} />
    </div>
  );
}
