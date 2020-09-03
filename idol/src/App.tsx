import React, { useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import SignIn from './SignIn/SignIn.lazy';
import Homepage from './Homepage/Homepage.lazy';
import { UserContext } from './UserProvider/UserProvider';
import SiteHeader from './SiteHeader/SiteHeader';
import { Sidebar, Segment, Menu, Icon, Header } from 'semantic-ui-react';
import { Emitters } from './EventEmitter/constant-emitters';
import EmailNotFoundErrorModal from './Modals/EmailNotFoundError/EmailNotFoundErrorModal';

function App() {
  const user = useContext(UserContext);
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    let cb = (isOpen: boolean) => {
      setVisible(isOpen);
    };
    Emitters.navOpenEmitter.subscribe(cb);
    return () => {
      Emitters.navOpenEmitter.unsubscribe(cb);
    };
  })
  return (
    user.user ?
      (
        <Router>
          <div style={{ minHeight: '100vh', minWidth: '100vw' }}>
            <SiteHeader />
            <Sidebar.Pushable>
              <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                onHide={() => setVisible(false)}
                vertical
                visible={visible}
                width='thin'
                onClick={() => { Emitters.navOpenEmitter.emit(false) }}
              >
                <Link to="/">
                  <Menu.Item as='a'>
                    <Icon name='home' />
              Home
            </Menu.Item>
                </Link>
                <Link to="/attendance">
                  <Menu.Item as='a'>
                    <Icon name='group' />
              Attendance
            </Menu.Item>
                </Link>
              </Sidebar>
              <Sidebar.Pusher dimmed={visible}>
                <div style={{ minHeight: '90vh', minWidth: '100vw', margin: 0 }}>
                  <Switch>
                    <Route path="/*">
                      <Homepage />
                    </Route>
                  </Switch>
                </div>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </div>
        </Router>)
      :
      (<div>
        <EmailNotFoundErrorModal />
        <Router>
          <Switch>
            <Route path="/*">
              <SignIn />
            </Route>
          </Switch>
        </Router>
      </div>)
  );
}

export default App;
