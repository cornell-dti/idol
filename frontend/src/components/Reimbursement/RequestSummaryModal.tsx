import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import styles from './RequestSummaryModal.module.css';

type Props = {
  open: boolean;
  request: ReimbursementRequest | null;
  teamDisplayName?: string;
  onClose: () => void;
};

const STATUS_LABEL: Record<ReimbursementRequestStatus, string> = {
  pending: 'Pending',
  needs_changes: 'Needs Change',
  approved: 'Submitted',
  in_progress_with_cornell: 'In Progress',
  settled: 'Settled'
};

const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const Field: React.FC<{ label: string; value: React.ReactNode; full?: boolean }> = ({
  label,
  value,
  full
}) => (
  <div className={`${styles.field} ${full ? styles.fieldFull : ''}`}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);

const RequestSummaryModal: React.FC<Props> = ({ open, request, teamDisplayName, onClose }) => {
  if (!request) return null;
  const attendees = request.attendees.filter((a) => a.trim().length > 0);
  return (
    <Modal open={open} onClose={onClose} size="small" className={styles.rounded}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Request Summary</h3>
          <span className={`${styles.statusPill} ${styles[`status_${request.status}`]}`}>
            {STATUS_LABEL[request.status]}
          </span>
        </div>
        <div className={styles.grid}>
          <Field label="Team" value={teamDisplayName ?? request.teamId} />
          <Field label="Amount" value={`$${request.amount}`} />
          <Field label="Date of Purchase" value={formatDate(request.dateOfPurchase)} />
          <Field label="Date Submitted" value={formatDate(request.dateSubmitted)} />
          <Field
            label="Phone"
            value={request.requesterPhoneNumber || <em className={styles.empty}>Not provided</em>}
          />
          <Field
            label="Address"
            value={request.requesterAddress || <em className={styles.empty}>Not provided</em>}
          />
          <Field
            full
            label="Reason"
            value={request.reason || <em className={styles.empty}>No reason provided</em>}
          />
          <Field
            full
            label="Attendees"
            value={
              attendees.length > 0 ? attendees.join(', ') : <em className={styles.empty}>None</em>
            }
          />
          <Field
            full
            label="Receipt"
            value={
              request.receiptUrl ? (
                <a
                  className={styles.receiptLink}
                  href={request.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {request.receiptUrl}
                </a>
              ) : (
                <em className={styles.empty}>No receipt attached</em>
              )
            }
          />
        </div>
        <div className={styles.footer}>
          <Button basic onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestSummaryModal;
