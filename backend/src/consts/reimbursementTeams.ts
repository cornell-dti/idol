/// <reference types="common-types" />

const TEAM_BUDGET = 300;

const makeTeam = (teamId: string, displayName: string): ReimbursementTeam => ({
  teamId,
  displayName,
  budget: TEAM_BUDGET,
  totalSpent: 0,
  assignedAdmins: []
});

const DEFAULT_REIMBURSEMENT_TEAMS: ReimbursementTeam[] = [
  makeTeam('biz-leads', 'Business Leads'),
  makeTeam('pm-leads', 'PM Leads'),
  makeTeam('ops-leads', 'Ops Leads'),
  makeTeam('design-leads', 'Design Leads'),
  makeTeam('dev-leads', 'Dev Leads'),
  makeTeam('loop', 'Loop'),
  makeTeam('cuapts', 'CU Apts'),
  makeTeam('curaise', 'CU Raise'),
  makeTeam('courseplan', 'CoursePlan'),
  makeTeam('idol', 'IDOL')
];

export default DEFAULT_REIMBURSEMENT_TEAMS;
