import React, { useEffect, useMemo, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import ReimbursementAPI from '../../../API/ReimbursementAPI';
import TeamBudgetCard from './TeamBudgetCard';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ReimbursementAPI.getAllTeams().then((allTeams) => {
      setTeams(allTeams);
      setLoading(false);
    });
  }, []);

  const { orgTeams, productTeams } = useMemo(() => {
    const org: ReimbursementTeam[] = [];
    const product: ReimbursementTeam[] = [];
    teams.forEach((team) => {
      if (team.teamId.endsWith('-leads')) org.push(team);
      else product.push(team);
    });
    return { orgTeams: org, productTeams: product };
  }, [teams]);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      {loading ? (
        <Loader active inline="centered" content="Loading teams..." />
      ) : (
        <>
          <CollapsibleSection
            title="Org Spending Overview"
            teams={orgTeams}
            colorFor={(team) => ORG_COLORS[team.teamId]}
            emptyMessage="No org teams found."
          />
          <CollapsibleSection
            title="Product Spending Overview"
            teams={productTeams}
            emptyMessage="No product teams found."
          />
        </>
      )}
    </div>
  );
};

export default ReimbursementAdminDashboard;
