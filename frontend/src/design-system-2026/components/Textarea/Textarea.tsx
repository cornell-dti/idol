import { forwardRef, TextareaHTMLAttributes } from 'react';
import { Field } from '@base-ui/react/field';
import { FieldShell, FieldProps } from '../FieldShell/FieldShell';
import styles from './Textarea.module.css';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps;
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { id, label, hint, error, disabled, invalid, className = '', value, defaultValue, ...props },
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
      <Field.Control
        ref={ref}
        id={id}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        render={<textarea {...props} />}
        className={`${styles.inputFrame} ${styles.textarea} ${
          error || invalid ? styles.invalid : ''
        } ${className}`}
      />
    </FieldShell>
  )
);
