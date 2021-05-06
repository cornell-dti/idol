import React from 'react';
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Link,
  useLocation
} from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import SignInForm from '../SignInForm/SignInForm';
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
                <Card.Header>Sign-In Form</Card.Header>
                <Card.Description>Sign in to an event!</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="/forms/signin">
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
          <Route path="/forms/signin*">
            <SignInForm />
          </Route>
          <Route path="/*"></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default FormsBase;
