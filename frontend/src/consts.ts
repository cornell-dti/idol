export const REQUIRED_INITIATIVE_CREDITS = 1;
export const REQUIRED_MEMBER_TEC_CREDITS = 3;
export const REQUIRED_LEAD_TEC_CREDITS = 6;
export const TEC_DEADLINES = [
  new Date('2025-02-23'),
  new Date('2025-03-30'),
  new Date('2025-05-11')
];
export const MAX_TEC_PER_5_WEEKS = 1;
export const ALL_STATUS: Status[] = ['approved', 'pending', 'rejected'];
export const INITIATIVE_EVENTS = false;
export const ENABLE_COFFEE_CHAT = true;
export const ROUND_OPTIONS = [
  { key: 'behavioral', text: 'Behavioral', value: 'Behavioral' },
  { key: 'technical', text: 'Technical', value: 'Technical' },
  { key: 'resume', text: 'Resume', value: 'Resume' }
];
export const STATUS_OPTIONS = [
  { key: 'accepted', text: 'Accepted', value: 'Accepted' },
  { key: 'rejected', text: 'Rejected', value: 'Rejected' },
  { key: 'waitlisted', text: 'Waitlisted', value: 'Waitlisted' },
  { key: 'undecided', text: 'Undecided', value: 'Undecided' }
];

export const ROLE_OPTIONS = [
  { key: 'developer', text: 'Developer', value: 'Developer' },
  { key: 'product_manager', text: 'Product Manager', value: 'Product Manager' },
  { key: 'business', text: 'Business', value: 'Business' },
  { key: 'designer', text: 'Designer', value: 'Designer' }
];

export const DISPLAY_TO_ROLE_MAP: Record<string, GeneralRole> = {
  Developer: 'developer',
  Designer: 'designer',
  'Product Manager': 'pm',
  Business: 'business',
  Lead: 'lead'
};
