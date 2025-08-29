import { ReactNode, useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
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
import CandidateDeciderAPI from '../API/CandidateDeciderAPI';

import 'semantic-ui-css/semantic.min.css';
import './index.css';
import './App.css';

export default function AppTemplate(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;

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
      <UserProvider>
        <FirestoreDataProvider>
          <RoutingMiddleware>
            <AppContent>
              <Component {...pageProps} />
            </AppContent>
          </RoutingMiddleware>
        </FirestoreDataProvider>
      </UserProvider>
    </>
  );
}

function AppContent({ children }: { readonly children: ReactNode }): JSX.Element {
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
    <div>
      <ErrorModal onEmitter={Emitters.generalError}></ErrorModal>
      <ErrorModal onEmitter={Emitters.userEditError}></ErrorModal>
      <SuccessModal onEmitter={Emitters.generalSuccess}></SuccessModal>
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
    </div>
  );
}

const MenuContent: React.FC<{ hasAdminPermission: boolean }> = ({ hasAdminPermission }) => {
  const [hasInstance, setHasInstance] = useState<boolean>(false);
  const self = useSelf();
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
      {hasInstance && (
        <Link href="/candidate-decider">
          <Menu.Item>
            <Icon name="chart bar outline" />
            Candidate Decider
          </Menu.Item>
        </Link>
      )}
      {hasAdminPermission && (
        <Link href="/admin/interview-status">
          <Menu.Item>
            <Icon name="briefcase" />
            Interview Status Dashboard
          </Menu.Item>
        </Link>
      )}
      <Link href="/interview-scheduler">
        <Menu.Item>
          <Icon name="users" />
          Interview Scheduler
        </Menu.Item>
      </Link>
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
