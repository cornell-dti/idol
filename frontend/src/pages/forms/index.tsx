import NavigationCard, {
  NavigationCardItem
} from '../../components/Common/NavigationCard/NavigationCard';
import { ENABLE_COFFEE_CHAT } from '../../consts';

const navCardItems: readonly NavigationCardItem[] = [
  { header: 'Sign-In Form', description: 'Sign in to an event!', link: '/forms/signin' },
  {
    header: 'Shoutouts',
    description: 'Give someone a shoutout or view your past given shoutouts.',
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
  },
  {
    header: 'Dev Portfolio Assignments',
    description: 'Submit opened and reviewed pull requests.',
    link: '/forms/devPortfolio'
  },
  {
    header: 'Coffee Chats',
    description: 'Submit your coffee chats.',
    link: '/forms/coffeeChats',
    adminOnly: !ENABLE_COFFEE_CHAT
  }
];

const FormsIndex = (): JSX.Element => <NavigationCard items={navCardItems} />;
export default FormsIndex;
