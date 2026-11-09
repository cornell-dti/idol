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
import type { SidebarEntry } from '../design-system-2026/components/Sidebar/Sidebar';
import {
  SignOutIcon,
  CalendarIcon,
  GearIcon,
  QuestionIcon,
  UserIcon,
  ScalesIcon,
  UsersIcon
} from '../design-system-2026/icons';
import type { Icon } from '../design-system-2026/icons';
import { useHasAdminPermission, useSelf } from '../components/Common/FirestoreDataProvider';
import CandidateDeciderAPI from '../API/CandidateDeciderAPI';
import ImagesAPI from '../API/ImagesAPI';
import { auth } from '../firebase';
import { usePreviewToggle } from './preview';
import { BreadcrumbTitleContext, BreadcrumbTitle } from './BreadcrumbContext';
import getBreadcrumbs from './breadcrumbRoutes';
import memberNavigation from './navigation';
import Navigation from './Navigation/Navigation';
import ProfileMenu from './Navigation/ProfileMenu';
import useMobileNavigation from './Navigation/useMobileNavigation';
import styles from './Navigation/Navigation.module.css';

/** Navigation for the redesign, using the same routes and permissions as the released app. */
export default function AppLayout({ children }: { readonly children: ReactNode }): JSX.Element {
  const router = useRouter();
  const self = useSelf();
  const hasAdminPermission = useHasAdminPermission();
  const { enabled, setEnabled } = usePreviewToggle();
  const mobile = useMobileNavigation();
  const [minimized, setMinimized] = useState(false);
  const [hasInstance, setHasInstance] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [breadcrumbTitle, setBreadcrumbTitle] = useState<BreadcrumbTitle>();

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
    let active = true;
    setHasInstance(false);
    if (self) {
      CandidateDeciderAPI.hasCandidateDeciderInstance().then((result) => {
        if (active) setHasInstance(result);
      });
    }
    return () => {
      active = false;
    };
  }, [self]);

  const entry = (href: string, label: string, IconComponent: Icon): SidebarEntry => ({
    id: href,
    href,
    label,
    icon: <IconComponent size={mobile ? 24 : 16} aria-hidden="true" />,
    selected: router.pathname === href || (href !== '/' && router.pathname.startsWith(`${href}/`))
  });
  const items = memberNavigation(router.pathname, mobile ? 24 : 16);
  const recruitmentItems = [
    ...(hasInstance ? [entry('/candidate-decider', 'Candidate Decider', ScalesIcon)] : []),
    entry('/interview-scheduler', 'Interview Scheduler', CalendarIcon)
  ];
  const adminItems = hasAdminPermission ? [entry('/admin', 'Admin', UsersIcon)] : [];
  const breadcrumbs = getBreadcrumbs(
    router.pathname,
    router.asPath,
    breadcrumbTitle?.path === router.asPath ? breadcrumbTitle.label : undefined
  );

  const profileName = self ? `${self.firstName} ${self.lastName}` : 'Profile';
  const profileMenu = (
    <>
      <MenuItem icon={<UserIcon size={16} />} onClick={() => router.push('/forms/profile')}>
        Profile
      </MenuItem>
      <MenuItem icon={<GearIcon size={16} />} onClick={() => router.push('/settings')}>
        Settings
      </MenuItem>
      <MenuItem icon={<QuestionIcon size={16} />} onClick={() => router.push('/help')}>
        Help
      </MenuItem>
      {mobile && <MenuItem onClick={() => setEnabled(!enabled)}>Switch to classic UI</MenuItem>}
      <MenuSeparator />
      <MenuItem variant="danger" icon={<SignOutIcon size={16} />} onClick={() => auth.signOut()}>
        Sign Out
      </MenuItem>
    </>
  );
  let header =
    router.pathname === '/' ? null : (
      <>
        <Breadcrumbs items={breadcrumbs} />
        <LabelledSwitch label="Try new UI" checked={enabled} onCheckedChange={setEnabled} />
      </>
    );
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
        <ProfileMenu name={profileName} src={profilePhoto}>
          {profileMenu}
        </ProfileMenu>
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
        animateNavigation={router.pathname === '/'}
        pageKey={router.asPath.split(/[?#]/)[0]}
        sidebar={
          !mobile && (
            <Sidebar
              id="app-navigation"
              minimized={minimized}
              onMinimizedChange={setMinimized}
              sections={[
                { id: 'main', label: 'Main', items },
                ...(adminItems.length ? [{ id: 'admin', label: 'Admin', items: adminItems }] : []),
                { id: 'recruitment', label: 'Recruitment', items: recruitmentItems }
              ]}
              footer={
                router.pathname === '/' ? (
                  <LabelledSwitch
                    label={minimized ? 'New UI' : 'Try new UI'}
                    checked={enabled}
                    onCheckedChange={setEnabled}
                  />
                ) : undefined
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
              pageKey={router.asPath.split(/[?#]/)[0]}
              items={[
                ...items,
                ...adminItems,
                ...recruitmentItems,
                entry('/forms/profile', 'Edit Profile', UserIcon),
                entry('/settings', 'Settings', GearIcon),
                entry('/help', 'Help', QuestionIcon)
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
