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
import HomeSearch from '../../redesign/Homepage/HomeSearch';
import memberNavigation, { navigationEntry } from '../../redesign/navigation';
import Navigation from '../../redesign/Navigation/Navigation';
import ProfileMenu from '../../redesign/Navigation/ProfileMenu';
import useMobileNavigation from '../../redesign/Navigation/useMobileNavigation';
import styles from '../../redesign/Navigation/Navigation.module.css';

/** Isolated, development-only visual fixture. It never requests or writes member data. */
export default function HomepagePreview({ animateHome }: { animateHome?: boolean }): JSX.Element {
  const mobile = useMobileNavigation();
  const [minimized, setMinimized] = useState(false);
  const entry = navigationEntry('/', 24);
  const profileEntry = navigationEntry('/', 16);
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
                searchControl={
                  <HomeSearch placement="sidebar" compact={minimized} keyboardShortcut={false} />
                }
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
                  {['/forms/profile', '/settings', '/help'].map((href) => {
                    const { label, icon } = profileEntry(href);
                    return (
                      <MenuItem key={href} icon={icon}>
                        {label}
                      </MenuItem>
                    );
                  })}
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
                  entry('/admin'),
                  entry('/interview-scheduler'),
                  entry('/forms/profile', 'Edit Profile'),
                  entry('/settings'),
                  entry('/help')
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
