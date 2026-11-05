import { useRef } from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { FieldShell, FieldProps } from '../FieldShell/FieldShell';
import { useDesignSystemAppearance } from '../Theme/Theme';
import { CaretDownIcon, CheckIcon } from '../../icons';
import styles from '../Select/Select.module.css';
import inputStyles from './Combobox.module.css';

export type ComboboxProps = FieldProps & {
  options: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
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
  ...field
}: ComboboxProps): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <FieldShell id={id} label={label} {...field}>
      <BaseCombobox.Root
        items={options}
        value={value || null}
        onValueChange={(next) => onValueChange(next ?? '')}
        itemToStringLabel={(item) => item || 'N/A'}
        required={required}
      >
        <div ref={anchor} className={styles.inputFrame}>
          <BaseCombobox.Input
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
              <BaseCombobox.Empty className={styles.selectOption}>
                No matches found.
              </BaseCombobox.Empty>
              <BaseCombobox.List>
                {(item: string) => (
                  <BaseCombobox.Item key={item} value={item} className={styles.selectOption}>
                    {item || 'N/A'}
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
