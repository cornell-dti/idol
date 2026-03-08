/* TODO: 
 * Field name font sizes smaller than design
 * cancel button border isn't as black as design
 * x in corner is outside the box
 * edit buttons make the text shift around
 * save button implementation
 * make save changes close all edit menus and dropdowns
 * linkedin logo slightly too low
 * how to know when to use mobile view? 
 * location dropdown
 * dropdowns vs. free input for location, job category, company
 * multiple selections for subteam, dtirole
 * add uuid field to alumni
 * default image bears change in real time based on netid input, unwanted
 * uploading/saving without a netid does not update the database, require netid
 * images don't load in smoothly
 * does this store images efficiently? I don't want to accidentally store unused/replaced images
 * require location to be a comma separated list which can be mapped by the alumni database
 * require subteam (s) to be a comma separated list
 */

import React, { useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  Form,
  Grid,
  Icon,
  Input,
  Modal,
} from 'semantic-ui-react';
import ImagesAPI from '../../API/ImagesAPI';
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
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : []
    };
  }

function toFormState(a?: Alumni): AlumniFormState {
  if (!a) return emptyAlumniFormState();
  return {
    uuid: a?.uuid ?? '',
    imageUrl: a?.imageUrl ?? '',
    firstName: a?.firstName ?? '',
    lastName: a?.lastName ?? '',
    name: a?.firstName + ' ' + a?.lastName,
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

export function AlumniModal({ open, mode, initialAlumni, onClose, onSave, nameInputOpen, setNameInputOpen, emailInputOpen, setEmailInputOpen, linkedinInputOpen, setLinkedinInputOpen }: AlumniModalProps): JSX.Element {
  const [form, setForm] = useState<AlumniFormState>(() => toFormState(initialAlumni));
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Important: when you open modal on a different person, reset the form.
  React.useEffect(() => {
    if (open) {
      setForm(toFormState(initialAlumni));
      setUploadError(null);
      setImagePreviewUrl('');
      console.log("opened!")
    }
  }, [open]);

  // Revoke object URLs on unmount to avoid memory leaks
  React.useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  // Resolve path-based imageUrl (alumImages/xxx) to signed URL for display, else set imagePreviewURL to form.url
  React.useEffect(() => {
    const path = form.imageUrl;
    if (imagePreviewUrl !== '') return;
    if (path.startsWith('http')) setImagePreviewUrl(path);
    else if (path.startsWith(ALUMNI_IMAGE_PATH_PREFIX)) {
        ImagesAPI.getImage(path).then((url) => {setImagePreviewUrl(url)});
    } else setImagePreviewUrl(getFallbackImage(form.uuid));
  }, [form.imageUrl, imagePreviewUrl]);

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
      setImagePreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      setUploadError('Failed to upload image. Please try again.');
      console.error('Image upload error:', err);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const title = mode === 'add' ? 'Add Alumni' : 'Edit Alumni Information';

  return (
    <Modal open={open} onClose={onClose} size="large" closeIcon className={styles.alumniModal}
>
      <Modal.Header className = {styles.modalHeader}>{title}</Modal.Header>

      <Modal.Content>
        <div className={styles.modalTopCard}>
          <div className={styles.avatarWrapper}>
            <button
              type="button"
              className={styles.avatarButton}
              onClick={() => !uploadingImage && fileInputRef.current?.click()}
              disabled={uploadingImage}
            >
                <img
                  src={imagePreviewUrl}
                  alt="Alumni profile"
                  className={styles.avatarImage}
                />
              <span className={styles.avatarOverlay}>
                {uploadingImage ? (
                  <Icon name="spinner" loading />
                ) : (
                  <Icon name="camera" size = 'large' style={{ color: 'white' }} />
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
            {uploadError && (
              <span className={styles.uploadError}>{uploadError}</span>
            )}
          </div>
          <div className={styles.modalTopText}>
            <div className={styles.modalNameRow}>
            {!nameInputOpen ? (
                <div className={styles.modalName}>
                    {(form.firstName || form.lastName)
                    ? `${form.firstName ?? ''} ${form.lastName ?? ''}`.trim()
                    : 'New Alumni'}
                </div>
                ) : (
                <Form.Field
                    control={Input}
                    value={`${form.firstName ?? ''} ${form.lastName ?? ''}`}
                    onChange={(_: any, data: { value: any; }) => {
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
              <button onClick = { () => setNameInputOpen(!nameInputOpen)} className = {styles.iconButton}>
                {nameInputOpen? <text style = {{fontWeight: 600}}>Save</text> : <Icon name="pencil" />}
              </button>
            </div>

            <div className={styles.modalContactRow}>
              <Icon name="mail" />
              {!emailInputOpen? <span>{form.email}</span> : <Form.Field
                  control= {Input}
                  value= {form.email}
                  onChange={(_: any, data: { value: any; }) => setForm((f) => ({ ...f, email: String(data.value) }
                ))}
                />}
              <button onClick = { () => setEmailInputOpen(!emailInputOpen)} className = {styles.iconButton}>
                {emailInputOpen? <text style = {{fontWeight: 600}}>Save</text> : <Icon name="pencil" />}
              </button>
            </div>

            <div className={styles.modalContactRow}>
              <Icon name="linkedin"/>
              {!linkedinInputOpen? <span>{form.linkedin}</span> : <Form.Field
                  control= {Input}
                  value= {form.linkedin}
                  onChange={(_: any, data: { value: any; }) => setForm((f) => ({ ...f, linkedin: String(data.value) }
                ))}
                />}
              <button onClick = { () => setLinkedinInputOpen(!linkedinInputOpen)} className = {styles.iconButton}>
                {linkedinInputOpen? <text style = {{fontWeight: 600}}>Save</text> : <Icon name="pencil" />}
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
                  value={form.gradYear}
                  onChange={(_: any, data: { value: number | null; }) => setForm((f) => ({ ...f, gradYear: (data.value) }))}
                />
              </Grid.Column>

              <Grid.Column>
                <Form.Field
                  label="Location"
                  control={Input}
                  value={form.location}
                  onChange={(_: any, data: { value: any; }) => setForm((f) => ({ ...f, location: String(data.value) }))}
                />
              </Grid.Column>

              <Grid.Column>
                <Form.Field
                  label="Company"
                  control={Input}
                  value={form.company}
                  onChange={(_: any, data: { value: any; }) => setForm((f) => ({ ...f, company: String(data.value) }))}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
              <Form.Field
                  label="Company Role"
                  control={Input}
                  value={form.companyRole}
                  onChange={(_: any, data: { value: any; }) =>
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
                        { key: 'product-management', text: 'Product Management', value: 'Product Management' },
                        { key: 'business', text: 'Business', value: 'Business' },
                        { key: 'product-design', text: 'Product Design', value: 'Product Design' },
                        { key: 'entrepreneurship', text: 'Entrepreneurship', value: 'Entrepreneurship' },
                        { key: 'grad-student', text: 'Grad Student', value: 'Grad Student' },
                        { key: 'other', text: 'Other', value: 'Other' }
                    ]}
                  value={form.jobCategory}
                  onChange={(_: any, data: { value: any; }) => setForm((f) => ({ ...f, jobCategory: (data.value) }))}
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
                onChange={(_: any, data: { value: AlumDtiRole[]; }) =>
                    setForm((f) => ({
                    ...f,
                    dtiRole: (data.value as AlumDtiRole[]) ?? []
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
                    onChange={(_: any, data: { value: any; }) =>
                      setForm((f) => ({ ...f, subteam: String(data.value) }))
                    }
                />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
              <Form.Field>
                <label>Cornell NetID</label>

                <Input
                    value={form.uuid}
                    control={Input}
                    onChange={(_: any, data: { value: any; }) =>
                      setForm((f) => ({ ...f, uuid: String(data.value) }))
                    }
                />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>

      <Modal.Actions>
        <Button basic className = {styles.cancelButton}
        onClick={
            onClose

        }>Cancel</Button>
        <Button
          primary
          className = {styles.saveButton}
          onClick={async () => {
            await onSave(fromFormState(form));
            onClose();
          }}
        >
          Save Changes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}