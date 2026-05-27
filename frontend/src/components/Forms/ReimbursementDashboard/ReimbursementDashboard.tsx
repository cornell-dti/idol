import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import BudgetOverview from './BudgetOverview';
import RequestsTable from './RequestsTable';
import SubmitRequestModal from './SubmitRequestModal';
import { mockReimbursementRequests, mockReimbursementTeam } from './mockData';
import styles from './ReimbursementDashboard.module.css';

const ReimbursementDashboard: React.FC = () => {
  const team = mockReimbursementTeam;
  const requests = mockReimbursementRequests;
  const [submitOpen, setSubmitOpen] = useState(false);

  const handleView = (_requestId: string) => {
    // Detail view comes later.
  };

  const handleViewAll = () => {
    // "View all" page comes later.
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Requestor Dashboard</h1>
        <Button primary className={styles.submitButton} onClick={() => setSubmitOpen(true)}>
          Submit new request
        </Button>
      </header>

      <div className={styles.grid}>
        <BudgetOverview team={team} />
        <RequestsTable requests={requests} onView={handleView} onViewAll={handleViewAll} />
      </div>

      <SubmitRequestModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
};

export default ReimbursementDashboard;
