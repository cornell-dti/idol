import type { SelectOption } from '../../design-system-2026/components';

export type AlumniFilters = {
  readonly query: string;
  readonly jobCategories: readonly string[];
  readonly companies: readonly string[];
  readonly dtiRoles: readonly string[];
  readonly fromYear: number | null;
  readonly toYear: number | null;
};

export const EMPTY_FILTERS: AlumniFilters = {
  query: '',
  jobCategories: [],
  companies: [],
  dtiRoles: [],
  fromYear: null,
  toYear: null
};

const JOB_CATEGORIES: readonly AlumJobCategory[] = [
  'Technology',
  'Product Management',
  'Business',
  'Product Design',
  'Entrepreneurship',
  'Grad Student',
  'Other'
];
export const JOB_CATEGORY_OPTIONS: readonly SelectOption[] = JOB_CATEGORIES.map((value) => ({
  value,
  label: value
}));

export const DTI_ROLE_LABELS: Record<AlumDtiRole, string> = {
  Dev: 'Development',
  Product: 'Product',
  Business: 'Business',
  Design: 'Design',
  Lead: 'Lead'
};
export const DTI_ROLE_OPTIONS: readonly SelectOption[] = Object.entries(DTI_ROLE_LABELS).map(
  ([value, label]) => ({ value, label })
);

/** Earliest graduating class shown when no alum has an earlier one. */
const DEFAULT_FIRST_CLASS = 2014;

export const fullName = (alum: Alumni): string => `${alum.firstName} ${alum.lastName}`.trim();

const companyKey = (company?: string | null): string => company?.trim().toLowerCase() ?? '';

/**
 * Companies alumni work at for the Company filter. Spellings that differ only in case or
 * spacing are merged; the value is the normalized key and the label the first spelling seen.
 */
export function companyOptions(alumni: readonly Alumni[]): SelectOption[] {
  const companies = new Map<string, string>();
  alumni.forEach((alum) => {
    const key = companyKey(alum.company);
    if (key && !companies.has(key)) companies.set(key, alum.company?.trim() ?? key);
  });
  return Array.from(companies, ([value, label]) => ({ value, label })).sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
  );
}

/** Year range for the "Graduated" pickers, wide enough to include every alum. */
export function gradYearBounds(
  alumni: readonly Alumni[],
  currentYear = new Date().getFullYear()
): { min: number; max: number } {
  const years = alumni
    .map((alum) => alum.gradYear)
    .filter((year): year is number => typeof year === 'number');
  return {
    min: Math.min(DEFAULT_FIRST_CLASS, ...years),
    max: Math.max(currentYear, ...years)
  };
}

/** Number of filters set in the sidebar (search is not counted). */
export function activeFilterCount(filters: AlumniFilters): number {
  return (
    filters.jobCategories.length +
    filters.companies.length +
    filters.dtiRoles.length +
    (filters.fromYear !== null || filters.toYear !== null ? 1 : 0)
  );
}

const searchText = (alum: Alumni): string =>
  [
    fullName(alum),
    alum.company,
    alum.jobRole,
    alum.jobCategory,
    alum.location,
    ...(alum.subteams ?? []),
    ...(alum.dtiRoles ?? []).map((role) => DTI_ROLE_LABELS[role] ?? role)
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const hasYearRange = (filters: AlumniFilters) =>
  filters.fromYear !== null || filters.toYear !== null;

/**
 * Applies search and sidebar filters. Every search word must match some field, so
 * "google new york" finds Google alumni based in New York. While a year range is set, alumni
 * without a graduation year can't be placed in it, so they're left out here and listed
 * separately by `alumniWithoutYear`.
 */
export function filterAlumni(alumni: readonly Alumni[], filters: AlumniFilters): Alumni[] {
  const terms = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
  const { jobCategories, companies, dtiRoles, fromYear, toYear } = filters;
  return alumni.filter((alum) => {
    if (terms.length) {
      const text = searchText(alum);
      if (!terms.every((term) => text.includes(term))) return false;
    }
    if (jobCategories.length && !jobCategories.includes(alum.jobCategory)) return false;
    if (companies.length && !companies.includes(companyKey(alum.company))) return false;
    if (dtiRoles.length && !alum.dtiRoles?.some((role) => dtiRoles.includes(role))) return false;
    if (hasYearRange(filters)) {
      if (typeof alum.gradYear !== 'number') return false;
      if (fromYear !== null && alum.gradYear < fromYear) return false;
      if (toYear !== null && alum.gradYear > toYear) return false;
    }
    return true;
  });
}

/**
 * Alumni with no graduation year who match every filter except the year range. Empty when no
 * range is set, since `filterAlumni` already includes them then.
 */
export function alumniWithoutYear(alumni: readonly Alumni[], filters: AlumniFilters): Alumni[] {
  if (!hasYearRange(filters)) return [];
  return filterAlumni(alumni, { ...filters, fromYear: null, toYear: null }).filter(
    (alum) => typeof alum.gradYear !== 'number'
  );
}

export const sortAlumni = (alumni: readonly Alumni[]): Alumni[] =>
  alumni
    .slice()
    .sort(
      (a, b) =>
        a.firstName.localeCompare(b.firstName, undefined, { sensitivity: 'base' }) ||
        a.lastName.localeCompare(b.lastName, undefined, { sensitivity: 'base' })
    );
