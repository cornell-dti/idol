import { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  action?: ReactNode;
  direction?: 'column' | 'row';
};

export function Card({
  header,
  action,
  direction = 'column',
  children,
  className = '',
  ...props
}: CardProps): JSX.Element {
  const layered = header != null || action != null;
  return (
    <div {...props} className={`${styles.card} ${layered ? styles.layeredCard : ''} ${className}`}>
      {layered && (
        <div className={styles.cardHeader}>
          <div>{header}</div>
          {action}
        </div>
      )}
      <div className={`${styles.cardBody} ${direction === 'row' ? styles.cardRow : ''}`}>
        {children}
      </div>
    </div>
  );
}
