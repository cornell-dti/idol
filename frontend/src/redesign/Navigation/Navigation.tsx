import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Drawer } from 'vaul';
import { Button, IconButton, useToast } from '../../design-system-2026/components';
import { useDesignSystemAppearance } from '../../design-system-2026/components/Theme/Theme';
import type { SidebarEntry } from '../../design-system-2026/components/Sidebar/Sidebar';
import { PencilSimpleLineIcon, XIcon, DotsThreeIcon } from '../../design-system-2026/icons';
import NavigationEditor from './NavigationEditor';
import { defaultNavigation, parseNavigation, compactNavigationLabel } from './preferences';
import styles from './Navigation.module.css';

/** Receives only permitted routes. A separate storage key isolates each member's preferences. */
export default function Navigation({
  items,
  storageKey,
  pageKey
}: {
  items: SidebarEntry[];
  storageKey?: string;
  pageKey: string;
}): JSX.Element {
  const { theme, accent } = useDesignSystemAppearance();
  const [selected, setSelected] = useState(defaultNavigation);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const toast = useToast();
  const [notice, setNotice] = useState('');
  const available = items.filter((item) => item.id !== '/');
  const allowed = available.map((item) => item.id);
  // Reconcile late-loading permissions without overwriting stored selections.
  const pinned = parseNavigation(JSON.stringify(selected), allowed);
  useEffect(() => {
    try {
      const stored: unknown = storageKey
        ? JSON.parse(localStorage.getItem(storageKey) ?? 'null')
        : null;
      setSelected(
        Array.isArray(stored)
          ? stored.filter((id): id is string => typeof id === 'string')
          : defaultNavigation
      );
    } catch {
      setSelected(defaultNavigation);
    }
    setReady(true);
  }, [storageKey]);
  useEffect(() => {
    setOpen(false);
  }, [pageKey]);
  const home = items.find((item) => item.id === '/');
  const links = [home, ...pinned.map((id) => items.find((item) => item.id === id))].filter(
    (item): item is SidebarEntry => Boolean(item)
  );
  const moreItems = available.filter((item) => !pinned.includes(item.id));
  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (next) {
      setEditing(false);
      setNotice('');
    }
  };
  return (
    <Drawer.Root open={open} onOpenChange={changeOpen} shouldScaleBackground={false} autoFocus>
      <div className={styles.bar}>
        <nav className={styles.navbar} aria-label="Main navigation">
          {links.map((item) => (
            <Link href={item.href ?? item.id} key={item.id}>
              <a
                href={item.href ?? item.id}
                aria-label={item.label}
                aria-current={item.selected ? 'page' : undefined}
                className={styles.navItem}
              >
                <span className={styles.navIcon} aria-hidden>
                  {item.icon}
                </span>
                <span>{compactNavigationLabel(item.id, item.label)}</span>
              </a>
            </Link>
          ))}
          <Drawer.Trigger
            className={styles.navItem}
            data-selected={moreItems.some((item) => item.selected) || undefined}
          >
            <span className={styles.navIcon}>
              <DotsThreeIcon size={24} aria-hidden />
            </span>
            <span>More</span>
          </Drawer.Trigger>
        </nav>
      </div>
      <Drawer.Portal>
        <Drawer.Overlay className={styles.overlay} />
        <Drawer.Content
          className={styles.drawer}
          data-idol-redesign
          data-idol-theme={theme}
          data-idol-accent={accent}
        >
          <Drawer.Handle className={styles.handle} aria-label="Drag to close navigation" />
          <div className={styles.drawerHeading}>
            <div>
              <Drawer.Title className={styles.title}>Explore IDOL</Drawer.Title>
            </div>
            <Drawer.Close asChild>
              <IconButton
                variant="tertiary"
                aria-label="Close navigation"
                icon={<XIcon size={20} />}
              />
            </Drawer.Close>
          </div>
          {editing ? (
            <NavigationEditor
              items={available}
              selected={pinned}
              onCancel={() => setEditing(false)}
              onSave={(next) => {
                setSelected(next);
                setEditing(false);
                try {
                  if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
                  setNotice('');
                  setOpen(false);
                  toast.add({ title: 'Navbar saved.' });
                } catch {
                  setNotice('Navbar updated for this session. Browser storage is unavailable.');
                }
              }}
            />
          ) : (
            <>
              <nav className={styles.pageGrid} aria-label="More pages" data-vaul-no-drag>
                {moreItems.map((item) => (
                  <Link href={item.href ?? item.id} key={item.id}>
                    <a
                      href={item.href ?? item.id}
                      className={styles.page}
                      aria-current={item.selected ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span className={styles.pageIcon} aria-hidden>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </Link>
                ))}
              </nav>
              {notice && (
                <p className={styles.description} role="status">
                  {notice}
                </p>
              )}
              <div className={styles.drawerFooter}>
                <Button
                  variant="secondary"
                  disabled={!ready}
                  icon={<PencilSimpleLineIcon size={16} />}
                  onClick={() => setEditing(true)}
                >
                  Edit navbar
                </Button>
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
