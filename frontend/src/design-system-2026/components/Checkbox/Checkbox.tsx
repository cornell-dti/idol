import { forwardRef, ReactNode } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckIcon } from '../../icons';
import styles from './Checkbox.module.css';

export type CheckboxProps = Omit<BaseCheckbox.Root.Props, 'className' | 'children'> & {
  className?: string;
};
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(
  ({ className = '', ...props }, ref) => (
    <BaseCheckbox.Root {...props} ref={ref} className={`${styles.checkbox} ${className}`}>
      <BaseCheckbox.Indicator className={styles.checkIndicator}>
        <CheckIcon size={12} aria-hidden="true" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
);
export type LabelledCheckboxProps = CheckboxProps & { label: ReactNode };
export const LabelledCheckbox = forwardRef<HTMLElement, LabelledCheckboxProps>(
  ({ label, className = '', disabled, ...props }, ref) => (
    <label className={`${styles.label} ${disabled ? styles.disabled : ''} ${className}`}>
      <Checkbox {...props} ref={ref} disabled={disabled} />
      <span>{label}</span>
    </label>
  )
);
