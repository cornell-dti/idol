import { HTMLAttributes, ReactNode } from 'react';
import { useDesignSystemTheme } from '../Theme/Theme';
import styles from './Card.module.css';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'p';
  action?: ReactNode;
  direction?: 'column' | 'row';
};

export function Card({
  header,
  headingLevel: Heading = 'h2',
  action,
  direction = 'column',
  children,
  className = '',
  ...props
}: CardProps): JSX.Element {
  const layered = header != null || action != null;
  const parchment = useDesignSystemTheme() === 'fantasy' && !layered;
  const Container = layered ? 'section' : 'div';
  return (
    <Container
      {...props}
      className={`${styles.card} ${layered ? styles.layeredCard : ''} ${
        parchment ? styles.parchment : ''
      } ${className}`}
    >
      {layered && (
        <div className={styles.cardHeader}>
          {typeof header === 'string' ? (
            <Heading className={styles.cardTitle}>{header}</Heading>
          ) : (
            header
          )}
          {action}
        </div>
      )}
      <div className={`${styles.cardBody} ${direction === 'row' ? styles.cardRow : ''}`}>
        {children}
      </div>
    </Container>
  );
}
