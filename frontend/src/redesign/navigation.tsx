import type { SidebarEntry } from '../design-system-2026/components/Sidebar/Sidebar';
import {
  ClipboardTextIcon,
  HouseIcon,
  MegaphoneIcon,
  CalendarStarIcon,
  CoffeeIcon,
  GitBranchIcon,
  GraduationCapIcon
} from '../design-system-2026/icons';

export default function memberNavigation(pathname: string, iconSize = 16): SidebarEntry[] {
  const links = [
    { href: '/', label: 'Home', icon: <HouseIcon size={iconSize} /> },
    {
      href: '/forms/shoutouts',
      label: 'Shoutouts',
      icon: <MegaphoneIcon size={iconSize} aria-hidden />
    },
    {
      href: '/forms/teamEventCredits',
      label: 'Team Event Credits',
      icon: <CalendarStarIcon size={iconSize} aria-hidden />
    },
    {
      href: '/forms/coffeeChats',
      label: 'Coffee Chats',
      icon: <CoffeeIcon size={iconSize} aria-hidden />
    },
    {
      href: '/forms/devPortfolio',
      label: 'Dev Portfolio',
      icon: <GitBranchIcon size={iconSize} aria-hidden />
    },
    { href: '/alumni', label: 'Alumni', icon: <GraduationCapIcon size={iconSize} aria-hidden /> },
    { href: '/forms', label: 'Forms', icon: <ClipboardTextIcon size={iconSize} /> }
  ];
  return links.map((item) => ({
    ...item,
    id: item.href,
    selected:
      pathname === item.href ||
      (item.href === '/forms/devPortfolio' &&
        pathname.startsWith('/forms/dev-portfolio-submissions/')) ||
      (item.href !== '/' && item.href !== '/forms' && pathname.startsWith(`${item.href}/`))
  }));
}
