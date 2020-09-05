import React from 'react';
import styles from './UserBase.module.css';
import { Route, Switch, BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';

const UserBase: React.FC = () => {
  let location = useLocation();
  if (location.pathname === '/users') {
    return (
      <div className={styles.UserBase} data-testid="UserBase">
        <div className={styles.content}>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>Update Users</Card.Header>
                <Card.Description>
                  Create, read, edit, or delete individual users of the system.
              </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui one buttons'>
                  <Link to='users/create'>
                    <Button basic color='blue'>
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
  } else {
    return (
      <div className={styles.UserBase} data-testid="UserBase">
        <Router>
          <Switch>
            <Route path="/users/create">
              HERE WE ARE
          </Route>
            <Route path="/*">
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
};

export default UserBase;
