import { forwardRef, ReactNode, TextareaHTMLAttributes } from 'react';
import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { Select as BaseSelect } from '@base-ui/react/select';
import { CaretDownIcon, CheckIcon } from '../icons';
import { useDesignSystemTheme } from './Theme';
import styles from './components.module.css';

type FieldProps = {
  id: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  invalid?: boolean;
};
function FieldShell({
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
export type InputProps = Omit<BaseInput.Props, 'size' | 'className'> &
  FieldProps & {
    className?: string;
    size?: 'default' | 'large';
    shape?: 'default' | 'pill';
    icon?: ReactNode;
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
      <div
        className={`${styles.inputFrame} ${size === 'large' ? styles.largeInput : ''} ${
          shape === 'pill' ? styles.pillInput : ''
        } ${error || invalid ? styles.invalid : ''} ${disabled ? styles.disabled : ''}`}
      >
        {icon && (
          <span className={styles.iconSlot} aria-hidden="true">
            {icon}
          </span>
        )}
        <BaseInput
          {...props}
          ref={ref}
          id={id}
          disabled={disabled}
          className={`${styles.input} ${className}`}
        />
      </div>
    </FieldShell>
  )
);
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
