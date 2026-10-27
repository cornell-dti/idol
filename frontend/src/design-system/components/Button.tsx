import { forwardRef, ReactNode } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import styles from './components.module.css';

export type ButtonProps = Omit<BaseButton.Props, 'className'> & { className?: string } & {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: ReactNode;
};

export const Button = forwardRef<HTMLElement, ButtonProps>(
  ({ variant = 'primary', icon, children, className = '', type = 'button', ...props }, ref) => (
    <BaseButton
      {...props}
      ref={ref}
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
    >
      {icon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </BaseButton>
  )
);

export type IconButtonProps = Omit<
  Omit<BaseButton.Props, 'className'> & { className?: string },
  'children'
> & {
  'aria-label': string;
  icon: ReactNode;
} & ({ variant?: 'primary' | 'secondary'; size?: 36 } | { variant: 'tertiary'; size?: 24 | 36 });

export const IconButton = forwardRef<HTMLElement, IconButtonProps>(
  ({ variant = 'secondary', size = 36, icon, className = '', type = 'button', ...props }, ref) => (
    <BaseButton
      {...props}
      ref={ref}
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles.iconButton} ${
        size === 24 ? styles.smallIconButton : ''
      } ${className}`}
    >
      <span className={styles.iconSlot} aria-hidden="true">
        {icon}
      </span>
    </BaseButton>
  )
);
