import React from 'react';
import styles from './ReimbursementDashboard.module.css';

type Props = {
  team: ReimbursementTeam;
};

const formatDollars = (amount: number): string => `$${amount.toLocaleString()}`;

const BudgetOverview: React.FC<Props> = ({ team }) => {
  const remaining = Math.max(team.budget - team.totalSpent, 0);
  const pct = team.budget > 0 ? Math.min((team.totalSpent / team.budget) * 100, 100) : 0;

  return (
    <section className={styles.card}>
      <h3 className={styles.cardTitle}>Budget Overview</h3>
      <div className={styles.budgetRow}>
        <div>
          <div className={styles.budgetSpent}>{formatDollars(team.totalSpent)}</div>
          <div className={styles.budgetSpentLabel}>out of {formatDollars(team.budget)} total</div>
        </div>
        <div className={styles.budgetRemainingWrap}>
          <div className={styles.budgetRemaining}>{formatDollars(remaining)}</div>
          <div className={styles.budgetRemainingLabel}>remaining</div>
        </div>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.progressLabels}>
        <span>$0</span>
        <span>{formatDollars(team.budget)}</span>
      </div>
    </section>
  );
};

export default BudgetOverview;
