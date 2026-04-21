/* Minor Issues:
 * Field name font sizes smaller than design
 * cancel button border isn't as black as design
 * x in corner is outside the box
 * opening the edit menus at the top makes everything shift a little
 * linkedin logo slightly too low
 * Nominatim struggles encoding japanese cities
 */

import React, { useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Form, Grid, Icon, Input, Modal } from 'semantic-ui-react';
import ImagesAPI from '../../API/ImagesAPI';
import CityCoordinatesAPI from '../../API/CityCoordinatesAPI';
import styles from '../Admin/EditAlumni/EditAlumni.module.css';

export type AlumniFormState = {
  uuid: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  linkedin: string;
  gradYear: number | null;
  location: string;
  company: string;
  companyRole: string;
  jobCategory: AlumJobCategory | null;
  dtiRole: AlumDtiRole[] | null;
  subteam: string;
};

const MAX_DTI_ROLES = 2;
const MAX_SUBTEAMS = 2;

function emptyAlumniFormState(): AlumniFormState {
  return {
    uuid: '',
    imageUrl: '',
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    linkedin: '',
    gradYear: null,
    location: '',
    company: '',
    companyRole: '',
    jobCategory: null,
    dtiRole: [],
    subteam: ''
  };
}

function fromFormState(form: AlumniFormState): Alumni {
  return {
    uuid: form.uuid,
    imageUrl: form.imageUrl,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    linkedin: form.linkedin.trim() || null,
    gradYear: form.gradYear ?? null,
    location: form.location.trim(),
    company: form.company.trim(),
    jobRole: form.companyRole.trim() || 'Other',
    jobCategory: form.jobCategory ?? 'Other',
    dtiRoles: (form.dtiRole ?? []).slice(0, MAX_DTI_ROLES),
    subteams:
      form.subteam.trim().length > 0
        ? form.subteam
            .split(', ')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .slice(0, MAX_SUBTEAMS)
        : []
  };
}

/** Non-empty values must list subteams separated by comma + space (e.g. "QMI, CU Reviews"). */
function isValidSubteamCommaSpaceList(value: string): boolean {
  const t = value.trim();
  if (t.length === 0) return true;
  if (/,(?!\s)/.test(t)) return false;
  const parts = t.split(', ');
  for (const p of parts) {
    if (p.includes(',')) return false;
    if (p.trim().length === 0) return false;
  }
  return true;
}

function subteamPartsCount(value: string): number {
  const t = value.trim();
  if (t.length === 0) return 0;
  return t
    .split(', ')
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;
}

/** Format OK, at most MAX_SUBTEAMS subteams, empty allowed. */
function isValidSubteamField(value: string): boolean {
  if (!isValidSubteamCommaSpaceList(value)) return false;
  return subteamPartsCount(value) <= MAX_SUBTEAMS;
}

function getSubteamFieldError(value: string): string | null {
  const t = value.trim();
  if (t.length === 0) return null;
  if (!isValidSubteamCommaSpaceList(value)) {
    return 'Use a comma and space between subteams (e.g. Subteam A, Subteam B).';
  }
  if (subteamPartsCount(value) > MAX_SUBTEAMS) {
    return `At most ${MAX_SUBTEAMS} subteams.`;
  }
  return null;
}

function toFormState(a?: Alumni): AlumniFormState {
  if (!a) return emptyAlumniFormState();
  return {
    uuid: a?.uuid ?? '',
    imageUrl: a?.imageUrl ?? '',
    firstName: a?.firstName ?? '',
    lastName: a?.lastName ?? '',
    name: `${a?.firstName ?? ''} ${a?.lastName ?? ''}`.trim(),
    email: a?.email ?? '',
    linkedin: a?.linkedin ?? '',
    gradYear: a?.gradYear ?? null,
    location: a?.location ?? '',
    company: a?.company ?? '',
    companyRole: a?.jobRole ?? '',
    jobCategory: a?.jobCategory ?? null,
    dtiRole: a?.dtiRoles ?? null,
    subteam: a?.subteams?.join(', ') ?? ''
  };
}

type AlumniModalProps = {
  open: boolean;
  mode: 'add' | 'edit';
  initialAlumni?: Alumni;
  setModalOpen: (open: boolean) => void;
  onSave: (data: Alumni) => Promise<void> | void;
};

const FALLBACK_IMAGES = [
  '/alumni/fallback-1.svg',
  '/alumni/fallback-2.svg',
  '/alumni/fallback-3.svg',
  '/alumni/fallback-4.svg'
];

const getFallbackImage = (uuid: string): string => {
  const hash = uuid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
};

const ALUMNI_IMAGE_PATH_PREFIX = 'alumImages/';

/** Semantic UI `Form.Field` / `Input` onChange `data` */
type FormInputChangeData = { value?: unknown };

type InlineEditableFieldProps = {
  rowClassName: string;
  /** Optional icon or other content before the value (e.g. mail / linkedin). */
  leading?: React.ReactNode;
  isOpen: boolean;
  onToggleOpen: () => void;
  display: React.ReactNode;
  edit: React.ReactNode;
};

function InlineEditableField({
  rowClassName,
  leading,
  isOpen,
  onToggleOpen,
  display,
  edit
}: InlineEditableFieldProps): JSX.Element {
  return (
    <div className={rowClassName}>
      {leading}
      {isOpen ? edit : display}
      <button type="button" onClick={onToggleOpen} className={styles.iconButton}>
        {isOpen ? <span style={{ fontWeight: 600 }}>Save</span> : <Icon name="pencil" />}
      </button>
    </div>
  );
}

export function AlumniModal({
  open,
  mode,
  initialAlumni,
  setModalOpen,
  onSave
}: AlumniModalProps): JSX.Element {
  const [form, setForm] = useState<AlumniFormState>(() => toFormState(initialAlumni));
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  /** True while resolving `alumImages/…` to a signed URL (avoids empty avatar flash). */
  const [avatarImageLoading, setAvatarImageLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameInputOpen, setNameInputOpen] = useState<boolean>(false);
  const [emailInputOpen, setEmailInputOpen] = useState<boolean>(false);
  const [linkedinInputOpen, setLinkedinInputOpen] = useState<boolean>(false);
  const [allLocations, setAllLocations] = useState<readonly CityCoordinates[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [geocodingNewLocation, setGeocodingNewLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const LOCATION_NOT_FOUND_MSG = 'Location not found. Please enter another location to add.';

  React.useEffect(() => {
    if (open) {
      const nextForm = mode === 'add' ? emptyAlumniFormState() : toFormState(initialAlumni);
      setForm(nextForm);
      setUploadError(null);
      setSaveError(null);
      setImagePreviewUrl('');
      setAvatarImageLoading(nextForm.imageUrl.startsWith(ALUMNI_IMAGE_PATH_PREFIX));
      setLocationQuery(mode === 'add' ? '' : initialAlumni?.location ?? '');
      setLocationError(null);
      // Load locations once when modal opens
      if (allLocations.length === 0 && !loadingLocations) {
        setLoadingLocations(true);
        CityCoordinatesAPI.getAllCityCoordinates()
          .then((coords) => setAllLocations(coords))
          .finally(() => setLoadingLocations(false));
      }
    }
  }, [open, mode, initialAlumni]);

  // Revoke object URLs on unmount to avoid memory leaks
  React.useEffect(
    () => () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    },
    [imagePreviewUrl]
  );

  // Add mode: uploads go to `alumImages/{netId}`. If NetID changes after upload, clear the image
  // so we never save a document whose `uuid` does not match `imageUrl` (edit mode locks NetID).
  React.useEffect(() => {
    if (!open || mode !== 'add') return;

    const id = form.uuid.trim();
    const path = form.imageUrl;
    if (!path.startsWith(ALUMNI_IMAGE_PATH_PREFIX)) return;

    const pathNetId = path.slice(ALUMNI_IMAGE_PATH_PREFIX.length);
    if (pathNetId === id) return;

    setImagePreviewUrl((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return '';
    });
    setForm((f) => ({ ...f, imageUrl: '' }));
    setUploadError(
      id.length > 0 ? 'NetID changed; upload a new photo.' : 'Photo cleared until NetID is set.'
    );
  }, [open, mode, form.uuid, form.imageUrl]);

  // Resolve path-based imageUrl (alumImages/…) to signed URL for display; fallbacks are synchronous.
  React.useEffect(() => {
    const path = form.imageUrl;
    if (imagePreviewUrl !== '') {
      return undefined;
    }

    let cleanup: (() => void) | undefined;
    if (path.startsWith('http')) {
      setImagePreviewUrl(path);
      setAvatarImageLoading(false);
    } else if (path.startsWith(ALUMNI_IMAGE_PATH_PREFIX)) {
      setAvatarImageLoading(true);
      let cancelled = false;
      ImagesAPI.getImage(path)
        .then((url) => {
          if (!cancelled) setImagePreviewUrl(url);
        })
        .finally(() => {
          if (!cancelled) setAvatarImageLoading(false);
        });
      cleanup = () => {
        cancelled = true;
      };
    } else {
      setImagePreviewUrl(getFallbackImage(form.uuid));
      setAvatarImageLoading(false);
    }
    return cleanup;
  }, [form.imageUrl, form.uuid, imagePreviewUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uuid = form.uuid.trim();
    if (!uuid) {
      setUploadError('Please enter Cornell NetID before uploading an image.');
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (e.g. JPEG, PNG).');
      e.target.value = '';
      return;
    }

    setUploadError(null);
    setUploadingImage(true);
    try {
      const blob = await fetch(URL.createObjectURL(file)).then((res) => res.blob());
      const imagePath = `${ALUMNI_IMAGE_PATH_PREFIX}${uuid}`;
      await ImagesAPI.uploadImage(blob, imagePath);

      // Store path for save; use object URL for immediate preview
      setForm((f) => ({ ...f, imageUrl: imagePath }));
      setAvatarImageLoading(false);
      setImagePreviewUrl(URL.createObjectURL(file));
    } catch {
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const title = mode === 'add' ? 'Add Alumni' : 'Edit Alumni Information';
  const showAvatarSpinner = uploadingImage || avatarImageLoading;
  const canUploadImage = form.uuid.trim().length > 0;
  const onClose = () => {
    setModalOpen(false);
    setNameInputOpen(false);
    setEmailInputOpen(false);
    setLinkedinInputOpen(false);
  };
  const subteamError = getSubteamFieldError(form.subteam);

  const locationDropdownOptions = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    const uniqueNames = Array.from(new Set(allLocations.map((c) => c.locationName)));

    const filtered =
      query.length > 0
        ? (() => {
            const filteredAndSortedByPop = [...allLocations]
              .filter((c) => c.locationName.toLowerCase().includes(query))
              .sort((a, b) => b.alumniIds.length - a.alumniIds.length);
            return filteredAndSortedByPop.map((c) => c.locationName);
          })()
        : (() => {
            const sortedByPop = [...allLocations].sort(
              (a, b) => b.alumniIds.length - a.alumniIds.length
            );
            return sortedByPop.map((c) => c.locationName);
          })();

    const topFive = filtered.slice(0, 5);
    const baseOptions = topFive.map((name) => ({
      key: name,
      text: name,
      value: name
    }));

    const hasExact = uniqueNames.some((name) => name.toLowerCase() === query);
    if (query && !hasExact) {
      baseOptions.push({
        key: `add-${query}`,
        text: `Add "${locationQuery}"`,
        value: `__add__${locationQuery}`
      });
    }

    return baseOptions;
  }, [allLocations, locationQuery]);

  return (
    <Modal open={open} onClose={onClose} size="large" closeIcon className={styles.alumniModal}>
      <Modal.Header className={styles.modalHeader}>{title}</Modal.Header>
      <Modal.Content>
        <div className={styles.modalTopCard}>
          <div className={styles.avatarWrapper}>
            <button
              type="button"
              className={styles.avatarButton}
              onClick={() => !uploadingImage && canUploadImage && fileInputRef.current?.click()}
              disabled={uploadingImage || !canUploadImage}
              title={canUploadImage ? undefined : 'Enter Cornell NetID before uploading a photo'}
            >
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Alumni profile" className={styles.avatarImage} />
              ) : (
                <div className={styles.avatarPlaceholder} aria-hidden />
              )}
              {showAvatarSpinner && (
                <span className={styles.avatarLoadingShade}>
                  <Icon name="spinner" loading />
                </span>
              )}
              <span className={styles.avatarOverlay}>
                {!showAvatarSpinner && canUploadImage && (
                  <Icon name="camera" size="large" style={{ color: 'white' }} />
                )}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            {uploadError && <span className={styles.uploadError}>{uploadError}</span>}
          </div>
          <div className={styles.modalTopText}>
            <InlineEditableField
              rowClassName={styles.modalNameRow}
              isOpen={nameInputOpen}
              onToggleOpen={() => setNameInputOpen((v) => !v)}
              display={
                <div className={styles.modalName}>
                  {form.firstName || form.lastName
                    ? `${form.firstName ?? ''} ${form.lastName ?? ''}`.trim()
                    : 'New Alumni'}
                </div>
              }
              edit={
                <Form.Field
                  control={Input}
                  value={`${form.firstName ?? ''} ${form.lastName ?? ''}`}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) => {
                    const name = String(data.value ?? '');
                    const parts = name.split(/\s+/);
                    const lastName = parts.length > 1 ? parts.pop()! : '';
                    const firstName = parts.join(' ');

                    setForm((f) => ({
                      ...f,
                      firstName,
                      lastName
                    }));
                  }}
                />
              }
            />
            <InlineEditableField
              rowClassName={styles.modalContactRow}
              leading={<Icon name="mail" />}
              isOpen={emailInputOpen}
              onToggleOpen={() => setEmailInputOpen((v) => !v)}
              display={<span>{form.email}</span>}
              edit={
                <Form.Field
                  control={Input}
                  value={form.email}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                    setForm((f) => ({ ...f, email: String(data.value) }))
                  }
                />
              }
            />
            <InlineEditableField
              rowClassName={styles.modalContactRow}
              leading={<Icon name="linkedin" />}
              isOpen={linkedinInputOpen}
              onToggleOpen={() => setLinkedinInputOpen((v) => !v)}
              display={<span>{form.linkedin}</span>}
              edit={
                <Form.Field
                  control={Input}
                  value={form.linkedin}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                    setForm((f) => ({ ...f, linkedin: String(data.value) }))
                  }
                />
              }
            />
          </div>
        </div>
        <Form>
          <Grid columns={3} stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  label="Graduation Year"
                  control={Input}
                  type="number"
                  value={form.gradYear ?? ''}
                  onChange={(
                    _e: React.SyntheticEvent<HTMLElement>,
                    data: { value: string | number }
                  ) => {
                    const raw = data.value;
                    if (raw === '' || raw === null || raw === undefined) {
                      setForm((f) => ({ ...f, gradYear: null }));
                      return;
                    }
                    const n = typeof raw === 'number' ? raw : Number(raw);
                    setForm((f) => ({
                      ...f,
                      gradYear: Number.isFinite(n) ? n : null
                    }));
                  }}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Field
                  label="Location"
                  control={Dropdown}
                  selection
                  search
                  loading={loadingLocations || geocodingNewLocation}
                  placeholder="Search or add a location"
                  options={locationDropdownOptions}
                  value={form.location}
                  onSearchChange={(
                    _event: React.SyntheticEvent<HTMLElement>,
                    data: { searchQuery?: string }
                  ) => {
                    setLocationQuery(String(data.searchQuery ?? ''));
                    setLocationError(null);
                  }}
                  onChange={async (
                    _event: React.SyntheticEvent<HTMLElement>,
                    data: { value?: unknown }
                  ) => {
                    const value = String(data.value ?? '');
                    if (value.startsWith('__add__')) {
                      const raw = value.replace('__add__', '');
                      const newLocation = raw.trim();
                      if (!newLocation) return;

                      const previousLocation = form.location;
                      const previousQuery = locationQuery;
                      setLocationError(null);
                      setGeocodingNewLocation(true);
                      try {
                        const created = await CityCoordinatesAPI.geocodeToCoordinates(newLocation);
                        setAllLocations((prev) => [...prev, created]);
                        setForm((f) => ({ ...f, location: created.locationName }));
                        setLocationQuery(created.locationName);
                      } catch {
                        setForm((f) => ({ ...f, location: previousLocation }));
                        setLocationQuery(previousQuery);
                        setLocationError(LOCATION_NOT_FOUND_MSG);
                      } finally {
                        setGeocodingNewLocation(false);
                      }
                    } else {
                      setLocationError(null);
                      setForm((f) => ({ ...f, location: value }));
                      setLocationQuery(value);
                    }
                  }}
                />
                {locationError && (
                  <div className={styles.uploadError} style={{ marginTop: 6 }} role="alert">
                    {locationError}
                  </div>
                )}
              </Grid.Column>
              <Grid.Column>
                <Form.Field
                  label="Company"
                  control={Input}
                  value={form.company}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                    setForm((f) => ({ ...f, company: String(data.value) }))
                  }
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  label="Company Role"
                  control={Input}
                  value={form.companyRole}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                    setForm((f) => ({ ...f, companyRole: String(data.value) }))
                  }
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Field
                  label="Job Category"
                  control={Dropdown}
                  selection
                  options={[
                    { key: 'technology', text: 'Technology', value: 'Technology' },
                    {
                      key: 'product-management',
                      text: 'Product Management',
                      value: 'Product Management'
                    },
                    { key: 'business', text: 'Business', value: 'Business' },
                    { key: 'product-design', text: 'Product Design', value: 'Product Design' },
                    {
                      key: 'entrepreneurship',
                      text: 'Entrepreneurship',
                      value: 'Entrepreneurship'
                    },
                    { key: 'grad-student', text: 'Grad Student', value: 'Grad Student' },
                    { key: 'other', text: 'Other', value: 'Other' }
                  ]}
                  value={form.jobCategory}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                    setForm((f) => ({
                      ...f,
                      jobCategory: (data.value as AlumJobCategory | null | undefined) ?? null
                    }))
                  }
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Field
                  label={`DTI Role (at most ${MAX_DTI_ROLES})`}
                  control={Dropdown}
                  selection
                  multiple
                  options={[
                    { key: 'dev', text: 'Development', value: 'Dev' },
                    { key: 'product', text: 'Product', value: 'Product' },
                    { key: 'business', text: 'Business', value: 'Business' },
                    { key: 'design', text: 'Design', value: 'Design' },
                    { key: 'lead', text: 'Lead', value: 'Lead' }
                  ]}
                  value={(form.dtiRole ?? []).slice(0, MAX_DTI_ROLES)}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) => {
                    const next = (data.value as AlumDtiRole[] | undefined) ?? [];
                    setForm((f) => ({
                      ...f,
                      dtiRole: next.slice(0, MAX_DTI_ROLES)
                    }));
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label>DTI Subteam</label>
                  <Input
                    value={form.subteam}
                    control={Input}
                    placeholder={`Up to ${MAX_SUBTEAMS} subteams, e.g. QMI, IDOL`}
                    onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                      setForm((f) => ({ ...f, subteam: String(data.value) }))
                    }
                  />
                  {subteamError && (
                    <div className={styles.uploadError} style={{ marginTop: 6 }} role="alert">
                      {subteamError}
                    </div>
                  )}
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <label>Cornell NetID *</label>
                  <Input
                    value={form.uuid}
                    control={Input}
                    disabled={mode === 'edit'}
                    onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                      setForm((f) => ({ ...f, uuid: String(data.value) }))
                    }
                    placeholder="Required for photo upload and save"
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic className={styles.cancelButton} onClick={onClose}>
          Cancel
        </Button>
        <Button
          primary
          className={styles.saveButton}
          loading={saveLoading}
          disabled={
            saveLoading ||
            !form.uuid.trim() ||
            !form.email.trim() ||
            !form.firstName.trim() ||
            !isValidSubteamField(form.subteam)
          }
          onClick={async () => {
            const alumniToSave = fromFormState(form);
            const oldLocation = initialAlumni?.location ?? null;
            const newLocation = alumniToSave.location?.trim() || null;
            setSaveLoading(true);
            try {
              await onSave(alumniToSave);
              // If location changed, update city-coordinates collection
              if (oldLocation !== newLocation) {
                try {
                  // Remove alumni from any previous locations
                  const allCoords = await CityCoordinatesAPI.getAllCityCoordinates();
                  await Promise.all(
                    allCoords
                      .filter((coord) => coord.alumniIds.includes(alumniToSave.uuid))
                      .map((coord) =>
                        CityCoordinatesAPI.removeAlumniFromLocation(
                          coord.latitude,
                          coord.longitude,
                          alumniToSave.uuid
                        )
                      )
                  );
                  // Add to new location if present
                  if (newLocation) {
                    const coords = await CityCoordinatesAPI.geocodeToCoordinates(newLocation);
                    await CityCoordinatesAPI.addAlumniToLocation(
                      coords.latitude,
                      coords.longitude,
                      alumniToSave.uuid,
                      coords.locationName
                    );
                  }
                } catch (error) {
                  // If updating city coordinates fails, we still persist the alumni change.
                  console.error('Failed to sync city-coordinates after alumni save:', error);
                }
              }
              onClose();
            } catch (error) {
              console.error('Failed to save alumni: ', error);
              setSaveError(`Failed to save alumni: ${(error as Error).message}`);
            } finally {
              setSaveLoading(false);
            }
          }}
        >
          {saveLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        {saveError && (
          <div className={styles.uploadError} style={{ marginTop: 6 }} role="alert">
            {saveError}
          </div>
        )}
      </Modal.Actions>
    </Modal>
  );
}
