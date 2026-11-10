import { ReactNode, useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { Sidebar, Menu, Icon, Checkbox } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import UserProvider from '../components/Common/UserProvider/UserProvider';
import FirestoreDataProvider, {
  useHasAdminPermission,
  useHasMemberPermission,
  useSelf
} from '../components/Common/FirestoreDataProvider';
import SiteHeader from '../components/Common/SiteHeader/SiteHeader';
import { Emitters } from '../utils';
import ErrorModal from '../components/Modals/ErrorModal';
import SuccessModal from '../components/Modals/SuccessModal';
import SuccessNotifications from '../redesign/SuccessNotifications';
import { ToastProvider } from '../design-system-2026/components';
import CandidateDeciderAPI from '../API/CandidateDeciderAPI';
import { PreviewProvider, usePreview, usePreviewToggle } from '../redesign/preview';
import AppLayout, { AppLayoutLoading } from '../redesign/AppLayout';
import PreviewRouteGuard from '../redesign/PreviewRouteGuard';
import { breadcrumbRoutes } from '../redesign/breadcrumbRoutes';
import { AppearanceProvider } from '../design-system-2026/components/Theme/AppearanceProvider';
import homeStyles from '../redesign/Homepage/Homepage.module.css';

import 'semantic-ui-css/semantic.min.css';
import './index.css';
import './App.css';
import '../design-system-2026/tokens/colors.css';
import '../design-system-2026/tokens/typography.css';
import '../design-system-2026/tokens/skeleton.css';

export default function AppTemplate(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;
  const { pathname } = useRouter();
  const isDesignPreview =
    process.env.NODE_ENV === 'development' &&
    (pathname === '/design-system-2026' || pathname.startsWith('/design-system-2026/'));
  const isHome =
    pathname === '/' || (isDesignPreview && pathname === '/design-system-2026/homepage');
  const [entrancePath, setEntrancePath] = useState(isHome ? pathname : null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (pathname !== entrancePath) setEntrancePath(null);
  }, [pathname, entrancePath]);
  const animateHome = hydrated && pathname === entrancePath;
  const entranceClass = `${homeStyles.entranceScope} ${animateHome ? homeStyles.enter : ''}`;

  // Local design-system previews stay independent of Firebase.
  if (isDesignPreview) {
    return (
      <div className={entranceClass}>
        <Component {...pageProps} animateHome={animateHome} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/dti-logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="description" content="Cornell DTI's Internal DTI Organization Logic (IDOL)" />
        <link rel="apple-touch-icon" href="/dti-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Cornell DTI IDOL</title>
      </Head>
      <AppearanceProvider forceLight={!breadcrumbRoutes[pathname]?.supportsDarkTheme}>
        <div className={entranceClass}>
          <UserProvider loading={<AppLayoutLoading />}>
            <FirestoreDataProvider loading={<AppLayoutLoading />}>
              <PreviewProvider>
                <RoutingMiddleware>
                  <PreviewRouteGuard>
                    <AppContent animateHome={animateHome}>
                      <Component {...pageProps} />
                    </AppContent>
                  </PreviewRouteGuard>
                </RoutingMiddleware>
              </PreviewProvider>
            </FirestoreDataProvider>
          </UserProvider>
        </div>
      </AppearanceProvider>
    </>
  );
}

function AppContent({
  children,
  animateHome
}: {
  readonly children: ReactNode;
  readonly animateHome: boolean;
}): JSX.Element {
  const preview = usePreview();
  const [navVisible, setNavVisible] = useState(false);
  const hasAdminPermission = useHasAdminPermission();
  const hasMemberPermissions = useHasMemberPermission();
  useEffect(() => {
    const cb = (isOpen: boolean) => {
      setNavVisible(isOpen);
    };
    Emitters.navOpenEmitter.subscribe(cb);
    return () => {
      Emitters.navOpenEmitter.unsubscribe(cb);
    };
  });

  return (
    <ToastProvider>
      <ErrorModal onEmitter={Emitters.generalError}></ErrorModal>
      <ErrorModal onEmitter={Emitters.userEditError}></ErrorModal>
      {preview ? (
        <SuccessNotifications onEmitter={Emitters.generalSuccess} />
      ) : (
        <SuccessModal onEmitter={Emitters.generalSuccess} />
      )}
      {preview ? (
        <AppLayout animateHome={animateHome}>{children}</AppLayout>
      ) : (
        <div className="App">
          <SiteHeader />
          <div className="appSidebarContainer">
            {!hasMemberPermissions ? (
              <div className="appSidebarDimmer">{children}</div>
            ) : (
              <>
                <Sidebar
                  as={Menu}
                  animation="overlay"
                  icon="labeled"
                  inverted
                  onHide={() => setNavVisible(false)}
                  vertical
                  visible={navVisible}
                  width="thin"
                  onClick={() => {
                    Emitters.navOpenEmitter.emit(false);
                  }}
                  className="appSidebar"
                >
                  <MenuContent hasAdminPermission={hasAdminPermission} />
                </Sidebar>
                <Sidebar.Pushable>
                  <Sidebar.Pusher dimmed={navVisible}>
                    <div className="appSidebarDimmer">{children}</div>
                  </Sidebar.Pusher>
                </Sidebar.Pushable>
              </>
            )}
          </div>
        </div>
      )}
    </ToastProvider>
  );
}

const MenuContent: React.FC<{ hasAdminPermission: boolean }> = ({ hasAdminPermission }) => {
  const [hasInstance, setHasInstance] = useState<boolean>(false);
  const self = useSelf();
  const { canPreview, enabled, setEnabled } = usePreviewToggle();
  useEffect(() => {
    if (self) {
      CandidateDeciderAPI.hasCandidateDeciderInstance().then((result) => {
        setHasInstance(result);
      });
    }
  }, [self]);
  return (
    <>
      <Link href="/">
        <Menu.Item>
          <Icon name="home" />
          Home
        </Menu.Item>
      </Link>
      {hasAdminPermission && (
        <Link href="/admin">
          <Menu.Item>
            <Icon name="shield" />
            Admin
          </Menu.Item>
        </Link>
      )}
      <Link href="/forms">
        <Menu.Item>
          <Icon name="file alternate" />
          Forms
        </Menu.Item>
      </Link>
      <Link href="/alumni">
        <Menu.Item>
          <Icon name="graduation cap" />
          Alumni
        </Menu.Item>
      </Link>
      {hasInstance && (
        <Link href="/candidate-decider">
          <Menu.Item>
            <Icon name="chart bar outline" />
            Candidate Decider
          </Menu.Item>
        </Link>
      )}
      {/* {hasAdminPermission && (
        <Link href="/admin/interview-status">
          <Menu.Item>
            <Icon name="briefcase" />
            Interview Status Dashboard
          </Menu.Item>
        </Link>
      )} */}
      <Link href="/interview-scheduler">
        <Menu.Item>
          <Icon name="users" />
          Interview Scheduler
        </Menu.Item>
      </Link>
      {canPreview && (
        <Menu.Item className="appSidebarPreviewToggle" onClick={(e) => e.stopPropagation()}>
          Try new UI
          <Checkbox toggle checked={enabled} onChange={(_, { checked }) => setEnabled(!!checked)} />
        </Menu.Item>
      )}
    </>
  );
};

const RoutingMiddleware: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const hasMemberPermissions = useHasMemberPermission();
  const hasAdminPermission = useHasAdminPermission();

  useEffect(() => {
    if (!router.pathname.startsWith('/interview-scheduler') && !hasMemberPermissions) {
      if (router.pathname !== '/interview-scheduler') router.push('/interview-scheduler');
      return;
    }
    if (router.pathname.startsWith('/admin') && !hasAdminPermission) {
      if (router.pathname !== '/') router.push('/');
    }
  }, [router, router.pathname, hasMemberPermissions, hasAdminPermission]);

  return <>{children}</>;
};
