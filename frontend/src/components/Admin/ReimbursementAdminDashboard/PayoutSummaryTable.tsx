import React from 'react';
import { Button } from 'semantic-ui-react';
import styles from './ReimbursementAdminDashboard.module.css';

type Props = {
  requests: ReimbursementRequest[];
  teamsById: Record<string, ReimbursementTeam>;
  onMarkPaid: (requestId: string) => Promise<void>;
  onUndo: (requestId: string) => Promise<void>;
};

const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const STATUS_LABEL: Partial<Record<ReimbursementRequestStatus, string>> = {
  approved: 'Pending Payout',
  in_progress_with_cornell: 'Pending Payout',
  settled: 'Paid Out'
};

const PayoutSummaryTable: React.FC<Props> = ({ requests, teamsById, onMarkPaid, onUndo }) => (
  <section className={styles.section}>
    <div className={styles.tableHeader}>
      <h2 className={styles.sectionTitle}>Payout Summary</h2>
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
              No requests awaiting payout.
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
                {r.status === 'settled' ? (
                  <Button basic onClick={() => onUndo(r.requestId)}>
                    Undo
                  </Button>
                ) : (
                  <Button primary onClick={() => onMarkPaid(r.requestId)}>
                    Mark paid
                  </Button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </section>
);

export default PayoutSummaryTable;
