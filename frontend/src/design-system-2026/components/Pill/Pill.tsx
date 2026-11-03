import { HTMLAttributes } from 'react';
import styles from './Pill.module.css';

export type PillProps = HTMLAttributes<HTMLSpanElement> & {
  color?: 'accent' | 'red' | 'green';
};
export function Pill({
  color = 'accent',
  className = '',
  children,
  ...props
}: PillProps): JSX.Element {
  return (
    <span {...props} className={`${styles.pill} ${styles[color]} ${className}`}>
      {children}
    </span>
  );
}
