import React, { useContext, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Sidebar, Menu, Icon, Loader } from 'semantic-ui-react';
import SignIn from './SignIn/SignIn.lazy';
import Homepage from './Homepage/Homepage.lazy';
import { UserContext } from './UserProvider/UserProvider';
import SiteHeader from './SiteHeader/SiteHeader';
import Emitters from './EventEmitter/constant-emitters';
import EmailNotFoundErrorModal from './Modals/EmailNotFoundError/EmailNotFoundErrorModal';
import UserBase from './User/UserBase/UserBase';

import ErrorModal from './Modals/ErrorModal/ErrorModal';
import AdminBase from './Admin/AdminBase/AdminBase';
import SuccessModal from './Modals/SuccessModal/SuccessModal';
import FormsBase from './Forms/FormsBase/FormsBase';
import GamesBase from './Games/GamesBase/GamesBase';

function App(): JSX.Element {
  const user = useContext(UserContext);
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

  if (user.user === null || user.loggingIntoDTI) {
    return <NotAuthed />;
  }

  return (
    <div>
      <ErrorModal onEmitter={Emitters.generalError}></ErrorModal>
      <ErrorModal onEmitter={Emitters.userEditError}></ErrorModal>
      <SuccessModal onEmitter={Emitters.generalSuccess}></SuccessModal>
      <RouterImpl navVisible={navVisible} setNavVisible={setNavVisible} />
    </div>
  );
}

const RouterImpl: React.FC<{
  navVisible: boolean;
  setNavVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ navVisible, setNavVisible }) => (
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
              <Switch>
                <Route path="/users*">
                  <UserBase />
                </Route>
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
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    </div>
  </Router>
);

const MenuContent: React.FC = () => (
  <>
    <Link to="/">
      <Menu.Item>
        <Icon name="home" />
        Home
      </Menu.Item>
    </Link>
    <Link to="/users">
      <Menu.Item>
        <Icon name="group" />
        Users
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

const NotAuthed: React.FC = () => {
  const user = useContext(UserContext);
  return !user.loggingIntoDTI ? (
    <div className="App">
      <EmailNotFoundErrorModal />
      <Router>
        <Switch>
          <Route path="/*">
            <SignIn />
          </Route>
        </Switch>
      </Router>
    </div>
  ) : (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/*">
            <div style={{ height: '100vh', width: '100vw' }}>
              <Loader active={true} size="massive">
                Signing you in...
              </Loader>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
