import React from 'react';
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Link,
  useLocation
} from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import ShoutoutsPage from '../ShoutoutsPage/ShoutoutsPage';
import UserProfile from '../UserProfile/UserProfile';
import UserProfileImage from '../UserProfile/UserProfileImage/UserProfileImage';
import styles from './FormsBase.module.css';

const FormsBase: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/forms' || location.pathname === '/forms/') {
    return (
      <div className={styles.FormsBase} data-testid="FormsBase">
        <div className={styles.content}>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>Shoutouts</Card.Header>
                <Card.Description>
                  Give someone a shoutout or view your past given and received
                  shoutouts.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="/forms/shoutouts">
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>Edit Profile</Card.Header>
                <Card.Description>
                  Edit your profile information on DTI's website.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="/forms/profile">
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>Edit Profile Image</Card.Header>
                <Card.Description>Edit your profile image.</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="/forms/profileImage">
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          </Card.Group>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.FormsBase} data-testid="FormsBase">
      <Router>
        <Switch>
          <Route path="/forms/profile">
            <UserProfile />
          </Route>
          <Route path="/forms/profileImage">
            <UserProfileImage />
          </Route>
          <Route path="/forms/shoutouts">
            <ShoutoutsPage />
          </Route>
          <Route path="/*"></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default FormsBase;
