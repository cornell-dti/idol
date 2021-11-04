import { ReactNode, useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { Sidebar, Menu, Icon, Loader } from 'semantic-ui-react';
import SignIn from '../components/Common/SignIn.lazy';
import UserProvider, { useUserContext } from '../components/Common/UserProvider';
import FirestoreDataProvider from '../components/Common/FirestoreDataProvider';
import SiteHeader from '../components/Common/SiteHeader';
import { Emitters } from '../utils';
import EmailNotFoundErrorModal from '../components/Modals/EmailNotFoundErrorModal';
import ErrorModal from '../components/Modals/ErrorModal';
import SuccessModal from '../components/Modals/SuccessModal';

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Cornell DTI's Internal DTI Organization Logic (IDOL)" />
        <link rel="apple-touch-icon" href="/dti-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Cornell DTI IDOL</title>
      </Head>
      <UserProvider>
        <AppContent>
          <FirestoreDataProvider>
            <Component {...pageProps} />
          </FirestoreDataProvider>
        </AppContent>
      </UserProvider>
    </>
  );
}

function AppContent({ children }: { readonly children: ReactNode }): JSX.Element {
  const user = useUserContext();
  const [navVisible, setNavVisible] = useState(false);
  useEffect(() => {
    const cb = (isOpen: boolean) => {
      setNavVisible(isOpen);
    };
    Emitters.navOpenEmitter.subscribe(cb);
    return () => {
      Emitters.navOpenEmitter.unsubscribe(cb);
    };
  });

  if (user === 'INIT') {
    return (
      <div className="App">
        <div style={{ height: '100vh', width: '100vw' }}>
          <Loader active={true} size="massive">
            Signing you in...
          </Loader>
        </div>
      </div>
    );
  }
  if (user == null) {
    return (
      <div className="App">
        <EmailNotFoundErrorModal />
        <SignIn />
      </div>
    );
  }

  return (
    <div>
      <ErrorModal onEmitter={Emitters.generalError}></ErrorModal>
      <ErrorModal onEmitter={Emitters.userEditError}></ErrorModal>
      <SuccessModal onEmitter={Emitters.generalSuccess}></SuccessModal>
      <div
        className="App"
        style={{
          minHeight: '100vh',
          maxHeight: '100vh',
          minWidth: '100vw',
          position: 'relative'
        }}
      >
        <SiteHeader />
        <div
          style={{
            position: 'absolute',
            top: '80px',
            height: 'calc(100vh - 80px)'
          }}
        >
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
            <MenuContent />
          </Sidebar>
          <Sidebar.Pushable>
            <Sidebar.Pusher dimmed={navVisible}>
              <div
                style={{
                  width: '100vw',
                  margin: 0,
                  padding: 0
                }}
              >
                {children}
              </div>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </div>
    </div>
  );
}

const MenuContent: React.FC = () => (
  <>
    <Link href="/">
      <Menu.Item>
        <Icon name="home" />
        Home
      </Menu.Item>
    </Link>
    <Link href="/admin">
      <Menu.Item>
        <Icon name="shield" />
        Admin
      </Menu.Item>
    </Link>
    <Link href="/forms">
      <Menu.Item>
        <Icon name="file alternate" />
        Forms
      </Menu.Item>
    </Link>
    <Link href="/games">
      <Menu.Item>
        <Icon name="game" />
        Games
      </Menu.Item>
    </Link>
  </>
);
