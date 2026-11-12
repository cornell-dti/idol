import { KeyboardEvent, useRef, useState } from 'react';
import { Popover } from '@base-ui/react/popover';
import { FieldShell, FieldProps } from '../FieldShell/FieldShell';
import { useDesignSystemAppearance } from '../Theme/Theme';
import { CalendarBlankIcon, CaretDownIcon } from '../../icons';
import selectStyles from '../Select/Select.module.css';
import styles from './YearPicker.module.css';

const COLUMNS = 4;
const KEY_STEPS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -COLUMNS,
  ArrowDown: COLUMNS
};

export type YearPickerProps = FieldProps & {
  value: number | null;
  onValueChange: (year: number | null) => void;
  /** First year in the grid. */
  min: number;
  /** Last year in the grid. */
  max: number;
  /** Years shown in the grid but not selectable, e.g. to keep a range's start before its end. */
  isYearDisabled?: (year: number) => boolean;
  placeholder?: string;
  'aria-label'?: string;
};

const clamp = (year: number, min: number, max: number) => Math.min(max, Math.max(min, year));

/** Input-styled trigger that opens a grid of years; arrow keys move, Enter picks. */
export function YearPicker({
  id,
  label,
  value,
  onValueChange,
  min,
  max,
  isYearDisabled = () => false,
  placeholder = 'Any year',
  'aria-label': ariaLabel,
  ...field
}: YearPickerProps): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => clamp(value ?? max, min, max));
  const buttons = useRef(new Map<number, HTMLButtonElement>());
  const activeButton = useRef<HTMLButtonElement | null>(null);
  const years = Array.from({ length: Math.max(0, max - min + 1) }, (_, index) => min + index);
  const name = label ?? ariaLabel ?? 'Year';

  const openChange = (next: boolean) => {
    if (next) setActive(clamp(value ?? max, min, max));
    setOpen(next);
  };
  const pick = (year: number | null) => {
    onValueChange(year);
    setOpen(false);
  };
  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key in KEY_STEPS) next = active + KEY_STEPS[event.key];
    else if (event.key === 'Home') next = min;
    else if (event.key === 'End') next = max;
    if (next === null) return;
    event.preventDefault();
    next = clamp(next, min, max);
    setActive(next);
    buttons.current.get(next)?.focus();
  };

  return (
    <FieldShell id={id} label={label} {...field}>
      <Popover.Root open={open} onOpenChange={openChange}>
        <Popover.Trigger
          id={id}
          disabled={field.disabled}
          aria-label={`${name}: ${value ?? placeholder}`}
          className={`${selectStyles.inputFrame} ${selectStyles.selectTrigger} ${
            field.error || field.invalid ? selectStyles.invalid : ''
          } ${field.disabled ? selectStyles.disabled : ''}`}
        >
          <span className={selectStyles.iconSlot} aria-hidden="true">
            <CalendarBlankIcon size={16} />
          </span>
          <span
            className={selectStyles.selectValue}
            data-placeholder={value === null ? '' : undefined}
          >
            {value ?? placeholder}
          </span>
          <span className={selectStyles.iconSlot} aria-hidden="true">
            <CaretDownIcon size={16} />
          </span>
        </Popover.Trigger>
        <Popover.Portal data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
          <Popover.Positioner
            sideOffset={4}
            align="start"
            collisionPadding={8}
            className={selectStyles.selectPositioner}
          >
            <Popover.Popup
              initialFocus={activeButton}
              className={`${selectStyles.selectPopup} ${styles.popup}`}
            >
              <div role="listbox" aria-label={name} className={styles.grid} onKeyDown={move}>
                {years.map((year) => {
                  const disabled = isYearDisabled(year);
                  const isActive = year === active;
                  return (
                    <button
                      key={year}
                      ref={(element) => {
                        if (element) buttons.current.set(year, element);
                        else buttons.current.delete(year);
                        if (isActive) activeButton.current = element;
                      }}
                      type="button"
                      role="option"
                      aria-selected={year === value}
                      aria-disabled={disabled || undefined}
                      tabIndex={isActive ? 0 : -1}
                      className={styles.year}
                      onFocus={() => setActive(year)}
                      onClick={() => {
                        if (!disabled) pick(year);
                      }}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
              {value !== null && (
                <button type="button" className={styles.clear} onClick={() => pick(null)}>
                  Clear
                </button>
              )}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </FieldShell>
  );
}
