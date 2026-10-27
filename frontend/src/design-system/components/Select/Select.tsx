import { forwardRef, ReactNode } from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { CaretDownIcon, CheckIcon } from '../../icons';
import { useDesignSystemTheme } from '../Theme/Theme';
import { FieldShell, FieldProps } from '../FieldShell/FieldShell';
import styles from './Select.module.css';

export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectProps = Omit<BaseSelect.Root.Props<string>, 'children' | 'items' | 'multiple'> &
  FieldProps & {
    options: readonly SelectOption[];
    icon?: ReactNode;
    placeholder?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    className?: string;
  };
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      label,
      hint,
      error,
      invalid,
      disabled,
      options,
      icon,
      placeholder = 'Select an option',
      className = '',
      'aria-label': ariaLabel,
      'aria-describedby': describedBy,
      ...props
    },
    ref
  ) => {
    const theme = useDesignSystemTheme();
    return (
      <FieldShell
        id={id}
        label={label}
        hint={hint}
        error={error}
        disabled={disabled}
        invalid={invalid}
      >
        <BaseSelect.Root {...props} id={id} disabled={disabled} items={options}>
          <BaseSelect.Trigger
            ref={ref}
            aria-label={ariaLabel}
            aria-describedby={describedBy}
            className={`${styles.inputFrame} ${styles.selectTrigger} ${
              error || invalid ? styles.invalid : ''
            } ${disabled ? styles.disabled : ''} ${className}`}
          >
            {icon && (
              <span className={styles.iconSlot} aria-hidden="true">
                {icon}
              </span>
            )}
            <BaseSelect.Value className={styles.selectValue} placeholder={placeholder} />
            <BaseSelect.Icon className={styles.iconSlot}>
              <CaretDownIcon size={16} aria-hidden="true" />
            </BaseSelect.Icon>
          </BaseSelect.Trigger>
          <BaseSelect.Portal data-idol-redesign data-idol-theme={theme}>
            <BaseSelect.Positioner
              sideOffset={4}
              alignItemWithTrigger={false}
              className={styles.selectPositioner}
            >
              <BaseSelect.Popup className={styles.selectPopup}>
                <BaseSelect.List>
                  {options.map((option) => (
                    <BaseSelect.Item
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      className={styles.selectOption}
                    >
                      <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                      <BaseSelect.ItemIndicator className={styles.selectCheck}>
                        <CheckIcon size={12} aria-hidden="true" />
                      </BaseSelect.ItemIndicator>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </BaseSelect.Portal>
        </BaseSelect.Root>
      </FieldShell>
    );
  }
);
