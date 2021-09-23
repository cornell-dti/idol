import React from 'react';
import { Route, Switch, BrowserRouter as Router, useLocation } from 'react-router-dom';
import DTI48 from './DTI48/DTI48';
import NavigationCard, { NavigationCardItem } from '../Common/NavigationCard';

const navCardItems: readonly NavigationCardItem[] = [
  { header: 'DTI48', description: 'Keep merging until you get Ashneel.', link: '/games/dti48' }
];

const GamesBase: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/games' || location.pathname === '/games/') {
    return <NavigationCard testID="GamesBase" items={navCardItems} />;
  }
  return (
    <div data-testid="GamesBase">
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
