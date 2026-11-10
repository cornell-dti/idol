import type { Breadcrumb } from '../design-system-2026/components/Breadcrumbs/Breadcrumbs';

type Route = { label: string; parent?: string; supportsDarkTheme?: boolean };

/** Navigation hierarchy is explicit because several detail URLs are siblings of their list. */
export const breadcrumbRoutes: Record<string, Route> = {
  '/': { label: 'Home', supportsDarkTheme: true },
  '/forms': { label: 'Forms' },
  '/forms/signin': { label: 'Sign-In', parent: '/forms' },
  '/forms/profile': { label: 'Profile', parent: '/forms', supportsDarkTheme: true },
  '/forms/shoutouts': { label: 'Shoutouts', parent: '/forms', supportsDarkTheme: true },
  '/forms/teamEventCredits': {
    label: 'Team Event Credits',
    parent: '/forms',
    supportsDarkTheme: true
  },
  '/forms/devPortfolio': { label: 'Dev Portfolio', parent: '/forms', supportsDarkTheme: true },
  '/forms/dev-portfolio-submissions/[uuid]': {
    label: 'Portfolio',
    parent: '/forms/devPortfolio',
    supportsDarkTheme: true
  },
  '/forms/coffeeChats': { label: 'Coffee Chats', parent: '/forms', supportsDarkTheme: true },
  '/forms/coffeeChatCategories': {
    label: 'Coffee Chat Categories',
    parent: '/forms'
  },
  '/forms/reimbursement': { label: 'Reimbursement', parent: '/forms' },
  '/alumni': { label: 'Alumni' },
  '/candidate-decider': { label: 'Candidate Decider' },
  '/candidate-decider/[uuid]': { label: 'Instance', parent: '/candidate-decider' },
  '/interview-scheduler': { label: 'Interview Scheduler' },
  '/interview-scheduler/[uuid]': { label: 'Schedule', parent: '/interview-scheduler' },
  '/settings': { label: 'Settings', supportsDarkTheme: true },
  '/help': { label: 'Help', supportsDarkTheme: true },
  '/admin': { label: 'Admin' },
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
