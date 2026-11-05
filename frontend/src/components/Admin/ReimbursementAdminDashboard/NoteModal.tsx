import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import styles from './ReimbursementAdminDashboard.module.css';

type Props = {
  open: boolean;
  title: string;
  placeholder?: string;
  confirmLabel: string;
  requireNote?: boolean;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void> | void;
};

const NoteModal: React.FC<Props> = ({
  open,
  title,
  placeholder,
  confirmLabel,
  requireNote,
  onClose,
  onConfirm
}) => {
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setNote('');
      setSubmitting(false);
    }
  }, [open]);

  const canConfirm = !requireNote || note.trim().length > 0;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setSubmitting(true);
    try {
      await onConfirm(note.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="tiny">
      <div className={styles.noteModal}>
        <h3 className={styles.noteModalTitle}>{title}</h3>
        <textarea
          className={styles.noteTextarea}
          placeholder={placeholder ?? 'Add a note...'}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
        />
        <div className={styles.noteModalFooter}>
          <Button basic onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button primary onClick={handleConfirm} loading={submitting} disabled={!canConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NoteModal;
