import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import NoteModal from './NoteModal';
import styles from './ReimbursementAdminDashboard.module.css';

type Props = {
  requests: ReimbursementRequest[];
  teamsById: Record<string, ReimbursementTeam>;
  onApprove: (requestId: string) => Promise<void>;
  onNeedsChange: (requestId: string, note: string) => Promise<void>;
  onAddNote: (requestId: string, note: string) => Promise<void>;
  onView: (requestId: string) => void;
  onViewAll: () => void;
};

const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const STATUS_LABEL: Partial<Record<ReimbursementRequestStatus, string>> = {
  pending: 'Pending',
  needs_changes: 'Needs Change'
};

type ModalState =
  | { kind: 'none' }
  | { kind: 'needsChange'; requestId: string }
  | { kind: 'note'; requestId: string };

const PendingRequestsTable: React.FC<Props> = ({
  requests,
  teamsById,
  onApprove,
  onNeedsChange,
  onAddNote,
  onView,
  onViewAll
}) => {
  const [modal, setModal] = useState<ModalState>({ kind: 'none' });

  return (
    <section className={styles.section}>
      <div className={styles.tableHeader}>
        <h2 className={styles.sectionTitle}>Pending Requests</h2>
        <Button basic onClick={onViewAll}>
          View all
        </Button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date Submitted</th>
            <th>Team</th>
            <th>Amount</th>
            <th>Status</th>
            <th className={styles.actionCol}>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyCell}>
                No pending requests.
              </td>
            </tr>
          ) : (
            requests.map((r) => (
              <tr key={r.requestId}>
                <td>{formatDate(r.dateSubmitted)}</td>
                <td>{teamsById[r.teamId]?.displayName ?? r.teamId}</td>
                <td className={styles.amountCell}>${r.amount}</td>
                <td>
                  <span className={`${styles.statusPill} ${styles[`status_${r.status}`]}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </td>
                <td className={styles.actionCol}>
                  <div className={styles.actionGroup}>
                    <button
                      type="button"
                      className={styles.actionApprove}
                      onClick={() => onApprove(r.requestId)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className={styles.actionNeedsChange}
                      onClick={() => setModal({ kind: 'needsChange', requestId: r.requestId })}
                    >
                      Needs Change
                    </button>
                    <button
                      type="button"
                      className={styles.actionNote}
                      onClick={() => setModal({ kind: 'note', requestId: r.requestId })}
                    >
                      Note
                    </button>
                    <button
                      type="button"
                      className={styles.viewLink}
                      onClick={() => onView(r.requestId)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <NoteModal
        open={modal.kind === 'needsChange'}
        title="Request changes"
        placeholder="Explain what needs to change..."
        confirmLabel="Send"
        requireNote
        onClose={() => setModal({ kind: 'none' })}
        onConfirm={async (note) => {
          if (modal.kind !== 'needsChange') return;
          await onNeedsChange(modal.requestId, note);
          setModal({ kind: 'none' });
        }}
      />
      <NoteModal
        open={modal.kind === 'note'}
        title="Add a note"
        placeholder="Add a note for the requester..."
        confirmLabel="Add"
        requireNote
        onClose={() => setModal({ kind: 'none' })}
        onConfirm={async (note) => {
          if (modal.kind !== 'note') return;
          await onAddNote(modal.requestId, note);
          setModal({ kind: 'none' });
        }}
      />
    </section>
  );
};

export default PendingRequestsTable;
