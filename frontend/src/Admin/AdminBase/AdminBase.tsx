import React from 'react';
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Link,
  useLocation
} from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import SiteDeployer from '../DTI-Site-Deployer/SiteDeployer';
import MemberReview from '../MemberReview/MemberReview';
import SignInFormCreatorBase from '../SignInFormCreator/SignInFormCreator';
import AdminShoutouts from '../AdminShoutouts/AdminShoutouts';
import styles from './AdminBase.module.css';

const AdminBase: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    return (
      <div className={styles.AdminBase} data-testid="AdminBase">
        <div className={styles.content}>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>Member Information Review</Card.Header>
                <Card.Description>
                  Approve the new info from IDOL.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="/admin/member-review">
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>Site Deployer</Card.Header>
                <Card.Description>
                  Approve the new info from IDOL and redeploy the site.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="/admin/site-deployer">
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>Sign-In Creator</Card.Header>
                <Card.Description>
                  Create a new sign-in code/link!
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="/admin/signin-creator">
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>View Shoutouts</Card.Header>
                <Card.Description>View recent shoutouts</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="admin/shoutouts">
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
    <div className={styles.AdminBase} data-testid="AdminBase">
      <Router>
        <Switch>
          <Route path="/admin/member-review">
            <MemberReview />
          </Route>
          <Route path="/admin/site-deployer">
            <SiteDeployer />
          </Route>
          <Route path="/admin/signin-creator">
            <SignInFormCreatorBase />
          </Route>
          <Route path="/admin/shoutouts">
            <AdminShoutouts />
          </Route>
          <Route path="/*"></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default AdminBase;
