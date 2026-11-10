import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import {
  AppShell,
  DesignSystemScope,
  MenuItem,
  Sidebar,
  ToastProvider
} from '../../design-system-2026/components';
import HomepageView from '../../redesign/Homepage/HomepageView';
import memberNavigation from '../../redesign/navigation';
import Navigation from '../../redesign/Navigation/Navigation';
import ProfileMenu from '../../redesign/Navigation/ProfileMenu';
import useMobileNavigation from '../../redesign/Navigation/useMobileNavigation';
import {
  CalendarIcon,
  GearIcon,
  QuestionIcon,
  UserIcon,
  UsersIcon
} from '../../design-system-2026/icons';
import styles from '../../redesign/Navigation/Navigation.module.css';

/** Isolated, development-only visual fixture. It never requests or writes member data. */
export default function HomepagePreview({ animateHome }: { animateHome?: boolean }): JSX.Element {
  const mobile = useMobileNavigation();
  const [minimized, setMinimized] = useState(false);
  return (
    <DesignSystemScope>
      <ToastProvider>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <AppShell
          flush={mobile}
          animateNavigation={animateHome}
          sidebar={
            !mobile && (
              <Sidebar
                id="homepage-preview-navigation"
                minimized={minimized}
                onMinimizedChange={setMinimized}
                sections={[{ id: 'main', label: 'Main', items: memberNavigation('/') }]}
                profile={{
                  name: 'Clément Rozé',
                  src: '/design-system/figma/profile-clement.png',
                  menu: (
                    <>
                      <MenuItem>Profile</MenuItem>
                      <MenuItem>Settings</MenuItem>
                      <MenuItem>Help</MenuItem>
                    </>
                  )
                }}
              />
            )
          }
          header={
            mobile ? (
              <>
                <a href="/design-system-2026/homepage" className={styles.brand}>
                  <img src="/design-system/figma/idol-logo.png" alt="" width={32} height={32} />
                  <span>IDOL</span>
                </a>
                <ProfileMenu name="Clément Rozé" src="/design-system/figma/profile-clement.png">
                  <MenuItem icon={<UserIcon size={16} />}>Profile</MenuItem>
                  <MenuItem icon={<GearIcon size={16} />}>Settings</MenuItem>
                  <MenuItem icon={<QuestionIcon size={16} />}>Help</MenuItem>
                </ProfileMenu>
              </>
            ) : null
          }
          navigation={
            mobile && (
              <Navigation
                pageKey="/"
                storageKey="idol:navbar:design-preview"
                items={[
                  ...memberNavigation('/', 24),
                  { id: '/admin', href: '/admin', label: 'Admin', icon: <UsersIcon size={24} /> },
                  {
                    id: '/interview-scheduler',
                    href: '/interview-scheduler',
                    label: 'Interview Scheduler',
                    icon: <CalendarIcon size={24} />
                  },
                  {
                    id: '/forms/profile',
                    href: '/forms/profile',
                    label: 'Edit Profile',
                    icon: <UserIcon size={24} />
                  },
                  {
                    id: '/settings',
                    href: '/settings',
                    label: 'Settings',
                    icon: <GearIcon size={24} />
                  },
                  { id: '/help', href: '/help', label: 'Help', icon: <QuestionIcon size={24} /> }
                ]}
              />
            )
          }
        >
          <HomepageView
            name="Clément Rozé"
            storageKey="idol:home-shortcuts:design-preview"
            onRetry={() => {}}
            summary={{
              coffee: {
                metrics: [
                  { label: 'Submitted', value: 6 },
                  { label: 'Pending', value: 2 },
                  { label: 'Rejected', value: 0 }
                ]
              },
              tec: {
                metrics: [
                  { label: 'Deadline 1', value: 'Oct 9' },
                  { label: 'Internal', value: 0.5 },
                  { label: 'External', value: 1 }
                ]
              },
              shoutouts: {
                metrics: [
                  { label: 'Sent', value: 32 },
                  { label: 'Received', value: 13 }
                ]
              }
            }}
          />
        </AppShell>
      </ToastProvider>
    </DesignSystemScope>
  );
}

export const getStaticProps: GetStaticProps = () => ({
  notFound: process.env.NODE_ENV !== 'development',
  props: {}
});
