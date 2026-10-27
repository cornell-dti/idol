import { forwardRef, ReactNode } from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import styles from './controls.module.css';

export type RadioProps = Omit<BaseRadio.Root.Props<string>, 'className' | 'children'> & {
  className?: string;
};
export const Radio = forwardRef<HTMLElement, RadioProps>(({ className = '', ...props }, ref) => (
  <BaseRadio.Root {...props} ref={ref} className={`${styles.radio} ${className}`}>
    <BaseRadio.Indicator className={styles.radioIndicator} />
  </BaseRadio.Root>
));

export type RadioGroupProps = Omit<BaseRadioGroup.Props<string>, 'className'> & {
  className?: string;
};
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className = '', ...props }, ref) => (
    <BaseRadioGroup {...props} ref={ref} className={`${styles.radioGroup} ${className}`} />
  )
);

export type LabelledRadioProps = RadioProps & { label: ReactNode };
export const LabelledRadio = forwardRef<HTMLElement, LabelledRadioProps>(
  ({ label, className = '', disabled, ...props }, ref) => (
    <label className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''} ${className}`}>
      <Radio {...props} ref={ref} disabled={disabled} />
      <span>{label}</span>
    </label>
  )
);
