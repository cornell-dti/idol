import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {
  Button,
  Card,
  Input,
  Modal,
  Tab,
  TabList,
  TabPanel,
  TabRoot
} from '../../design-system-2026/components';
import {
  FunnelSimpleIcon,
  ListBulletsIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MapTrifoldIcon,
  XIcon
} from '../../design-system-2026/icons';
import AlumniAPI from '../../API/AlumniAPI';
import CityCoordinatesAPI from '../../API/CityCoordinatesAPI';
import AlumniCard from './AlumniCard';
import AlumniFilterFields from './AlumniFilterFields';
import cityKey from './cityKey';
import {
  activeFilterCount,
  AlumniFilters,
  companyOptions,
  EMPTY_FILTERS,
  filterAlumni,
  gradYearBounds,
  sortAlumni
} from './alumniFilters';
import styles from './Alumni.module.css';

const AlumniMap = dynamic(() => import('./AlumniMap'), {
  ssr: false,
  loading: () => <div className={`${styles.mapSkeleton} idol-skeleton`} aria-hidden="true" />
});

type View = 'map' | 'list';
const PAGE_SIZE = 30;

export default function Alumni(): JSX.Element {
  const [alumni, setAlumni] = useState<readonly Alumni[]>([]);
  const [cities, setCities] = useState<readonly CityCoordinates[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<View>('map');
  const [filters, setFilters] = useState<AlumniFilters>(EMPTY_FILTERS);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shown, setShown] = useState(PAGE_SIZE);
  const request = useRef(0);

  const load = useCallback(async () => {
    request.current += 1;
    const version = request.current;
    setLoading(true);
    setError(false);
    try {
      const [nextAlumni, nextCities] = await Promise.all([
        AlumniAPI.getAllAlumni(),
        CityCoordinatesAPI.getAllCityCoordinates()
      ]);
      if (request.current !== version) return;
      setAlumni(sortAlumni(nextAlumni));
      setCities(nextCities);
    } catch {
      if (request.current === version) setError(true);
    } finally {
      if (request.current === version) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      request.current += 1;
    };
  }, [load]);

  const companies = useMemo(() => companyOptions(alumni), [alumni]);
  const years = useMemo(() => gradYearBounds(alumni), [alumni]);
  const filtered = useMemo(() => filterAlumni(alumni, filters), [alumni, filters]);

  // Pins count only alumni that match the filters, and cities with none are hidden.
  const cityCounts = useMemo(() => {
    const visible = new Set(filtered.map((alum) => alum.uuid));
    const counts = new Map<string, number>();
    cities.forEach((city) => {
      const count = city.alumniIds.filter((id) => visible.has(id)).length;
      if (count) counts.set(cityKey(city), count);
    });
    return counts;
  }, [cities, filtered]);
  const visibleCities = useMemo(
    () => cities.filter((city) => cityCounts.has(cityKey(city))),
    [cities, cityCounts]
  );
  const city = cities.find((item) => cityKey(item) === selectedCity) ?? null;
  useEffect(() => {
    if (selectedCity && !cityCounts.has(selectedCity)) setSelectedCity(null);
  }, [cityCounts, selectedCity]);

  const results = useMemo(() => {
    if (view !== 'map' || !city) return filtered;
    const ids = new Set(city.alumniIds);
    return filtered.filter((alum) => ids.has(alum.uuid));
  }, [filtered, view, city]);

  useEffect(() => setShown(PAGE_SIZE), [filters, selectedCity, view]);

  const activeCount = activeFilterCount(filters);
  const hasCriteria = activeCount > 0 || filters.query.trim() !== '';
  const clearFilters = () => setFilters((current) => ({ ...EMPTY_FILTERS, query: current.query }));
  const resetAll = () => {
    setFilters(EMPTY_FILTERS);
    setSelectedCity(null);
  };

  const filterFields = (idPrefix: string) => (
    <AlumniFilterFields
      idPrefix={idPrefix}
      filters={filters}
      onChange={setFilters}
      companies={companies}
      years={years}
    />
  );

  const resultList = () => {
    if (loading)
      return (
        <div className={styles.cardList} role="status" aria-label="Loading alumni">
          {[0, 1, 2].map((key) => (
            <div key={key} className={`${styles.cardSkeleton} idol-skeleton`} aria-hidden="true" />
          ))}
        </div>
      );
    if (error)
      return (
        <Card>
          <div className={styles.empty} role="alert">
            <h3>Couldn’t load alumni</h3>
            <p>Check your connection and try again.</p>
            <Button variant="secondary" onClick={load}>
              Try again
            </Button>
          </div>
        </Card>
      );
    if (!results.length)
      return (
        <Card>
          <div className={styles.empty} role="status">
            <h3>{alumni.length ? 'No alumni match' : 'No alumni yet'}</h3>
            <p>
              {alumni.length
                ? 'Try removing a filter or searching for something else.'
                : 'Alumni added by admins will appear here.'}
            </p>
            {hasCriteria && (
              <Button variant="secondary" onClick={resetAll}>
                Clear search and filters
              </Button>
            )}
          </div>
        </Card>
      );
    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- Safari needs this when list markers are hidden. */}
        <ul className={styles.cardList} role="list">
          {results.slice(0, shown).map((alum) => (
            <li key={alum.uuid}>
              <AlumniCard alum={alum} />
            </li>
          ))}
        </ul>
        {results.length > shown && (
          <Button
            variant="secondary"
            className={styles.showMore}
            onClick={() => setShown((current) => current + PAGE_SIZE)}
          >
            Show more ({results.length - shown} left)
          </Button>
        )}
      </>
    );
  };

  const summary = !loading && !error && (
    <div className={styles.summary}>
      <p role="status">
        {results.length === alumni.length
          ? `${alumni.length} alumni`
          : `Showing ${results.length} of ${alumni.length} alumni`}
      </p>
      {view === 'map' && city && (
        <Button
          variant="secondary"
          className={styles.cityChip}
          icon={<MapPinIcon size={14} />}
          aria-label={`Show alumni from every city instead of only ${city.locationName}`}
          onClick={() => setSelectedCity(null)}
        >
          {city.locationName}
          <XIcon size={14} aria-hidden="true" />
        </Button>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <Head>
        <title>Alumni · IDOL</title>
      </Head>
      <header className={styles.pageHeader}>
        <h1 className="idol-heading-1">Alumni</h1>
      </header>
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Alumni filters">
          <Card
            header="Filters"
            headingLevel="h2"
            action={
              activeCount > 0 && (
                <button type="button" className={styles.clearButton} onClick={clearFilters}>
                  Clear all
                </button>
              )
            }
          >
            {filterFields('alumni-filter')}
          </Card>
        </aside>
        <TabRoot
          className={styles.main}
          value={view}
          onValueChange={(next) => setView(next as View)}
        >
          <div className={styles.toolbar}>
            <TabList segmented aria-label="Alumni view">
              <Tab value="map" icon={<MapTrifoldIcon size={16} />}>
                Map
              </Tab>
              <Tab value="list" icon={<ListBulletsIcon size={16} />}>
                List
              </Tab>
            </TabList>
            <div className={styles.toolbarEnd}>
              <div className={styles.search}>
                <Input
                  id="alumni-search"
                  type="search"
                  aria-label="Search alumni"
                  placeholder="Search name, company, city…"
                  icon={<MagnifyingGlassIcon size={16} />}
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, query: event.target.value }))
                  }
                />
              </div>
              <Button
                variant="secondary"
                className={styles.filtersButton}
                icon={<FunnelSimpleIcon size={16} />}
                onClick={() => setFiltersOpen(true)}
              >
                Filters{activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
              </Button>
            </div>
          </div>
          <TabPanel value="map" className={styles.panel}>
            {!error && (
              <Card layered className={styles.mapCard}>
                {loading ? (
                  <div className={`${styles.mapSkeleton} idol-skeleton`} aria-hidden="true" />
                ) : (
                  <AlumniMap
                    cities={visibleCities}
                    counts={cityCounts}
                    selectedKey={selectedCity}
                    onSelectedKeyChange={setSelectedCity}
                  />
                )}
              </Card>
            )}
            {summary}
            {resultList()}
          </TabPanel>
          <TabPanel value="list" className={styles.panel}>
            {summary}
            {resultList()}
          </TabPanel>
        </TabRoot>
      </div>
      <Modal
        id="alumni-filters"
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title="Filters"
        footer={
          <>
            <Button variant="secondary" disabled={activeCount === 0} onClick={clearFilters}>
              Clear all
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} {filtered.length === 1 ? 'alum' : 'alumni'}
            </Button>
          </>
        }
      >
        {filterFields('alumni-filter-modal')}
      </Modal>
    </div>
  );
}
