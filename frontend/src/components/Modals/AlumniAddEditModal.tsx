/* TODO: 
 * Field name font sizes smaller than design
 * cancel button border isn't as black as design
 * x in corner is outside the box
 */

import React, { useMemo, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Icon,
  Input,
  Modal,
} from 'semantic-ui-react';
import styles from '../Admin/EditAlumni/EditAlumni.module.css';

export type Alumni = {
  id: string;
  name: string;
  email: string;
  linkedin?: string;

  gradYear?: string;
  location?: string;
  company?: string;

  companyRole?: string;
  jobCategory?: string;
  dtiRole?: string;
  subteam?: string;
};

export type AlumniFormState = {
  name: string;
  email: string;
  linkedin: string;

  gradYear: string;
  location: string;
  company: string;

  companyRole: string;
  jobCategory: string;
  dtiRole: string;
  subteam: string;
};

function toFormState(a?: Alumni): AlumniFormState {
  return {
    name: a?.name ?? '',
    email: a?.email ?? '',
    linkedin: a?.linkedin ?? '',

    gradYear: a?.gradYear ?? '',
    location: a?.location ?? '',
    company: a?.company ?? '',

    companyRole: a?.companyRole ?? '',
    jobCategory: a?.jobCategory ?? '',
    dtiRole: a?.dtiRole ?? '',
    subteam: a?.subteam ?? ''
  };
}

type AlumniModalProps = {
  open: boolean;
  mode: 'add' | 'edit';
  initialAlumni?: Alumni;
  onClose: () => void;
  onSave: (data: AlumniFormState) => Promise<void> | void;
};

export function AlumniModal({ open, mode, initialAlumni, onClose, onSave }: AlumniModalProps): JSX.Element {
  const [form, setForm] = useState<AlumniFormState>(() => toFormState(initialAlumni));

  // Important: when you open modal on a different person, reset the form.
  React.useEffect(() => {
    if (open) setForm(toFormState(initialAlumni));
  }, [open, initialAlumni?.id]);

  const title = mode === 'add' ? 'Add Alumni' : 'Edit Alumni Information';

  const canSave = form.email.trim().length > 0 && form.name.trim().length > 0;

  return (
    <Modal open={open} onClose={onClose} size="large" closeIcon className={styles.alumniModal}
>
      <Modal.Header className = {styles.modalHeader}>{title}</Modal.Header>

      <Modal.Content>
        {/* Top “profile card”-ish area (simplified) */}
        <div className={styles.modalTopCard}>
          <div className={styles.avatarCircle} />
          <div className={styles.modalTopText}>
            <div className={styles.modalNameRow}>
              <div className={styles.modalName}>{form.name || 'New Alumni'}</div>
              <Icon name="pencil" />
            </div>

            <div className={styles.modalContactRow}>
              <Icon name="mail" />
              <span>{form.email || 'email@example.com'}</span>
              <Icon name="pencil" />
            </div>

            <div className={styles.modalContactRow}>
              <Icon name="linkedin" />
              <span>{form.linkedin || 'linkedin.com/in/…'}</span>
              <Icon name="pencil" />
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
                  onChange={(_, data) => setForm((f) => ({ ...f, gradYear: String(data.value) }))}
                />
              </Grid.Column>

              <Grid.Column>
                <Form.Field
                  label="Location"
                  control={Input}
                  value={form.location}
                  onChange={(_, data) => setForm((f) => ({ ...f, location: String(data.value) }))}
                />
              </Grid.Column>

              <Grid.Column>
                <Form.Field
                  label="Company"
                  control={Input}
                  value={form.company}
                  onChange={(_, data) => setForm((f) => ({ ...f, company: String(data.value) }))}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  label="Company Role"
                  control={Input}
                  value={form.companyRole}
                  onChange={(_, data) =>
                    setForm((f) => ({ ...f, companyRole: String(data.value) }))
                  }
                />
              </Grid.Column>

              <Grid.Column>
                <Form.Field
                  label="Job Category"
                  control={Input}
                  value={form.jobCategory}
                  onChange={(_, data) =>
                    setForm((f) => ({ ...f, jobCategory: String(data.value) }))
                  }
                />
              </Grid.Column>

              <Grid.Column>
                <Form.Field
                  label="DTI Role"
                  control={Input}
                  value={form.dtiRole}
                  onChange={(_, data) => setForm((f) => ({ ...f, dtiRole: String(data.value) }))}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Form.Field
                  label="DTI Subteam"
                  control={Input}
                  value={form.subteam}
                  onChange={(_, data) => setForm((f) => ({ ...f, subteam: String(data.value) }))}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>

      <Modal.Actions>
        <Button basic className = {styles.cancelButton}
        onClick={onClose}>Cancel</Button>
        <Button
          primary
          className = {styles.saveButton}
          disabled={!canSave}
          onClick={async () => {
            await onSave(form);
            onClose();
          }}
        >
          Save Changes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}