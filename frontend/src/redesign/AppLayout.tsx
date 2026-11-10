import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
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
  ClipboardTextIcon,
  GraduationCapIcon,
  GearIcon,
  QuestionIcon,
  UserIcon,
  HouseIcon,
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

/** Navigation for the redesign, using the same routes and permissions as the released app. */
export default function AppLayout({ children }: { readonly children: ReactNode }): JSX.Element {
  const router = useRouter();
  const self = useSelf();
  const hasAdminPermission = useHasAdminPermission();
  const { enabled, setEnabled } = usePreviewToggle();
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
    const compact = window.matchMedia('(max-width: 760px)');
    const resize = () => setMinimized(compact.matches);
    resize();
    compact.addEventListener('change', resize);
    return () => compact.removeEventListener('change', resize);
  }, []);

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
    icon: <IconComponent size={16} aria-hidden="true" />,
    selected: router.pathname === href || (href !== '/' && router.pathname.startsWith(`${href}/`))
  });
  const items = [
    entry('/', 'Home', HouseIcon),
    entry('/forms', 'Forms', ClipboardTextIcon),
    entry('/alumni', 'Alumni', GraduationCapIcon),
    ...(hasInstance ? [entry('/candidate-decider', 'Candidate Decider', ScalesIcon)] : []),
    entry('/interview-scheduler', 'Interview Scheduler', CalendarIcon)
  ];
  const adminItems = hasAdminPermission ? [entry('/admin', 'Admin', UsersIcon)] : [];
  const breadcrumbs = getBreadcrumbs(
    router.pathname,
    router.asPath,
    breadcrumbTitle?.path === router.asPath ? breadcrumbTitle.label : undefined
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
        sidebar={
          <Sidebar
            id="app-navigation"
            minimized={minimized}
            onMinimizedChange={setMinimized}
            sections={[
              { id: 'main', label: 'Main', items },
              ...(adminItems.length ? [{ id: 'admin', label: 'Admin', items: adminItems }] : [])
            ]}
            profile={{
              name: self ? `${self.firstName} ${self.lastName}` : 'Profile',
              src: profilePhoto,
              menu: (
                <>
                  <MenuItem
                    icon={<UserIcon size={16} />}
                    onClick={() => router.push('/forms/profile')}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem icon={<GearIcon size={16} />} onClick={() => router.push('/settings')}>
                    Settings
                  </MenuItem>
                  <MenuItem icon={<QuestionIcon size={16} />} onClick={() => router.push('/help')}>
                    Help
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    variant="danger"
                    icon={<SignOutIcon size={16} />}
                    onClick={() => auth.signOut()}
                  >
                    Sign Out
                  </MenuItem>
                </>
              )
            }}
          />
        }
        header={
          <>
            <Breadcrumbs items={breadcrumbs} />
            <LabelledSwitch label="Try new UI" checked={enabled} onCheckedChange={setEnabled} />
          </>
        }
      >
        <BreadcrumbTitleContext.Provider value={setBreadcrumbTitle}>
          {children}
        </BreadcrumbTitleContext.Provider>
      </AppShell>
    </DesignSystemScope>
  );
}
