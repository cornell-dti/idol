import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button as BaseButton } from '@base-ui/react/button';
import { Avatar } from '../Avatar/Avatar';
import { IconButton } from '../Button/Button';
import { Input } from '../Input/Input';
import { Menu } from '../Menu/Menu';
import { useDesignSystemAppearance } from '../Theme/Theme';
import { MagnifyingGlassIcon, SidebarIcon } from '../../icons';
import styles from './Sidebar.module.css';

export type SidebarItemProps = Omit<BaseButton.Props, 'className' | 'children'> & {
  label: string;
  secondaryLabel?: string;
  icon: ReactNode;
  selected?: boolean;
  minimized?: boolean;
  size?: 'default' | 'large';
  href?: string;
  onClick?: () => void;
  loading?: boolean;
};

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    {
      label,
      secondaryLabel,
      icon,
      selected = false,
      minimized = false,
      size = 'default',
      href,
      onClick,
      loading = false,
      ...buttonProps
    },
    ref
  ) => {
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
    if (loading) return <div className={className}>{content}</div>;
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
        {...buttonProps}
        ref={ref}
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
);

export type SidebarEntry = Omit<SidebarItemProps, 'minimized' | 'size' | 'loading'> & {
  id: string;
};
export type SidebarSection = { id: string; label: string; items: readonly SidebarEntry[] };
export type SidebarProps = {
  id: string;
  label?: string;
  sections: readonly SidebarSection[];
  footerItems?: readonly SidebarEntry[];
  footer?: ReactNode;
  searchControl?: ReactNode;
  loading?: boolean;
  profile: { name: string; src?: string; onClick?: () => void; menu?: ReactNode };
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
  footer,
  searchControl,
  loading = false,
  profile,
  minimized,
  onMinimizedChange,
  theme
}: SidebarProps): JSX.Element {
  const appearance = useDesignSystemAppearance();
  const [query, setQuery] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const focusSearch = useRef(false);
  useEffect(() => {
    if (!minimized && focusSearch.current) {
      search.current?.focus();
      focusSearch.current = false;
    }
  }, [minimized]);
  const profileItem = (
    <SidebarItem
      label="Profile"
      secondaryLabel={profile.name}
      size="large"
      minimized={minimized}
      loading={loading}
      icon={<Avatar name={profile.name} src={loading ? undefined : profile.src} decorative />}
      onClick={profile.onClick}
    />
  );
  const normalized = loading ? '' : query.trim().toLowerCase();
  const filtered = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.label.toLowerCase().includes(normalized))
    }))
    .filter((section) => section.items.length);
  return (
    <aside
      data-idol-redesign
      data-idol-theme={theme ?? appearance.theme}
      data-idol-accent={appearance.accent}
      aria-label={loading ? 'Loading navigation' : label}
      aria-busy={loading || undefined}
      className={`${styles.sidebar} ${minimized ? styles.minimized : ''} ${
        loading ? styles.loading : ''
      }`}
    >
      <div className={styles.top} aria-hidden={loading || undefined}>
        <div className={styles.header}>
          {loading ? (
            <span className={styles.logoPlaceholder} />
          ) : (
            <img
              src="/design-system/figma/idol-logo.png"
              alt="IDOL"
              width={32}
              height={32}
              aria-hidden={minimized || undefined}
            />
          )}
          <IconButton
            variant="tertiary"
            disabled={loading}
            aria-label={minimized ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!minimized}
            aria-controls={`${id}-navigation`}
            icon={<SidebarIcon size={16} aria-hidden="true" />}
            onClick={() => onMinimizedChange(!minimized)}
          />
        </div>
        {searchControl ? (
          searchControl
        ) : minimized ? (
          <IconButton
            variant="secondary"
            disabled={loading}
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
            disabled={loading}
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
      <nav
        id={`${id}-navigation`}
        aria-label={`${label} sections`}
        aria-hidden={loading || undefined}
        className={styles.navigation}
      >
        {filtered.map((section) => (
          <div key={section.id} className={styles.group}>
            <p className={styles.category} aria-hidden={minimized || undefined}>
              <span>{section.label}</span>
            </p>
            {section.items.map(({ id: itemId, ...item }) => (
              <SidebarItem key={itemId} {...item} minimized={minimized} loading={loading} />
            ))}
          </div>
        ))}
        {!filtered.length && !minimized && <p className={styles.empty}>No matching pages.</p>}
      </nav>
      <div className={styles.footer} aria-hidden={loading || undefined}>
        {footer}
        {footerItems.map(({ id: itemId, ...item }) => (
          <SidebarItem key={itemId} {...item} minimized={minimized} loading={loading} />
        ))}
        {profile.menu && !loading ? (
          <Menu
            trigger={profileItem}
            origin="bottom-left"
            matchTriggerWidth={!minimized}
            side="top"
            aria-label="Account menu"
          >
            {profile.menu}
          </Menu>
        ) : (
          profileItem
        )}
      </div>
    </aside>
  );
}
