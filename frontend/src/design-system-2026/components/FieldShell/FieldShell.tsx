import { ReactNode } from 'react';
import { Field } from '@base-ui/react/field';
import styles from './FieldShell.module.css';

export type FieldProps = {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  invalid?: boolean;
};
export function FieldShell({
  id,
  label,
  hint,
  error,
  disabled,
  invalid,
  children
}: FieldProps & { children: ReactNode }) {
  return (
    <Field.Root className={styles.field} disabled={disabled} invalid={Boolean(error) || invalid}>
      {label && (
        <Field.Label htmlFor={id} className={styles.fieldLabel}>
          {label}
        </Field.Label>
      )}
      {children}
      {hint && <Field.Description className={styles.hint}>{hint}</Field.Description>}
      {error && (
        <Field.Error match className={styles.errorMessage}>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
}
