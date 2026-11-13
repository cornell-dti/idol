import type { Breadcrumb } from '../design-system-2026/components/Breadcrumbs/Breadcrumbs';
import {
  CalendarIcon,
  CalendarStarIcon,
  ClipboardTextIcon,
  CoffeeIcon,
  GearIcon,
  GitBranchIcon,
  GraduationCapIcon,
  HouseIcon,
  MegaphoneIcon,
  QuestionIcon,
  ScalesIcon,
  UserIcon,
  UsersIcon
} from '../design-system-2026/icons';
import type { Icon } from '../design-system-2026/icons';

type Route = { label: string; icon?: Icon; parent?: string; supportsDarkTheme?: boolean };

/** Navigation hierarchy is explicit because several detail URLs are siblings of their list. */
export const breadcrumbRoutes: Record<string, Route> = {
  '/': { label: 'Home', icon: HouseIcon, supportsDarkTheme: true },
  '/forms': { label: 'Forms', icon: ClipboardTextIcon, supportsDarkTheme: true },
  '/forms/signin': { label: 'Sign-In', parent: '/forms' },
  '/forms/profile': { label: 'Profile', icon: UserIcon, parent: '/forms', supportsDarkTheme: true },
  '/forms/shoutouts': {
    label: 'Shoutouts',
    icon: MegaphoneIcon,
    parent: '/forms',
    supportsDarkTheme: true
  },
  '/forms/teamEventCredits': {
    label: 'Team Event Credits',
    icon: CalendarStarIcon,
    parent: '/forms',
    supportsDarkTheme: true
  },
  '/forms/devPortfolio': {
    label: 'Dev Portfolio',
    icon: GitBranchIcon,
    parent: '/forms',
    supportsDarkTheme: true
  },
  '/forms/dev-portfolio-submissions/[uuid]': {
    label: 'Portfolio',
    parent: '/forms/devPortfolio',
    supportsDarkTheme: true
  },
  '/forms/coffeeChats': {
    label: 'Coffee Chats',
    icon: CoffeeIcon,
    parent: '/forms',
    supportsDarkTheme: true
  },
  '/forms/coffeeChatCategories': {
    label: 'Coffee Chat Categories',
    parent: '/forms'
  },
  '/forms/reimbursement': { label: 'Reimbursement', parent: '/forms' },
  '/alumni': { label: 'Alumni', icon: GraduationCapIcon },
  '/candidate-decider': { label: 'Candidate Decider', icon: ScalesIcon },
  '/candidate-decider/[uuid]': { label: 'Instance', parent: '/candidate-decider' },
  '/interview-scheduler': { label: 'Interview Scheduler', icon: CalendarIcon },
  '/interview-scheduler/[uuid]': { label: 'Schedule', parent: '/interview-scheduler' },
  '/settings': { label: 'Settings', icon: GearIcon, supportsDarkTheme: true },
  '/help': { label: 'Help', icon: QuestionIcon, supportsDarkTheme: true },
  '/design-system-2026': { label: 'Design System' },
  '/design-system-2026/shell': { label: 'App Shell', parent: '/design-system-2026' },
  '/design-system-2026/homepage': { label: 'Home Preview', parent: '/design-system-2026' },
  '/admin': { label: 'Admin', icon: UsersIcon, supportsDarkTheme: true },
  '/admin/member-review': { label: 'Member Information Review', parent: '/admin' },
  '/admin/site-deployer': { label: 'Site Deployer', parent: '/admin' },
  '/admin/signin-creator': { label: 'Sign-In Creator', parent: '/admin' },
  '/admin/shoutouts': { label: 'Shoutouts', parent: '/admin', supportsDarkTheme: true },
  '/admin/edit': { label: 'Edit Users', parent: '/admin' },
  '/admin/teams/edit': { label: 'Edit Teams', parent: '/admin' },
  '/admin/team-events': { label: 'Team Events', parent: '/admin' },
  '/admin/team-events/dashboard': { label: 'Dashboard', parent: '/admin/team-events' },
  '/admin/team-event-details/[uuid]': { label: 'Event', parent: '/admin/team-events' },
  '/admin/candidate-decider': { label: 'Candidate Decider', parent: '/admin' },
  '/admin/dev-portfolio': { label: 'Dev Portfolio', parent: '/admin' },
  '/admin/dev-portfolio/[uuid]': { label: 'Portfolio', parent: '/admin/dev-portfolio' },
  '/admin/hidden': { label: 'Hidden Page', parent: '/admin' },
  '/admin/coffee-chats': { label: 'Coffee Chats', parent: '/admin' },
  '/admin/coffee-chats/dashboard': { label: 'Dashboard', parent: '/admin/coffee-chats' },
  '/admin/coffee-chat-details/[id]': { label: 'Category', parent: '/admin/coffee-chats' },
  '/admin/interview-scheduler': { label: 'Interview Scheduler', parent: '/admin' },
  '/admin/interview-status': { label: 'Interview Status', parent: '/admin' },
  '/admin/recruitment-timeline': { label: 'Recruitment Timeline', parent: '/admin' },
  '/admin/alumni-admin-view': { label: 'Alumni', parent: '/admin' },
  '/admin/reimbursement': { label: 'Reimbursement', parent: '/admin' }
};

export default function getBreadcrumbs(
  pathname: string,
  asPath: string,
  detailLabel?: string
): Breadcrumb[] {
  const route = breadcrumbRoutes[pathname];
  if (!route) return [{ id: pathname, label: 'Page', href: asPath }];
  const parents = route.parent ? getBreadcrumbs(route.parent, route.parent) : [];
  return [...parents, { id: pathname, label: detailLabel || route.label, href: asPath }];
}
