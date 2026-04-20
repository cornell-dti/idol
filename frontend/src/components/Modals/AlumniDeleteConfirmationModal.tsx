import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import styles from '../Admin/EditAlumni/EditAlumni.module.css';

type AlumniDeleteConfirmationModalProps = {
  open: boolean;
  alumni?: Alumni;
  onClose: () => void;
  onConfirm: (alumni: Alumni) => Promise<void> | void;
};

export default function AlumniDeleteConfirmationModal({
  open,
  alumni,
  onClose,
  onConfirm
}: AlumniDeleteConfirmationModalProps): JSX.Element {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      setDeleting(false);
    }
  }, [open]);

  const fullName =
    alumni && (alumni.firstName || alumni.lastName)
      ? `${alumni.firstName ?? ''} ${alumni.lastName ?? ''}`.trim()
      : 'this alumni';

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="tiny"
      className={styles.deleteAlumniModal}
      closeOnDimmerClick={!deleting}
      closeOnEscape={!deleting}
    >
      <Modal.Content className={styles.deleteAlumniModalContent}>
        <div className={styles.deleteAlumniMessage}>
          Are you sure you want to delete <strong>{fullName}</strong>? This action cannot be undone.
        </div>
        <div className={styles.deleteAlumniActions}>
          <Button
            color="red"
            className={styles.deleteConfirmButton}
            loading={deleting}
            disabled={deleting}
            onClick={async () => {
              if (!alumni) return;
              setDeleting(true);
              try {
                await onConfirm(alumni);
                onClose();
              } finally {
                setDeleting(false);
              }
            }}
          >
            Delete
          </Button>
          <Button className={styles.deleteCancelButton} disabled={deleting} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}
