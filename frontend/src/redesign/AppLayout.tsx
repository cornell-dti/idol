import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  AppShell,
  Breadcrumbs,
  DesignSystemScope,
  LabelledSwitch,
  MenuItem,
  MenuSeparator,
  Sidebar
} from '../design-system-2026/components';
import LoadingScreen from '../design-system-2026/components/LoadingScreen/LoadingScreen';
import { SignOutIcon } from '../design-system-2026/icons';
import { useHasAdminPermission, useSelf } from '../components/Common/FirestoreDataProvider';
import CandidateDeciderAPI from '../API/CandidateDeciderAPI';
import ImagesAPI from '../API/ImagesAPI';
import { auth } from '../firebase';
import { readPreviewPreference, usePreviewToggle } from './preview';
import { BreadcrumbTitleContext, BreadcrumbTitle } from './BreadcrumbContext';
import getBreadcrumbs from './breadcrumbRoutes';
import memberNavigation, { navigationEntry } from './navigation';
import HomeSearch from './Homepage/HomeSearch';
import { HomepageSkeleton } from './Homepage/HomepageView';
import { rememberPage } from './Homepage/recentPages';
import Navigation from './Navigation/Navigation';
import ProfileMenu from './Navigation/ProfileMenu';
import useMobileNavigation from './Navigation/useMobileNavigation';
import styles from './Navigation/Navigation.module.css';

function navigationSections(pathname: string, size: number, admin: boolean, candidate: boolean) {
  const entry = navigationEntry(pathname, size);
  return [
    { id: 'main', label: 'Main', items: memberNavigation(pathname, size) },
    ...(admin ? [{ id: 'admin', label: 'Admin', items: [entry('/admin')] }] : []),
    {
      id: 'recruitment',
      label: 'Recruitment',
      items: [...(candidate ? [entry('/candidate-decider')] : []), entry('/interview-scheduler')]
    }
  ];
}

export function AppLayoutLoading(): JSX.Element {
  const { pathname } = useRouter();
  const mobile = useMobileNavigation();
  const [preview, setPreview] = useState(false);
  useEffect(() => setPreview(readPreviewPreference()), []);

  const home = pathname === '/';
  if (!preview || (mobile && !home)) return <LoadingScreen />;
  return (
    <DesignSystemScope>
      <AppShell
        flush={mobile}
        header={null}
        sidebar={
          !mobile && (
            <Sidebar
              id="app-navigation"
              loading
              minimized={false}
              onMinimizedChange={() => {}}
              sections={navigationSections(pathname, 16, false, false)}
              footer={
                <LabelledSwitch className={styles.previewToggle} label="Try new UI" disabled />
              }
              profile={{ name: 'Member name' }}
            />
          )
        }
      >
        {home ? <HomepageSkeleton /> : <LoadingScreen inline />}
      </AppShell>
    </DesignSystemScope>
  );
}

/** Navigation for the redesign, using the same routes and permissions as the released app. */
export default function AppLayout({
  children,
  animateHome
}: {
  readonly children: ReactNode;
  readonly animateHome: boolean;
}): JSX.Element {
  const router = useRouter();
  const self = useSelf();
  const hasAdminPermission = useHasAdminPermission();
  const { enabled, setEnabled } = usePreviewToggle();
  const mobile = useMobileNavigation();
  const [minimized, setMinimized] = useState(false);
  const [candidateAccess, setCandidateAccess] = useState<{ email: string; allowed: boolean }>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [breadcrumbTitle, setBreadcrumbTitle] = useState<BreadcrumbTitle>();
  const pagePath = router.asPath.split(/[?#]/)[0];
  const email = self?.email;
  const { isReady, pathname } = router;
  const detailLabel = breadcrumbTitle?.path === router.asPath ? breadcrumbTitle.label : undefined;

  useEffect(() => {
    if (!isReady || !email || pagePath === '/') return;
    if (pathname.startsWith('/admin') && !hasAdminPermission) return;
    const crumbs = getBreadcrumbs(pathname, pagePath, detailLabel);
    const { label } = crumbs[crumbs.length - 1];
    if (typeof label === 'string' && label !== 'Page')
      rememberPage(email, { href: pagePath, label });
  }, [detailLabel, email, hasAdminPermission, isReady, pagePath, pathname]);

  useEffect(() => {
    let active = true;
    setProfilePhoto(undefined);
    if (self?.netid) {
      ImagesAPI.getImage(`images/${self.netid}`)
        .then((url) => {
          if (active) setProfilePhoto(url);
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [self?.netid]);

  useEffect(() => {
    if (!self) return undefined;
    let active = true;
    CandidateDeciderAPI.hasCandidateDeciderInstance()
      .catch(() => false)
      .then((allowed) => {
        if (active) setCandidateAccess({ email: self.email, allowed });
      });
    return () => {
      active = false;
    };
  }, [self]);

  const hasInstance = candidateAccess?.email === email && candidateAccess?.allowed === true;
  const size = mobile ? 24 : 16;
  const entry = navigationEntry(router.pathname, size);
  const sections = navigationSections(pathname, size, hasAdminPermission, hasInstance);
  const breadcrumbs = getBreadcrumbs(pathname, router.asPath, detailLabel);

  const profileName = self ? `${self.firstName} ${self.lastName}` : 'Profile';
  const profileEntry = navigationEntry(pathname, 16);
  const profileMenu = (
    <>
      {['/forms/profile', '/settings', '/help'].map((href) => {
        const { label, icon } = profileEntry(href);
        return (
          <MenuItem key={href} icon={icon} onClick={() => router.push(href)}>
            {label}
          </MenuItem>
        );
      })}
      {mobile && <MenuItem onClick={() => setEnabled(!enabled)}>Switch to classic UI</MenuItem>}
      <MenuSeparator />
      <MenuItem variant="danger" icon={<SignOutIcon size={16} />} onClick={() => auth.signOut()}>
        Sign Out
      </MenuItem>
    </>
  );
  let header = pathname === '/' ? null : <Breadcrumbs items={breadcrumbs} />;
  if (mobile)
    header = (
      <>
        <div className={styles.headerStart}>
          {router.pathname === '/' ? (
            <Link href="/">
              <a href="/" className={styles.brand}>
                <img src="/design-system/figma/idol-logo.png" alt="" width={32} height={32} />
                <span>IDOL</span>
              </a>
            </Link>
          ) : (
            <Breadcrumbs items={breadcrumbs} />
          )}
        </div>
        <div className={styles.headerActions}>
          {pathname !== '/' && <HomeSearch pageKey={pagePath} placement="header" compact />}
          <ProfileMenu name={profileName} src={profilePhoto}>
            {profileMenu}
          </ProfileMenu>
        </div>
      </>
    );

  return (
    <DesignSystemScope>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AppShell
        flush={mobile}
        animateNavigation={animateHome}
        pageKey={pagePath}
        sidebar={
          !mobile && (
            <Sidebar
              id="app-navigation"
              minimized={minimized}
              onMinimizedChange={setMinimized}
              sections={sections}
              searchControl={
                <HomeSearch
                  pageKey={pagePath}
                  placement="sidebar"
                  compact={minimized}
                  keyboardShortcut={pathname !== '/'}
                />
              }
              footer={
                <LabelledSwitch
                  className={`${styles.previewToggle} ${
                    minimized ? styles.previewToggleCompact : ''
                  }`}
                  label="Try new UI"
                  aria-label="Try new UI"
                  title={minimized ? 'Try new UI' : undefined}
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              }
              profile={{ name: profileName, src: profilePhoto, menu: profileMenu }}
            />
          )
        }
        navigation={
          mobile && (
            <Navigation
              key={self?.email ?? 'anonymous'}
              storageKey={self?.email ? `idol:navbar:${self.email}` : undefined}
              pageKey={pagePath}
              items={[
                ...sections.flatMap((section) => section.items),
                entry('/forms/profile', 'Edit Profile'),
                entry('/settings'),
                entry('/help')
              ]}
            />
          )
        }
        header={header}
      >
        <BreadcrumbTitleContext.Provider value={setBreadcrumbTitle}>
          {children}
        </BreadcrumbTitleContext.Provider>
      </AppShell>
    </DesignSystemScope>
  );
}
