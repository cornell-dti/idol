import React from 'react';
import { Route, Switch, BrowserRouter as Router, useLocation } from 'react-router-dom';
import SiteDeployer from './SiteDeployer';
import MemberReview from './MemberReview';
import SignInFormCreatorBase from './SignInFormCreator';
import AdminShoutouts from './AdminShoutouts';
import AddUser from './AddUser';
import EditTeam from './EditTeam';
import NavigationCard, { NavigationCardItem } from '../Common/NavigationCard';

const navCardItems: readonly NavigationCardItem[] = [
  {
    header: 'Member Information Review',
    description: 'Approve the new info from IDOL.',
    link: '/admin/member-review'
  },
  {
    header: 'Site Deployer',
    description: 'Approve the new info from IDOL and redeploy the site.',
    link: '/admin/site-deployer'
  },
  {
    header: 'Sign-In Creator',
    description: 'Create a new sign-in code/link!',
    link: '/admin/signin-creator'
  },
  { header: 'View Shoutouts', description: 'View recent shoutouts', link: '/admin/shoutouts' },
  {
    header: 'Edit Users',
    description: 'Create, read, edit, or delete individual users of the system.',
    link: '/admin/edit'
  },
  {
    header: 'Edit Teams',
    description: 'Create, read, edit, or delete teams in the system.',
    link: '/admin/teams/edit'
  }
];

const AdminBase: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    return <NavigationCard testID="AdminBase" items={navCardItems} />;
  }
  return (
    <div data-testid="AdminBase">
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
          <Route path="/admin/edit">
            <AddUser />
          </Route>
          <Route path="/admin/teams/edit">
            <EditTeam />
          </Route>
          <Route path="/*"></Route>
        </Switch>
      </Router>
    </div>
  );
};

export default AdminBase;
