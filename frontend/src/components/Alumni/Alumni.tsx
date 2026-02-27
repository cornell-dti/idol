import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Container, Header, Input, Dropdown, Icon, Loader } from 'semantic-ui-react';
import { Emitters } from '../../utils';
import AlumniAPI from '../../API/AlumniAPI';
import CityCoordinatesAPI from '../../API/CityCoordinatesAPI';
import AlumniCard from './AlumniCard';
import styles from './Alumni.module.css';

const AlumniMap = dynamic(() => import('./AlumniMap'), { ssr: false });

type ViewMode = 'list' | 'map';

const DEFAULT_MIN_YEAR = 2014;
const DEFAULT_MAX_YEAR = new Date().getFullYear();

const Alumni: React.FC = () => {
  const [alumni, setAlumni] = useState<readonly Alumni[]>([]);
  const [allCityCoordinates, setAllCityCoordinates] = useState<readonly CityCoordinates[]>([]);
  const [selectedCityCoordinates, setSelectedCityCoordinates] = useState<readonly CityCoordinates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedJobCategories, setSelectedJobCategories] = useState<string[]>([]);
  const [selectedDtiRoles, setSelectedDtiRoles] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [gradYearRange, setGradYearRange] = useState<[number, number]>([
    DEFAULT_MIN_YEAR,
    DEFAULT_MAX_YEAR
  ]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([AlumniAPI.getAllAlumni(), CityCoordinatesAPI.getAllCityCoordinates()])
      .then(([alumniData, cityCoordinatesData]) => {
        setAlumni(alumniData);
        setAllCityCoordinates(cityCoordinatesData);
        setIsLoading(false);
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't load alumni data!",
          contentMsg: `Error was: ${error}`
        });
        setIsLoading(false);
      });
  }, []);

  const filteredAlumni = useMemo(
    () =>
      alumni.filter((alum) => {
        // Filters based on search input (users can search for any alum field)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const searchableText =
            `${alum.firstName} ${alum.lastName} ${alum.company || ''} ${alum.jobRole} ${alum.location || ''}`.toLowerCase();
          if (!searchableText.includes(query)) return false;
        }

        if (selectedJobCategories.length > 0 && !selectedJobCategories.includes(alum.jobCategory)) {
          return false;
        }

        if (selectedDtiRoles.length > 0) {
          const hasMatchingRole = alum.dtiRoles?.some((role) => selectedDtiRoles.includes(role));
          if (!hasMatchingRole) return false;
        }

        if (
          selectedCompanies.length > 0 &&
          (!alum.company || !selectedCompanies.includes(alum.company))
        ) {
          return false;
        }

        if (alum.gradYear) {
          if (alum.gradYear < gradYearRange[0] || alum.gradYear > gradYearRange[1]) {
            return false;
          }
        }

        return true;
      }),
    [alumni, searchQuery, selectedJobCategories, selectedDtiRoles, selectedCompanies, gradYearRange]
  );

  // Compute visible city coordinates based on filtered alumni
  const visibleCityCoordinates = useMemo(() => {
    const alumniUuidSet = new Set(filteredAlumni.map((alum) => alum.uuid));
    return allCityCoordinates.filter((city) =>
      city.alumniIds.some((alumniId) => alumniUuidSet.has(alumniId))
    );
  }, [allCityCoordinates, filteredAlumni]);

  // Filter alumni by selected city coordinates
  const finalFilteredAlumni = useMemo(() => {
    if (selectedCityCoordinates.length === 0) {
      return filteredAlumni;
    }
    const selectedAlumniIds = new Set(
      selectedCityCoordinates.flatMap((city) => city.alumniIds)
    );
    return filteredAlumni.filter((alum) => selectedAlumniIds.has(alum.uuid));
  }, [filteredAlumni, selectedCityCoordinates]);

  const handleCitySelect = (city: CityCoordinates) => {
    setSelectedCityCoordinates([city]);
  };

  const handleCityDeselect = () => {
    setSelectedCityCoordinates([]);
  };

  const jobCategoryOptions: { key: string; text: string; value: string }[] = [
    { key: 'technology', text: 'Technology', value: 'Technology' },
    { key: 'product-management', text: 'Product Management', value: 'Product Management' },
    { key: 'business', text: 'Business', value: 'Business' },
    { key: 'product-design', text: 'Product Design', value: 'Product Design' },
    { key: 'entrepreneurship', text: 'Entrepreneurship', value: 'Entrepreneurship' },
    { key: 'grad-student', text: 'Grad Student', value: 'Grad Student' },
    { key: 'other', text: 'Other', value: 'Other' }
  ];

  const dtiRoleOptions: { key: string; text: string; value: string }[] = [
    { key: 'dev', text: 'Development', value: 'Dev' },
    { key: 'product', text: 'Product', value: 'Product' },
    { key: 'business', text: 'Business', value: 'Business' },
    { key: 'design', text: 'Design', value: 'Design' },
    { key: 'lead', text: 'Lead', value: 'Lead' }
  ];

  const companyOptions = useMemo(() => {
    // Dynamic filter based off of companies of existing alumni
    const companies = Array.from(new Set(alumni.map((a) => a.company).filter(Boolean) as string[]));
    return companies.map((company) => ({
      key: company,
      text: company,
      value: company
    }));
  }, [alumni]);

  return (
    <Container className={styles.container}>
      <Header as="h1" className={styles.header}>
        Alumni Database
      </Header>

      <div className={styles.topBar}>
        <div className={styles.topBarSpacer}></div>
        <div className={styles.searchContainer}>
          <Input
            className={styles.searchInput}
            placeholder="Search by keywords"
            icon="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Map view"
            >
              <Icon name="map" />
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <Icon name="list" />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.filtersSidebar}>
          <div className={styles.appliedFilters}>
            <Header as="h3" className={styles.filterHeader}>
              Applied Filters
            </Header>
          </div>

          <div className={styles.filterSection}>
            <Dropdown
              placeholder="Company Role"
              fluid
              multiple
              selection
              search
              closeOnChange
              options={jobCategoryOptions}
              value={selectedJobCategories}
              onChange={(_, data) => setSelectedJobCategories(data.value as string[])}
            />
          </div>

          <div className={styles.filterSection}>
            <Dropdown
              placeholder="Company"
              fluid
              multiple
              selection
              search
              closeOnChange
              options={companyOptions}
              value={selectedCompanies}
              onChange={(_, data) => setSelectedCompanies(data.value as string[])}
            />
          </div>

          <div className={styles.filterSection}>
            <Dropdown
              placeholder="Role on DTI"
              fluid
              multiple
              selection
              search
              closeOnChange
              options={dtiRoleOptions}
              value={selectedDtiRoles}
              onChange={(_, data) => setSelectedDtiRoles(data.value as string[])}
            />
          </div>

          <div className={styles.appliedFilters}>
            <Header as="h4" className={styles.filterLabel}>
              Graduated in
            </Header>
            <div className={styles.yearRange}>
              <span className={styles.yearLabel}>From</span>
              <Input
                type="number"
                value={gradYearRange[0]}
                onChange={(e) =>
                  setGradYearRange([
                    parseInt(e.target.value, 10) || DEFAULT_MIN_YEAR,
                    gradYearRange[1]
                  ])
                }
                className={styles.yearInput}
              />
              <span className={styles.yearLabel}>To</span>
              <Input
                type="number"
                value={gradYearRange[1]}
                onChange={(e) =>
                  setGradYearRange([
                    gradYearRange[0],
                    parseInt(e.target.value, 10) || DEFAULT_MAX_YEAR
                  ])
                }
                className={styles.yearInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.listContainer}>
          {isLoading && <Loader active size="large" />}
          {!isLoading && viewMode === 'map' && (
            <>
              <AlumniMap
                visibleCityCoordinates={visibleCityCoordinates}
                selectedCityCoordinates={selectedCityCoordinates}
                onCitySelect={handleCitySelect}
                onCityDeselect={handleCityDeselect}
              />
              <p className={styles.resultCount}>
                Showing {finalFilteredAlumni.length} of {alumni.length}+ alumni
              </p>
              <div className={styles.alumniList}>
                {finalFilteredAlumni.length === 0 ? (
                  <p className={styles.noResults}>No alumni found matching your filters.</p>
                ) : (
                  finalFilteredAlumni.map((alum) => <AlumniCard key={alum.uuid} alum={alum} />)
                )}
              </div>
            </>
          )}
          {!isLoading && viewMode === 'list' && (
            <>
              <p className={styles.resultCount}>
                Showing {filteredAlumni.length} of {alumni.length}+ alumni
              </p>
              <div className={styles.alumniList}>
                {filteredAlumni.length === 0 ? (
                  <p className={styles.noResults}>No alumni found matching your filters.</p>
                ) : (
                  filteredAlumni.map((alum) => <AlumniCard key={alum.uuid} alum={alum} />)
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Alumni;
