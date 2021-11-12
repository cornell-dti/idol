import NavigationCard, { NavigationCardItem } from '../../components/Common/NavigationCard';

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
    link: '/forms/teamEventCredits',
    adminOnly: true
  }
];

const FormsIndex = (): JSX.Element => <NavigationCard items={navCardItems} />;
export default FormsIndex;
