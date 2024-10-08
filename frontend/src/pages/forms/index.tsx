import NavigationCard, {
  NavigationCardItem
} from '../../components/Common/NavigationCard/NavigationCard';

import styles from './index.module.css';

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
  }
];

const FormsIndex = (): JSX.Element => (
  <div className={styles.content}>
    <NavigationCard items={navCardItems} />
  </div>
);
export default FormsIndex;
