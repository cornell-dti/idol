import { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'p';
  action?: ReactNode;
  direction?: 'column' | 'row';
  /** Layered surface without a header strip. Implied when `header` or `action` is set. */
  layered?: boolean;
  /** `compact` tightens body padding for small, dense cards. */
  size?: 'default' | 'compact';
};

export function Card({
  header,
  headingLevel: Heading = 'h2',
  action,
  direction = 'column',
  layered: layeredProp = false,
  size = 'default',
  children,
  className = '',
  ...props
}: CardProps): JSX.Element {
  const hasHeader = header != null || action != null;
  const layered = layeredProp || hasHeader;
  const Container = hasHeader ? 'section' : 'div';
  return (
    <Container
      {...props}
      className={`${styles.card} ${layered ? styles.layeredCard : ''} ${
        layered && !hasHeader ? styles.layeredBare : ''
      } ${size === 'compact' ? styles.compact : ''} ${className}`}
    >
      {hasHeader && (
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
