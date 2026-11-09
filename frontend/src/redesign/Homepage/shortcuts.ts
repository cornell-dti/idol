import {
  MegaphoneIcon,
  CalendarStarIcon,
  PencilSimpleLineIcon,
  CoffeeIcon,
  GitBranchIcon,
  GraduationCapIcon
} from '../../design-system-2026/icons';

export const shortcuts = [
  {
    id: 'shoutouts',
    label: 'Shoutouts',
    description: 'Give someone a shoutout or view your past.',
    href: '/forms/shoutouts',
    icon: MegaphoneIcon
  },
  {
    id: 'tec',
    label: 'Team Event Credits',
    description: 'Track your team event credits.',
    href: '/forms/teamEventCredits',
    icon: CalendarStarIcon
  },
  {
    id: 'profile',
    label: 'Edit Profile',
    description: 'Edit your profile on DTI’s website.',
    href: '/forms/profile',
    icon: PencilSimpleLineIcon
  },
  {
    id: 'coffee',
    label: 'Coffee Chats',
    description: 'Submit your coffee chats.',
    href: '/forms/coffeeChats',
    icon: CoffeeIcon
  },
  {
    id: 'portfolio',
    label: 'Dev Portfolio Assignments',
    description: 'Submit opened and reviewed pull requests.',
    href: '/forms/devPortfolio',
    icon: GitBranchIcon
  },
  {
    id: 'alumni',
    label: 'Alumni',
    description: 'Stay connected with DTI alumni.',
    href: '/alumni',
    icon: GraduationCapIcon
  }
] as const;

export type ShortcutId = (typeof shortcuts)[number]['id'];
export const defaultShortcuts: ShortcutId[] = ['shoutouts', 'tec', 'profile', 'coffee'];

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

/** Convert a visible boundary between rows into an index after removing the grabbed row. */
export function dropShortcut(items: ShortcutId[], id: ShortcutId, slot: number): ShortcutId[] {
  const index = items.indexOf(id);
  if (index < 0 || slot < 0 || slot > items.length) return items;
  return moveShortcut(items, id, slot > index ? slot - 1 : slot);
}
