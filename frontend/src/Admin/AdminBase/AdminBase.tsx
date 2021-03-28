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
import styles from './AdminBase.module.css';

const AdminBase: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/admin') {
    return (
      <div className={styles.AdminBase} data-testid="AdminBase">
        <div className={styles.content}>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>Site Deployer</Card.Header>
                <Card.Description>
                  Approve the new info from IDOL and redeploy the site.
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="admin/site-deployer">
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
          <Route path="/admin/site-deployer">
            <SiteDeployer />
          </Route>
          <Route path="/*"></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default AdminBase;
