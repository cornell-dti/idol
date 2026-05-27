import React from 'react';
import { Button } from 'semantic-ui-react';
import styles from './ReimbursementDashboard.module.css';

type Props = {
  requests: ReimbursementRequest[];
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

const STATUS_LABEL: Record<ReimbursementRequestStatus, string> = {
  pending: 'Pending',
  needs_changes: 'Needs Change',
  approved: 'Submitted',
  in_progress_with_cornell: 'In Progress',
  settled: 'Settled'
};

const StatusPill: React.FC<{ status: ReimbursementRequestStatus }> = ({ status }) => (
  <span className={`${styles.statusPill} ${styles[`status_${status}`]}`}>
    {STATUS_LABEL[status]}
  </span>
);

const RequestsTable: React.FC<Props> = ({ requests, onView, onViewAll }) => (
  <section className={styles.card}>
    <div className={styles.tableHeader}>
      <h3 className={styles.cardTitle}>My Requests</h3>
      <Button basic onClick={onViewAll}>
        View all
      </Button>
    </div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Date Submitted</th>
          <th>Date of Purchase</th>
          <th>Amount</th>
          <th>Status</th>
          <th className={styles.actionCol}>Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <tr key={r.requestId}>
            <td>{formatDate(r.dateSubmitted)}</td>
            <td>{formatDate(r.dateOfPurchase)}</td>
            <td className={styles.amountCell}>${r.amount}</td>
            <td>
              <StatusPill status={r.status} />
            </td>
            <td className={styles.actionCol}>
              <button type="button" className={styles.viewLink} onClick={() => onView(r.requestId)}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default RequestsTable;
