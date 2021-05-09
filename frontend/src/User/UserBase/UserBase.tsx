import React from 'react';
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Link,
  useLocation
} from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import styles from './UserBase.module.css';
import DTI48 from '../DTI48/DTI48';
import UserProfile from '../UserProfile/UserProfile';
import UserProfileImage from '../UserProfile/UserProfileImage/UserProfileImage';
import ShoutoutsPage from '../ShoutoutsPage/ShoutoutsPage';

const UserBase: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/users') {
    return (
      <div className={styles.UserBase} data-testid="UserBase">
        <div className={styles.content}>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>Edit Profile</Card.Header>
                <Card.Description>
                  Edit your profile information on DTI's website.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="users/profile">
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
                  <Link to="users/profileImage">
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
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
                  <Link to="users/shoutouts">
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>DTI48</Card.Header>
                <Card.Description>
                  Keep merging until you get Gilly.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="users/dti48">
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
    <div className={styles.UserBase} data-testid="UserBase">
      <Router>
        <Switch>
          <Route path="/users/profile">
            <UserProfile></UserProfile>
          </Route>
          <Route path="/users/profileImage">
            <UserProfileImage></UserProfileImage>
          </Route>
          <Route path="/users/shoutouts">
            <ShoutoutsPage></ShoutoutsPage>
          </Route>
          <Route path="/users/dti48">
            <DTI48></DTI48>
          </Route>
          <Route path="/*"></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default UserBase;
