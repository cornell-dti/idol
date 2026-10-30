import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AppShell, Breadcrumbs, DesignSystemScope, Sidebar } from '../../design-system-2026/components';
import {
  CalendarBlankIcon,
  CalendarIcon,
  CodeIcon,
  CoffeeIcon,
  GearIcon,
  GraduationCapIcon,
  HouseIcon,
  LinkIcon,
  ListChecksIcon,
  MegaphoneIcon,
  QuestionIcon,
  RocketLaunchIcon,
  ScalesIcon,
  UserIcon,
  UsersIcon
} from '../../design-system-2026/icons';
import type { Icon } from '../../design-system-2026/icons';
import styles from '../../design-system/ShellPreview.module.css';

const mainEntries: [string, Icon][] = [
  ['Home', HouseIcon],
  ['Shoutouts', MegaphoneIcon],
  ['Team Event Credits', CalendarBlankIcon],
  ['Coffee Chats', CoffeeIcon],
  ['Dev Portfolio', CodeIcon],
  ['Alumni', GraduationCapIcon]
];
const adminEntries: [string, Icon][] = [
  ['Member Information Review', ListChecksIcon],
  ['Site Deployer', RocketLaunchIcon],
  ['Sign-in Creator', LinkIcon],
  ['View Shoutouts', MegaphoneIcon],
  ['Edit Users', UserIcon],
  ['Edit Teams', UsersIcon],
  ['Edit Team Events', CalendarBlankIcon],
  ['Edit Candidate Deciders', ScalesIcon],
  ['Dev Portfolios', CodeIcon],
  ['Review Coffee Chats', CoffeeIcon],
  ['Edit Interview Scheduler', CalendarIcon],
  ['Edit Alumni', GraduationCapIcon]
];
export default function ShellPreview(): JSX.Element {
  const [minimized, setMinimized] = useState(false);
  const [selected, setSelected] = useState('Home');

  useEffect(() => {
    const compact = window.matchMedia('(max-width: 760px)');
    const resize = () => setMinimized(compact.matches);
    resize();
    compact.addEventListener('change', resize);
    return () => compact.removeEventListener('change', resize);
  }, []);

  const entries = (items: [string, Icon][]) =>
    items.map(([label, IconComponent]) => ({
      id: label,
      label,
      selected: label === selected,
      icon: <IconComponent size={16} aria-hidden="true" />,
      onClick: () => {
        setSelected(label);
      }
    }));
  return (
    <DesignSystemScope>
      <Head>
        <title>Shell preview · IDOL</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AppShell
        sidebar={
          <Sidebar
            id="shell-navigation"
            label="IDOL navigation"
            minimized={minimized}
            onMinimizedChange={setMinimized}
            sections={[
              { id: 'main', label: 'Main', items: entries(mainEntries) },
              { id: 'admin', label: 'Admin', items: entries(adminEntries) }
            ]}
            footerItems={entries([
              ['Help', QuestionIcon],
              ['Settings', GearIcon]
            ])}
            profile={{
              name: 'Clément Rozé',
              src: '/design-system/figma/profile-clement.png',
              onClick: () => {
                setSelected('Profile');
              }
            }}
          />
        }
        header={
          <Breadcrumbs
            items={[
              { id: 'design-system', label: 'Design system', href: '/design-system-2026' },
              { id: 'shell', label: 'Shell', href: '/design-system-2026/shell' },
              { id: 'current', label: selected, href: '#shell-content' }
            ]}
          />
        }
      >
        <div className={styles.page}>
          <h1 className="idol-heading-1">{selected}</h1>
        </div>
      </AppShell>
    </DesignSystemScope>
  );
}

export const getStaticProps: GetStaticProps = () => ({
  notFound: process.env.NODE_ENV !== 'development',
  props: {}
});
