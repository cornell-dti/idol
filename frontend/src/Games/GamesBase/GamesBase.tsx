import React from 'react';
import { Route, Switch, BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import styles from './GamesBase.module.css';
import DTI48 from '../DTI48/DTI48';

const GamesBase: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/games' || location.pathname === '/games/') {
    return (
      <div className={styles.GamesBase} data-testid="GamesBase">
        <div className={styles.content}>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>DTI48</Card.Header>
                <Card.Description>Keep merging until you get Gilly.</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to="games/dti48">
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
    <div className={styles.GamesBase} data-testid="GamesBase">
      <Router>
        <Switch>
          <Route path="/games/dti48">
            <DTI48></DTI48>
          </Route>
          <Route path="/*"></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default GamesBase;
