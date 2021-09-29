import NavigationCard, { NavigationCardItem } from '../../components/Common/NavigationCard';

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

const AdminIndex = (): JSX.Element => <NavigationCard items={navCardItems} />;
export default AdminIndex;
