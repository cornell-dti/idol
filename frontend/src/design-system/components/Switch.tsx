import { forwardRef, ReactNode } from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import styles from './controls.module.css';

export type SwitchProps = Omit<BaseSwitch.Root.Props, 'className' | 'children'> & {
  className?: string;
};
export const Switch = forwardRef<HTMLElement, SwitchProps>(({ className = '', ...props }, ref) => (
  <BaseSwitch.Root {...props} ref={ref} className={`${styles.switch} ${className}`}>
    <BaseSwitch.Thumb className={styles.switchThumb} />
  </BaseSwitch.Root>
));

export type LabelledSwitchProps = SwitchProps & { label: ReactNode };
export const LabelledSwitch = forwardRef<HTMLElement, LabelledSwitchProps>(
  ({ label, className = '', disabled, ...props }, ref) => (
    <label className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''} ${className}`}>
      <Switch {...props} ref={ref} disabled={disabled} />
      <span>{label}</span>
    </label>
  )
);
