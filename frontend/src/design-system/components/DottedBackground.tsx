import { forwardRef, HTMLAttributes } from 'react';
import styles from './dotted-background.module.css';

export type DottedBackgroundProps = HTMLAttributes<HTMLDivElement>;

/** A repeating, theme-aware surface. Inherits tokens from DesignSystemScope. */
export const DottedBackground = forwardRef<HTMLDivElement, DottedBackgroundProps>(
  ({ className = '', ...props }, ref) => (
    <div {...props} ref={ref} className={`${styles.dottedBackground} ${className}`} />
  )
);
