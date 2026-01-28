import React, { useState, useEffect, useMemo } from 'react';
import { Container, Header, Input, Dropdown, Icon, Image, Loader } from 'semantic-ui-react';
import { Emitters } from '../../utils';
import AlumniAPI from '../../API/AlumniAPI';
import styles from './Alumni.module.css';

type ViewMode = 'list' | 'map';

const Alumni: React.FC = () => {
  const [alumni, setAlumni] = useState<readonly Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedJobCategories, setSelectedJobCategories] = useState<string[]>([]);
  const [selectedDtiRoles, setSelectedDtiRoles] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [gradYearRange, setGradYearRange] = useState<[number, number]>([2016, 2024]);

  useEffect(() => {
    setIsLoading(true);
    AlumniAPI.getAllAlumni()
      .then((alumniData) => {
        setAlumni(alumniData);
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
                value={gradYearRange ? gradYearRange[0] : ''}
                onChange={(e) =>
                  setGradYearRange([parseInt(e.target.value, 10) || 2016, gradYearRange[1]])
                }
                className={styles.yearInput}
              />
              <span className={styles.yearLabel}>To</span>
              <Input
                type="number"
                value={gradYearRange[1]}
                onChange={(e) =>
                  setGradYearRange([gradYearRange[0], parseInt(e.target.value, 10) || 2024])
                }
                className={styles.yearInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.listContainer}>
          {isLoading ? (
            <Loader active size="large" />
          ) : (
            <>
              <p className={styles.resultCount}>
                Showing {filteredAlumni.length} of {alumni.length}+ alumni
              </p>

              <div className={styles.alumniList}>
                {filteredAlumni.length === 0 ? (
                  <p className={styles.noResults}>No alumni found matching your filters.</p>
                ) : (
                  filteredAlumni.map((alum) => (
                    <div key={alum.uuid} className={styles.alumniCard}>
                      {alum.imageUrl && (
                        <Image
                          src={alum.imageUrl}
                          alt={`${alum.firstName} ${alum.lastName}`}
                          className={styles.profileImage}
                          circular
                          size="small"
                        />
                      )}

                      <div className={styles.cardContent}>
                        <div className={styles.nameSection}>
                          <h3 className={styles.name}>
                            {alum.firstName} {alum.lastName}
                          </h3>
                        </div>

                        <div className={styles.infoGrid}>
                          <div className={styles.infoColumn}>
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Company</span>
                              <span className={styles.infoValue}>{alum.company || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Company Role</span>
                              <span className={styles.infoValue}>{alum.jobRole}</span>
                            </div>
                          </div>

                          <div className={styles.infoColumn}>
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Based in</span>
                              <span className={styles.infoValue}>{alum.location || 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Graduated in</span>
                              <span className={styles.infoValue}>{alum.gradYear || 'N/A'}</span>
                            </div>
                          </div>

                          <div className={styles.infoColumn}>
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Role on DTI</span>
                              <span className={styles.infoValue}>
                                {alum.dtiRoles && alum.dtiRoles.length > 0
                                  ? alum.dtiRoles.join(', ')
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className={styles.infoItem}>
                              <span className={styles.infoLabel}>Subteam on DTI</span>
                              <span className={styles.infoValue}>
                                {alum.subteams && alum.subteams.length > 0
                                  ? alum.subteams.join(', ')
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.socialIcons}>
                        {alum.email && (
                          <a
                            href={`mailto:${alum.email}`}
                            className={styles.socialLink}
                            aria-label="Email"
                          >
                            <Icon name="mail" size="large" />
                          </a>
                        )}
                        {alum.linkedin && (
                          <a
                            href={alum.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="LinkedIn"
                          >
                            <Icon name="linkedin" size="large" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
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
