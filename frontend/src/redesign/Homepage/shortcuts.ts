import { ClipboardTextIcon } from '../../design-system-2026/icons';
import { breadcrumbRoutes } from '../breadcrumbRoutes';

export const homeShortcutsStorageKey = (email?: string): string | undefined =>
  email ? `idol:home-shortcuts:${email}` : undefined;

const shortcutDefinitions = [
  {
    id: 'shoutouts',
    label: 'Shoutouts',
    description: 'Give someone a shoutout or view your past.',
    href: '/forms/shoutouts'
  },
  {
    id: 'tec',
    label: 'Team Event Credits',
    description: 'Track your team event credits.',
    href: '/forms/teamEventCredits'
  },
  {
    id: 'coffee',
    label: 'Coffee Chats',
    description: 'Submit your coffee chats.',
    href: '/forms/coffeeChats'
  },
  {
    id: 'portfolio',
    label: 'Dev Portfolio Assignments',
    description: 'Submit opened and reviewed pull requests.',
    href: '/forms/devPortfolio'
  },
  {
    id: 'alumni',
    label: 'Alumni',
    description: 'Stay connected with DTI alumni.',
    href: '/alumni'
  },
  {
    id: 'profile',
    label: 'Edit Profile',
    description: 'Edit your profile on DTI’s website.',
    href: '/forms/profile'
  }
] as const;

export const shortcuts = shortcutDefinitions.map((shortcut) => ({
  ...shortcut,
  icon: breadcrumbRoutes[shortcut.href].icon ?? ClipboardTextIcon
}));

export type ShortcutId = (typeof shortcuts)[number]['id'];
export const defaultShortcuts = shortcuts.map(({ id }) => id);

/** An empty selection is intentional; corrupt/old browser storage falls back to defaults. */
export function parseShortcuts(value: string | null): ShortcutId[] {
  if (value === null) return [...defaultShortcuts];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [...defaultShortcuts];
    return Array.from(
      new Set(parsed.filter((id): id is ShortcutId => shortcuts.some((item) => item.id === id)))
    );
  } catch {
    return [...defaultShortcuts];
  }
}

export function moveShortcut(items: ShortcutId[], id: ShortcutId, target: number): ShortcutId[] {
  const index = items.indexOf(id);
  if (index < 0 || target < 0 || target >= items.length) return items;
  const result = items.filter((item) => item !== id);
  result.splice(target, 0, id);
  return result;
}

/** Insert a shortcut at the visible boundary, accounting for its original row if present. */
export function dropShortcut(items: ShortcutId[], id: ShortcutId, slot: number): ShortcutId[] {
  if (slot < 0 || slot > items.length) return items;
  const index = items.indexOf(id);
  if (index >= 0) return moveShortcut(items, id, slot > index ? slot - 1 : slot);
  return [...items.slice(0, slot), id, ...items.slice(slot)];
}
