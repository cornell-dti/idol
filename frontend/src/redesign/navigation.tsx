import type { SidebarEntry } from '../design-system-2026/components/Sidebar/Sidebar';
import { ClipboardTextIcon } from '../design-system-2026/icons';
import { breadcrumbRoutes } from './breadcrumbRoutes';

const memberRoutes = [
  '/',
  '/forms/shoutouts',
  '/forms/teamEventCredits',
  '/forms/coffeeChats',
  '/forms/devPortfolio',
  '/alumni',
  '/forms'
];

export function navigationEntry(pathname: string, size: number) {
  return (href: string, label?: string): SidebarEntry => {
    const { label: routeLabel, icon: Icon = ClipboardTextIcon } = breadcrumbRoutes[href];
    return {
      id: href,
      href,
      label: label ?? routeLabel,
      icon: <Icon size={size} aria-hidden />,
      selected:
        pathname === href ||
        (href === '/forms/devPortfolio' && pathname.startsWith('/forms/dev-portfolio-submissions/')) ||
        (href !== '/' && href !== '/forms' && pathname.startsWith(`${href}/`))
    };
  };
}

export default function memberNavigation(pathname: string, iconSize = 16): SidebarEntry[] {
  const entry = navigationEntry(pathname, iconSize);
  return memberRoutes.map((href) => entry(href));
}
