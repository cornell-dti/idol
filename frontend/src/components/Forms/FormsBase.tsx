import React from 'react';
import { Route, Switch, BrowserRouter as Router, useLocation } from 'react-router-dom';
import ShoutoutsPage from './ShoutoutsPage/ShoutoutsPage';
import UserProfile from './UserProfile/UserProfile';
import UserProfileImage from './UserProfile/UserProfileImage';
import SignInForm from './SignInForm/SignInForm';
import TeamEventCreditsForm from './TeamEventCreditsForm/TeamEventCreditsForm';
import NavigationCard, { NavigationCardItem } from '../Common/NavigationCard';

const navCardItems: readonly NavigationCardItem[] = [
  { header: 'Sign-In Form', description: 'Sign in to an event!', link: '/forms/signin' },
  {
    header: 'Shoutouts',
    description: 'Give someone a shoutout or view your past given and received shoutouts.',
    link: '/forms/shoutouts'
  },
  {
    header: 'Edit Profile',
    description: "Edit your profile information on DTI's website.",
    link: '/forms/profile'
  },
  {
    header: 'Edit Profile Image',
    description: 'Edit your profile image.',
    link: '/forms/profileImage'
  },
  {
    header: 'Team Event Credits',
    description: 'Track your team event credits.',
    link: '/forms/teamEventCredits'
  }
];

const FormsBase: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/forms' || location.pathname === '/forms/') {
    return <NavigationCard testID="FormsBase" items={navCardItems} />;
  }
  return (
    <div data-testid="FormsBase">
      <Router>
        <Switch>
          <Route path="/forms/signin*">
            <SignInForm />
          </Route>
          <Route path="/forms/profile">
            <UserProfile />
          </Route>
          <Route path="/forms/profileImage">
            <UserProfileImage />
          </Route>
          <Route path="/forms/shoutouts">
            <ShoutoutsPage />
          </Route>
          <Route path="/forms/teamEventCredits">
            <TeamEventCreditsForm />
          </Route>
          <Route path="/*"></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default FormsBase;
