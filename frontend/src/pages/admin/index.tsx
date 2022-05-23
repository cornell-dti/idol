import NavigationCard, {
  NavigationCardItem
} from '../../components/Common/NavigationCard/NavigationCard';

const navCardItems: readonly NavigationCardItem[] = [
  {
    header: 'Member Information Review',
    description: 'Approve the new info from IDOL.',
    link: '/admin/member-review',
    adminOnly: true
  },
  {
    header: 'Site Deployer',
    description: 'Approve the new info from IDOL and redeploy the site.',
    link: '/admin/site-deployer',
    adminOnly: true
  },
  {
    header: 'Sign-In Creator',
    description: 'Create a new sign-in code/link!',
    link: '/admin/signin-creator',
    adminOnly: true
  },
  {
    header: 'View Shoutouts',
    description: 'View recent shoutouts',
    link: '/admin/shoutouts',
    adminOnly: true
  },
  {
    header: 'Edit Users',
    description: 'Create, read, edit, or delete individual users of the system.',
    link: '/admin/edit',
    adminOnly: true
  },
  {
    header: 'Edit Teams',
    description: 'Create, read, edit, or delete teams in the system.',
    link: '/admin/teams/edit',
    adminOnly: true
  },
  {
    header: 'Edit Team Events',
    description: 'Create, read, edit, or delete team events in the system.',
    link: '/admin/team-events',
    adminOnly: true
  },
  {
    header: 'Edit Candidate Decider Instances',
    description: 'Create, edit, or delete Candidate Decider instances',
    link: '/admin/candidate-decider',
    adminOnly: true
  },
  {
    header: 'Dev Portfolios',
    description: 'Edit and review Dev Portfolio assignments',
    link: '/admin/dev-portfolio',
    adminOnly: true
  }
  {
    header: 'Example Unstable Hidden Page',
    description: 'An example page visible to admin only. It can be used to gate unstable features.',
    link: '/admin/hidden',
    adminOnly: true
  },
];

const AdminIndex = (): JSX.Element => <NavigationCard items={navCardItems} />;
export default AdminIndex;
