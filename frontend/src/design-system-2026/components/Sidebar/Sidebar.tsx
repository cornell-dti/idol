import { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button as BaseButton } from '@base-ui/react/button';
import { Avatar } from '../Avatar/Avatar';
import { IconButton } from '../Button/Button';
import { Input } from '../Input/Input';
import { MagnifyingGlassIcon, SidebarIcon } from '../../icons';
import styles from './Sidebar.module.css';

export type SidebarItemProps = {
  label: string;
  secondaryLabel?: string;
  icon: ReactNode;
  selected?: boolean;
  minimized?: boolean;
  size?: 'default' | 'large';
  href?: string;
  onClick?: () => void;
};

export function SidebarItem({
  label,
  secondaryLabel,
  icon,
  selected = false,
  minimized = false,
  size = 'default',
  href,
  onClick
}: SidebarItemProps): JSX.Element {
  const className = `${styles.item} ${selected ? styles.selected : ''} ${
    minimized ? styles.minimizedItem : ''
  } ${size === 'large' ? styles.largeItem : ''}`;
  const content = (
    <>
      <span className={styles.itemIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.itemLabels} aria-hidden={minimized || undefined}>
        <span>{label}</span>
        {size === 'large' && secondaryLabel && (
          <span className={styles.secondaryLabel}>{secondaryLabel}</span>
        )}
      </span>
    </>
  );
  const name = secondaryLabel ? `${label}: ${secondaryLabel}` : label;
  if (href)
    return (
      <Link href={href}>
        <a
          href={href}
          className={className}
          onClick={onClick}
          aria-current={selected ? 'page' : undefined}
          aria-label={minimized ? name : undefined}
          title={minimized ? name : undefined}
        >
          {content}
        </a>
      </Link>
    );
  return (
    <BaseButton
      type="button"
      className={className}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={minimized ? name : undefined}
      title={minimized ? name : undefined}
    >
      {content}
    </BaseButton>
  );
}

export type SidebarEntry = Omit<SidebarItemProps, 'minimized' | 'size'> & { id: string };
export type SidebarSection = { id: string; label: string; items: readonly SidebarEntry[] };
export type SidebarProps = {
  id: string;
  label?: string;
  sections: readonly SidebarSection[];
  footerItems?: readonly SidebarEntry[];
  profile: { name: string; src?: string; onClick: () => void };
  minimized: boolean;
  onMinimizedChange: (minimized: boolean) => void;
  theme?: 'light' | 'dark';
};

/** Supply only entries the current user may access; this component does not decide permissions. */
export function Sidebar({
  id,
  label = 'IDOL navigation',
  sections,
  footerItems = [],
  profile,
  minimized,
  onMinimizedChange,
  theme = 'light'
}: SidebarProps): JSX.Element {
  const [query, setQuery] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const focusSearch = useRef(false);
  useEffect(() => {
    if (!minimized && focusSearch.current) {
      search.current?.focus();
      focusSearch.current = false;
    }
  }, [minimized]);
  const normalized = query.trim().toLowerCase();
  const filtered = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.label.toLowerCase().includes(normalized))
    }))
    .filter((section) => section.items.length);
  return (
    <aside
      data-idol-redesign
      data-idol-theme={theme}
      aria-label={label}
      className={`${styles.sidebar} ${minimized ? styles.minimized : ''}`}
    >
      <div className={styles.top}>
        <div className={styles.header}>
          <img
            src="/design-system/figma/idol-logo.png"
            alt="IDOL"
            width={32}
            height={32}
            aria-hidden={minimized || undefined}
          />
          <IconButton
            variant="tertiary"
            aria-label={minimized ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!minimized}
            aria-controls={`${id}-navigation`}
            icon={<SidebarIcon size={16} aria-hidden="true" />}
            onClick={() => onMinimizedChange(!minimized)}
          />
        </div>
        {minimized ? (
          <IconButton
            variant="secondary"
            aria-label="Search navigation"
            icon={<MagnifyingGlassIcon size={16} aria-hidden="true" />}
            className={styles.searchButton}
            onClick={() => {
              focusSearch.current = true;
              onMinimizedChange(false);
            }}
          />
        ) : (
          <Input
            ref={search}
            id={`${id}-search`}
            type="search"
            aria-label="Search navigation"
            placeholder="Search"
            shape="pill"
            icon={<MagnifyingGlassIcon size={16} aria-hidden="true" />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        )}
      </div>
      <nav id={`${id}-navigation`} aria-label={`${label} sections`} className={styles.navigation}>
        {filtered.map((section) => (
          <div key={section.id} className={styles.group}>
            <p className={styles.category} aria-hidden={minimized || undefined}>
              {section.label}
            </p>
            {section.items.map(({ id: itemId, ...item }) => (
              <SidebarItem key={itemId} {...item} minimized={minimized} />
            ))}
          </div>
        ))}
        {!filtered.length && !minimized && <p className={styles.empty}>No matching pages.</p>}
      </nav>
      <div className={styles.footer}>
        {footerItems.map(({ id: itemId, ...item }) => (
          <SidebarItem key={itemId} {...item} minimized={minimized} />
        ))}
        <SidebarItem
          label="Profile"
          secondaryLabel={profile.name}
          size="large"
          minimized={minimized}
          icon={<Avatar name={profile.name} src={profile.src} decorative />}
          onClick={profile.onClick}
        />
      </div>
    </aside>
  );
}
