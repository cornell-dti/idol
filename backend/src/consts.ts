const COFFEE_CHAT_BINGO_BOARD = [
  ['a DTI alum', 'plays an instrument', 'boba > coffee', 'switched majors'],
  ['from west coast', 'can cook a signature dish', 'Over 6ft', 'been on DTI for > 3 sem'],
  ['studied abroad', 'has been to more than 3 countries', 'a newbie', 'GymRat / GymBaddie'],
  ['likes anime', 'worked at a startup', 'not from the US', 'has over 3 siblings']
];

export default COFFEE_CHAT_BINGO_BOARD;

export const DISABLE_DELETE_ALL_COFFEE_CHATS = true;

export const DEFAULT_TEC_CONFIG: TECConfig = {
  periodEndDates: ['2026-02-22T23:59:59', '2026-03-19T23:59:59', '2026-05-04T23:59:59'],
  requiredMemberTecCredits: 1,
  requiredLeadTecCredits: 2
};

export const ALL_ROLES: Role[] = [
  'ops-lead',
  'product-lead',
  'dev-lead',
  'design-lead',
  'business-lead',
  'tpm',
  'pm',
  'apm',
  'developer',
  'designer',
  'business',
  'pm-advisor',
  'dev-advisor',
  'design-advisor',
  'business-advisor'
];

export const LEAD_ROLES: Role[] = [
  'ops-lead',
  'product-lead',
  'dev-lead',
  'design-lead',
  'business-lead'
];
export const ADVISOR_ROLES: Role[] = [
  'pm-advisor',
  'dev-advisor',
  'design-advisor',
  'business-advisor'
];
