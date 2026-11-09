import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import ReimbursementAPI from '../../../API/ReimbursementAPI';
import TeamBudgetCard from './TeamBudgetCard';
import PendingRequestsTable from './PendingRequestsTable';
import { Emitters } from '../../../utils';
import styles from './ReimbursementAdminDashboard.module.css';

const ORG_COLORS: Record<string, string> = {
  'dev-leads': '#22c55e',
  'design-leads': '#3b82f6',
  'pm-leads': '#8b5cf6',
  'biz-leads': '#f59e0b',
  'ops-leads': '#ec4899'
};

type SectionProps = {
  title: string;
  teams: ReimbursementTeam[];
  colorFor?: (team: ReimbursementTeam) => string | undefined;
  emptyMessage: string;
};

const CollapsibleSection: React.FC<SectionProps> = ({ title, teams, colorFor, emptyMessage }) => {
  const [open, setOpen] = useState(true);
  return (
    <section className={styles.section}>
      <div
        className={styles.sectionHeader}
        onClick={() => setOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen((prev) => !prev);
        }}
      >
        <h2 className={styles.sectionTitle}>{title}</h2>
        <button type="button" className={styles.chevron} aria-label={open ? 'Collapse' : 'Expand'}>
          {open ? '▲' : '▼'}
        </button>
      </div>
      {open &&
        (teams.length > 0 ? (
          <div className={styles.grid}>
            {teams.map((team) => (
              <TeamBudgetCard key={team.teamId} team={team} progressColor={colorFor?.(team)} />
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>{emptyMessage}</p>
        ))}
    </section>
  );
};

const ReimbursementAdminDashboard: React.FC = () => {
  const [teams, setTeams] = useState<ReimbursementTeam[]>([]);
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [allTeams, allRequests] = await Promise.all([
      ReimbursementAPI.getAllTeams(),
      ReimbursementAPI.getAllRequests()
    ]);
    setTeams(allTeams);
    setRequests(allRequests);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const { orgTeams, productTeams } = useMemo(() => {
    const org: ReimbursementTeam[] = [];
    const product: ReimbursementTeam[] = [];
    teams.forEach((team) => {
      if (team.teamId.endsWith('-leads')) org.push(team);
      else product.push(team);
    });
    return { orgTeams: org, productTeams: product };
  }, [teams]);

  const teamsById = useMemo(() => {
    const map: Record<string, ReimbursementTeam> = {};
    teams.forEach((t) => {
      map[t.teamId] = t;
    });
    return map;
  }, [teams]);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === 'pending' || r.status === 'needs_changes'),
    [requests]
  );

  const handleStatusUpdate = async (
    requestId: string,
    status: ReimbursementRequestStatus,
    note = '',
    successMsg = ''
  ) => {
    try {
      await ReimbursementAPI.updateRequestStatus(requestId, status, note);
      if (successMsg) {
        Emitters.generalSuccess.emit({ headerMsg: successMsg, contentMsg: '' });
      }
      await loadData();
    } catch (err) {
      Emitters.generalError.emit({
        headerMsg: "Couldn't update request",
        contentMsg: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  const handleApprove = (requestId: string) =>
    handleStatusUpdate(requestId, 'approved', 'Approved', 'Request approved');

  const handleNeedsChange = (requestId: string, note: string) =>
    handleStatusUpdate(requestId, 'needs_changes', note, 'Changes requested');

  const handleAddNote = async (requestId: string, note: string) => {
    try {
      await ReimbursementAPI.addMessage(requestId, note);
      Emitters.generalSuccess.emit({ headerMsg: 'Note added', contentMsg: '' });
      await loadData();
    } catch (err) {
      Emitters.generalError.emit({
        headerMsg: "Couldn't add note",
        contentMsg: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  const handleView = (_requestId: string) => {
    // Detail view comes later.
  };

  const handleViewAll = () => {
    // "View all" page comes later.
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      {loading ? (
        <Loader active inline="centered" content="Loading..." />
      ) : (
        <>
          <CollapsibleSection
            title="Org Spending Overview"
            teams={orgTeams}
            colorFor={(team) => ORG_COLORS[team.teamId]}
            emptyMessage="You do not have permission to view this."
          />
          <CollapsibleSection
            title="Product Spending Overview"
            teams={productTeams}
            emptyMessage="You do not have permission to view this."
          />
          <PendingRequestsTable
            requests={pendingRequests}
            teamsById={teamsById}
            onApprove={handleApprove}
            onNeedsChange={handleNeedsChange}
            onAddNote={handleAddNote}
            onView={handleView}
            onViewAll={handleViewAll}
          />
        </>
      )}
    </div>
  );
};

export default ReimbursementAdminDashboard;
