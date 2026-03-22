/* Minor Issues:
 * Field name font sizes smaller than design
 * cancel button border isn't as black as design
 * x in corner is outside the box
 * opening the edit menus at the top makes everything shift a little
 * linkedin logo slightly too low
 * Nominatim only accepts chinese characters for locations in China
 */

import React, { useRef, useState } from 'react';
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
    linkedin: form.linkedin.trim() ?? null,

    gradYear: form.gradYear ?? null,
    location: form.location.trim(),
    company: form.company.trim(),

    jobRole: form.companyRole.trim(),
    jobCategory: form.jobCategory ?? 'Other',

    dtiRoles: form.dtiRole ?? [],

    subteams: form.subteam
      ? form.subteam
          .split(', ')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
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
  onClose: () => void;
  onSave: (data: Alumni) => Promise<void> | void;
  saveLoading: boolean;
  nameInputOpen: boolean;
  setNameInputOpen: React.Dispatch<React.SetStateAction<boolean>>;
  emailInputOpen: boolean;
  setEmailInputOpen: React.Dispatch<React.SetStateAction<boolean>>;
  linkedinInputOpen: boolean;
  setLinkedinInputOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

export function AlumniModal({
  open,
  mode,
  initialAlumni,
  onClose,
  onSave,
  saveLoading,
  nameInputOpen,
  setNameInputOpen,
  emailInputOpen,
  setEmailInputOpen,
  linkedinInputOpen,
  setLinkedinInputOpen
}: AlumniModalProps): JSX.Element {
  const [form, setForm] = useState<AlumniFormState>(() => toFormState(initialAlumni));
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  /** True while resolving `alumImages/…` to a signed URL (avoids empty avatar flash). */
  const [avatarImageLoading, setAvatarImageLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [allLocations, setAllLocations] = useState<readonly CityCoordinates[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [geocodingNewLocation, setGeocodingNewLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const LOCATION_NOT_FOUND_MSG = 'Location not found. Please enter another location to add.';

  React.useEffect(() => {
    if (open) {
      const nextForm = mode === 'add' ? emptyAlumniFormState() : toFormState(initialAlumni);
      setForm(nextForm);
      setUploadError(null);
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
    [imagePreviewUrl, allLocations.length, loadingLocations]
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
            <div className={styles.modalNameRow}>
              {!nameInputOpen ? (
                <div className={styles.modalName}>
                  {form.firstName || form.lastName
                    ? `${form.firstName ?? ''} ${form.lastName ?? ''}`.trim()
                    : 'New Alumni'}
                </div>
              ) : (
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
              )}
              <button
                onClick={() => setNameInputOpen(!nameInputOpen)}
                className={styles.iconButton}
              >
                {nameInputOpen ? (
                  <text style={{ fontWeight: 600 }}>Save</text>
                ) : (
                  <Icon name="pencil" />
                )}
              </button>
            </div>

            <div className={styles.modalContactRow}>
              <Icon name="mail" />
              {!emailInputOpen ? (
                <span>{form.email}</span>
              ) : (
                <Form.Field
                  control={Input}
                  value={form.email}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                    setForm((f) => ({ ...f, email: String(data.value) }))
                  }
                />
              )}
              <button
                onClick={() => setEmailInputOpen(!emailInputOpen)}
                className={styles.iconButton}
              >
                {emailInputOpen ? (
                  <text style={{ fontWeight: 600 }}>Save</text>
                ) : (
                  <Icon name="pencil" />
                )}
              </button>
            </div>

            <div className={styles.modalContactRow}>
              <Icon name="linkedin" />
              {!linkedinInputOpen ? (
                <span>{form.linkedin}</span>
              ) : (
                <Form.Field
                  control={Input}
                  value={form.linkedin}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                    setForm((f) => ({ ...f, linkedin: String(data.value) }))
                  }
                />
              )}
              <button
                onClick={() => setLinkedinInputOpen(!linkedinInputOpen)}
                className={styles.iconButton}
              >
                {linkedinInputOpen ? (
                  <text style={{ fontWeight: 600 }}>Save</text>
                ) : (
                  <Icon name="pencil" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form grid like screenshot */}
        <Form>
          <Grid columns={3} stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  label="Graduation Year"
                  control={Input}
                  type="number"
                  value={form.gradYear ?? ''}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: { value: string | number }) => {
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
                  options={(() => {
                    const query = locationQuery.trim().toLowerCase();
                    const uniqueNames = Array.from(
                      new Set(allLocations.map((c) => c.locationName))
                    );
                    const filtered =
                      query.length > 0
                        ? uniqueNames.filter((name) => name.toLowerCase().includes(query))
                        : [];
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
                  })()}
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
                        const created = await CityCoordinatesAPI.geocodeAndStore(newLocation);
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
                  label="DTI Role"
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
                  value={form.dtiRole ?? []}
                  onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                    setForm((f) => ({
                      ...f,
                      dtiRole: (data.value as AlumDtiRole[] | undefined) ?? []
                    }))
                  }
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
                    placeholder="Enter as comma separated list e.g. QMI, IDOL"
                    onChange={(_e: React.SyntheticEvent<HTMLElement>, data: FormInputChangeData) =>
                      setForm((f) => ({ ...f, subteam: String(data.value) }))
                    }
                  />
                  {!isValidSubteamCommaSpaceList(form.subteam) && (
                    <div className={styles.uploadError} style={{ marginTop: 6 }} role="alert">
                      Use a comma and space between subteams (e.g. Subteam A, Subteam B).
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
          disabled={saveLoading || !form.uuid.trim() || !isValidSubteamCommaSpaceList(form.subteam)}
          onClick={async () => {
            const alumniToSave = fromFormState(form);
            const oldLocation = initialAlumni?.location ?? null;
            const newLocation = alumniToSave.location?.trim() || null;

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
                  const coords = await CityCoordinatesAPI.geocodeAndStore(newLocation);
                  await CityCoordinatesAPI.addAlumniToLocation(
                    coords.latitude,
                    coords.longitude,
                    alumniToSave.uuid,
                    coords.locationName
                  );
                }
              } catch {
                // If updating city coordinates fails, we still persist the alumni change.
              }
            }
            onClose();
          }}
        >
          {saveLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
