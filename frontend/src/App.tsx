import React, { ReactNode, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Sidebar, Menu, Icon, Loader } from 'semantic-ui-react';
import SignIn from './SignIn/SignIn.lazy';
import Homepage from './Homepage/Homepage.lazy';
import { useUserContext } from './UserProvider/UserProvider';
import SiteHeader from './SiteHeader/SiteHeader';
import Emitters from './EventEmitter/constant-emitters';
import EmailNotFoundErrorModal from './Modals/EmailNotFoundError/EmailNotFoundErrorModal';

import ErrorModal from './Modals/ErrorModal/ErrorModal';
import AdminBase from './Admin/AdminBase/AdminBase';
import SuccessModal from './Modals/SuccessModal/SuccessModal';
import FormsBase from './Forms/FormsBase/FormsBase';
import GamesBase from './Games/GamesBase/GamesBase';

export default function App(): JSX.Element {
  return (
    <AppContent>
      <SwitchImpl />
    </AppContent>
  );
}

function AppContent({ children }: { readonly children: ReactNode }): JSX.Element {
  const user = useUserContext();
  const [navVisible, setNavVisible] = React.useState(false);
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
      <Router>
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
      </Router>
    </div>
  );
}

const SwitchImpl: React.FC = () => (
  <Switch>
    <Route path="/forms*">
      <FormsBase />
    </Route>
    <Route path="/admin*">
      <AdminBase />
    </Route>
    <Route path="/games*">
      <GamesBase />
    </Route>
    <Route path="/*">
      <Homepage />
    </Route>
  </Switch>
);

const MenuContent: React.FC = () => (
  <>
    <Link to="/">
      <Menu.Item>
        <Icon name="home" />
        Home
      </Menu.Item>
    </Link>
    <Link to="/admin">
      <Menu.Item>
        <Icon name="shield" />
        Admin
      </Menu.Item>
    </Link>
    <Link to="/forms">
      <Menu.Item>
        <Icon name="file alternate" />
        Forms
      </Menu.Item>
    </Link>
    <Link to="/games">
      <Menu.Item>
        <Icon name="game" />
        Games
      </Menu.Item>
    </Link>
  </>
);
