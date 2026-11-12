import { forwardRef, ReactNode } from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { FieldShell, FieldProps } from '../FieldShell/FieldShell';
import styles from './Input.module.css';

export type InputProps = Omit<BaseInput.Props, 'size' | 'className'> &
  FieldProps & {
    className?: string;
    size?: 'default' | 'large';
    shape?: 'default' | 'pill';
    icon?: ReactNode;
    prefix?: string;
    endAdornment?: ReactNode;
  };
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      hint,
      error,
      disabled,
      invalid,
      size = 'default',
      shape = 'default',
      icon,
      prefix,
      endAdornment,
      className = '',
      ...props
    },
    ref
  ) => (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      disabled={disabled}
      invalid={invalid}
    >
      <label
        htmlFor={id}
        className={`${styles.inputFrame} ${size === 'large' ? styles.largeInput : ''} ${
          shape === 'pill' ? styles.pillInput : ''
        } ${error || invalid ? styles.invalid : ''} ${disabled ? styles.disabled : ''}`}
      >
        {icon && (
          <span className={styles.iconSlot} aria-hidden="true">
            {icon}
          </span>
        )}
        {prefix && (
          <span className={styles.prefix} aria-hidden="true">
            {prefix}
          </span>
        )}
        <BaseInput
          {...props}
          ref={ref}
          id={id}
          disabled={disabled}
          className={`${styles.input} ${className}`}
        />
        {endAdornment}
      </label>
    </FieldShell>
  )
);
