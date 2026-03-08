import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import styles from '../Admin/EditAlumni/EditAlumni.module.css';
import Alumni from '../Alumni/Alumni';

type DeleteAlumniConfirmationModalProps = {
  open: boolean;
  alumni?: Alumni;
  onClose: () => void;
  onConfirm: (alumni: Alumni) => Promise<void> | void;
};

export default function DeleteAlumniConfirmationModal({
  open,
  alumni,
  onClose,
  onConfirm
}: DeleteAlumniConfirmationModalProps): JSX.Element {
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
      closeOnDimmerClick
    >
      <Modal.Content className={styles.deleteAlumniModalContent}>
        <div className={styles.deleteAlumniMessage}>
          Are you sure you want to delete <strong>{fullName}</strong>? This action cannot be
          undone.
        </div>

        <div className={styles.deleteAlumniActions}>
          <Button
            color='red'
            className={styles.deleteConfirmButton}
            onClick={async () => {
              if (!alumni) return;
              await onConfirm(alumni);
              onClose();
            }}
          >
            Delete
          </Button>

          <Button className={styles.deleteCancelButton} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}