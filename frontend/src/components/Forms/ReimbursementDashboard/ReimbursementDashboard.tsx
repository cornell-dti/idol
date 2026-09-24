import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Loader } from 'semantic-ui-react';
import BudgetOverview from './BudgetOverview';
import RequestsTable from './RequestsTable';
import SubmitRequestModal from './SubmitRequestModal';
import ReimbursementAPI from '../../../API/ReimbursementAPI';
import { useSelf } from '../../Common/FirestoreDataProvider';
import styles from './ReimbursementDashboard.module.css';

const ReimbursementDashboard: React.FC = () => {
  const user = useSelf()!;
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [teams, setTeams] = useState<ReimbursementTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitOpen, setSubmitOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [reqs, allTeams] = await Promise.all([
      ReimbursementAPI.getMyRequests(),
      ReimbursementAPI.getAllTeams()
    ]);
    setRequests(reqs);
    setTeams(allTeams);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const myTeams = useMemo(() => {
    const subteams = new Set(user.subteams.map((s) => s.toLowerCase()));
    const isLead = subteams.has('leads');
    return teams.filter((t) => {
      const name = t.teamName.toLowerCase();
      if (subteams.has(name)) return true;
      if (isLead && name.endsWith('-leads')) return true;
      return false;
    });
  }, [teams, user.subteams]);

  const handleView = (_requestId: string) => {
    // Detail view comes later.
  };

  const handleViewAll = () => {
    // "View all" page comes later.
  };

  const handleRequestSubmitted = () => {
    setSubmitOpen(false);
    loadData();
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Requestor Dashboard</h1>
        <Button primary className={styles.submitButton} onClick={() => setSubmitOpen(true)}>
          Submit new request
        </Button>
      </header>

      {loading ? (
        <Loader active inline="centered" content="Loading requests..." />
      ) : (
        <div className={styles.grid}>
          {myTeams.length > 0 ? (
            myTeams.map((team) => <BudgetOverview key={team.teamId} team={team} />)
          ) : (
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Budget Overview</h3>
              <p>You are not assigned to any reimbursement team.</p>
            </section>
          )}
          <RequestsTable requests={requests} onView={handleView} onViewAll={handleViewAll} />
        </div>
      )}

      <SubmitRequestModal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmitted={handleRequestSubmitted}
        teams={myTeams}
      />
    </div>
  );
};

export default ReimbursementDashboard;
