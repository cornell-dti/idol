import { ReactNode, useRef } from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { FieldShell, FieldProps } from '../FieldShell/FieldShell';
import { useDesignSystemAppearance } from '../Theme/Theme';
import { CaretDownIcon, CheckIcon, XIcon } from '../../icons';
import type { SelectOption } from '../Select/Select';
import styles from '../Select/Select.module.css';
import inputStyles from './Combobox.module.css';

export type ComboboxProps = FieldProps & {
  options: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  /** Custom content for an option row; the option string is still what's searched and selected. */
  renderOption?: (option: string) => ReactNode;
};

/** Searchable counterpart to Select; only values from the supplied options can be selected. */
export function Combobox({
  id,
  label,
  options,
  value,
  onValueChange,
  placeholder,
  required,
  renderOption,
  ...field
}: ComboboxProps): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  const anchor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  return (
    <FieldShell id={id} label={label} {...field}>
      <BaseCombobox.Root
        items={options}
        value={value || null}
        onValueChange={(next) => onValueChange(next ?? '')}
        itemToStringLabel={(item) => item || 'N/A'}
        required={required}
        disabled={field.disabled}
      >
        <div
          ref={anchor}
          className={styles.inputFrame}
          onPointerDown={(event) => {
            if (field.disabled || event.button !== 0) return;
            if ((event.target as HTMLElement).closest('input, button')) return;
            event.preventDefault();
            input.current?.focus();
          }}
        >
          <BaseCombobox.Input
            ref={input}
            id={id}
            placeholder={placeholder}
            className={inputStyles.input}
            aria-required={required}
          />
          <BaseCombobox.Trigger
            aria-label={`Show ${label?.toLowerCase()} options`}
            className={inputStyles.trigger}
          >
            <CaretDownIcon size={16} aria-hidden="true" />
          </BaseCombobox.Trigger>
        </div>
        <BaseCombobox.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
          <BaseCombobox.Positioner
            anchor={anchor}
            sideOffset={4}
            className={styles.selectPositioner}
          >
            <BaseCombobox.Popup className={styles.selectPopup}>
              <BaseCombobox.Empty>
                <span className={inputStyles.emptyMessage}>No matches found.</span>
              </BaseCombobox.Empty>
              <BaseCombobox.List>
                {(item: string) => (
                  <BaseCombobox.Item key={item} value={item} className={styles.selectOption}>
                    {renderOption ? renderOption(item) : item || 'N/A'}
                    <BaseCombobox.ItemIndicator className={styles.selectCheck}>
                      <CheckIcon size={12} />
                    </BaseCombobox.ItemIndicator>
                  </BaseCombobox.Item>
                )}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </FieldShell>
  );
}

export type MultiComboboxProps = FieldProps & {
  options: readonly SelectOption[];
  value: readonly string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
};

/**
 * Multi-select Combobox. Selected options render as removable chips inside the field;
 * Backspace removes the last chip, and the popup stays open while picking.
 */
export function MultiCombobox({
  id,
  label,
  options,
  value,
  onValueChange,
  placeholder,
  ...field
}: MultiComboboxProps): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  const anchor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const selected = options.filter((option) => value.includes(option.value));
  return (
    <FieldShell id={id} label={label} {...field}>
      <BaseCombobox.Root
        multiple
        items={options}
        value={selected}
        onValueChange={(next) => onValueChange(next.map((option) => option.value))}
        itemToStringLabel={(option) => option.label}
        isItemEqualToValue={(option, other) => option.value === other.value}
        disabled={field.disabled}
      >
        <BaseCombobox.Chips
          ref={anchor}
          className={`${styles.inputFrame} ${inputStyles.chipsFrame} ${
            field.error || field.invalid ? styles.invalid : ''
          } ${field.disabled ? styles.disabled : ''}`}
          onPointerDown={(event) => {
            if (field.disabled || event.button !== 0) return;
            if ((event.target as HTMLElement).closest('input, button, [data-chip]')) return;
            event.preventDefault();
            input.current?.focus();
          }}
        >
          {selected.map((option) => (
            <BaseCombobox.Chip
              key={option.value}
              data-chip
              className={inputStyles.chip}
              aria-label={option.label}
            >
              <span className={inputStyles.chipLabel}>{option.label}</span>
              <BaseCombobox.ChipRemove
                className={inputStyles.chipRemove}
                aria-label={`Remove ${option.label}`}
              >
                <XIcon size={10} weight="bold" aria-hidden="true" />
              </BaseCombobox.ChipRemove>
            </BaseCombobox.Chip>
          ))}
          <BaseCombobox.Input
            ref={input}
            id={id}
            placeholder={selected.length ? '' : placeholder}
            className={`${inputStyles.input} ${inputStyles.chipsInput}`}
          />
          <BaseCombobox.Trigger
            aria-label={`Show ${label?.toLowerCase() ?? 'all'} options`}
            className={`${inputStyles.trigger} ${inputStyles.chipsTrigger}`}
          >
            <CaretDownIcon size={16} aria-hidden="true" />
          </BaseCombobox.Trigger>
        </BaseCombobox.Chips>
        <BaseCombobox.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
          <BaseCombobox.Positioner
            anchor={anchor}
            sideOffset={4}
            className={styles.selectPositioner}
          >
            <BaseCombobox.Popup className={styles.selectPopup}>
              <BaseCombobox.Empty>
                <span className={inputStyles.emptyMessage}>No matches found.</span>
              </BaseCombobox.Empty>
              <BaseCombobox.List>
                {(option: SelectOption) => (
                  <BaseCombobox.Item
                    key={option.value}
                    value={option}
                    disabled={option.disabled}
                    className={styles.selectOption}
                  >
                    {option.label}
                    <BaseCombobox.ItemIndicator className={styles.selectCheck}>
                      <CheckIcon size={12} />
                    </BaseCombobox.ItemIndicator>
                  </BaseCombobox.Item>
                )}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </FieldShell>
  );
}
