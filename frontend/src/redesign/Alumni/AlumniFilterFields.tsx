import { MultiCombobox, YearPicker } from '../../design-system-2026/components';
import type { SelectOption } from '../../design-system-2026/components';
import { AlumniFilters, DTI_ROLE_OPTIONS, JOB_CATEGORY_OPTIONS } from './alumniFilters';
import styles from './Alumni.module.css';

type Props = {
  /** Keeps ids unique when the fields render in both the sidebar and the mobile modal. */
  readonly idPrefix: string;
  readonly filters: AlumniFilters;
  readonly onChange: (filters: AlumniFilters) => void;
  readonly companies: readonly SelectOption[];
  readonly years: { readonly min: number; readonly max: number };
};

export default function AlumniFilterFields({
  idPrefix,
  filters,
  onChange,
  companies,
  years
}: Props): JSX.Element {
  const set = (patch: Partial<AlumniFilters>) => onChange({ ...filters, ...patch });
  const { fromYear, toYear } = filters;
  return (
    <div className={styles.filterFields}>
      <MultiCombobox
        id={`${idPrefix}-career`}
        label="Career path"
        placeholder="Any career path"
        options={JOB_CATEGORY_OPTIONS}
        value={filters.jobCategories}
        onValueChange={(jobCategories) => set({ jobCategories })}
      />
      <MultiCombobox
        id={`${idPrefix}-company`}
        label="Company"
        placeholder="Any company"
        options={companies}
        value={filters.companies}
        onValueChange={(next) => set({ companies: next })}
      />
      <MultiCombobox
        id={`${idPrefix}-dti-role`}
        label="Role on DTI"
        placeholder="Any role"
        options={DTI_ROLE_OPTIONS}
        value={filters.dtiRoles}
        onValueChange={(dtiRoles) => set({ dtiRoles })}
      />
      <fieldset className={styles.yearRange}>
        <legend>Graduated</legend>
        <div className={styles.yearFields}>
          <YearPicker
            id={`${idPrefix}-from-year`}
            label="From"
            placeholder="Any"
            min={years.min}
            max={years.max}
            value={fromYear}
            isYearDisabled={(year) => toYear !== null && year > toYear}
            onValueChange={(next) => set({ fromYear: next })}
          />
          <YearPicker
            id={`${idPrefix}-to-year`}
            label="To"
            placeholder="Any"
            min={years.min}
            max={years.max}
            value={toYear}
            isYearDisabled={(year) => fromYear !== null && year < fromYear}
            onValueChange={(next) => set({ toYear: next })}
          />
        </div>
      </fieldset>
    </div>
  );
}
