import { SignInIcon } from '@phosphor-icons/react/dist/csr/SignIn';
import { SquaresFourIcon } from '@phosphor-icons/react/dist/csr/SquaresFour';
import NavigationCard, {
  NavigationCardItem
} from '../../components/Common/NavigationCard/NavigationCard';
import { ENABLE_COFFEE_CHAT } from '../../consts';

import {
  CalendarStarIcon,
  CoffeeIcon,
  GitBranchIcon,
  MegaphoneIcon,
  UserIcon,
  WalletIcon
} from '../../design-system-2026/icons';

import styles from './index.module.css';

const navCardItems: readonly NavigationCardItem[] = [
  {
    header: 'Sign-In Form',
    description: 'Sign in to an event!',
    link: '/forms/signin',
    icon: SignInIcon,
    disabled: true
  },
  {
    header: 'Shoutouts',
    description: 'Give someone a shoutout or view your past given shoutouts.',
    link: '/forms/shoutouts',
    icon: MegaphoneIcon
  },
  {
    header: 'Edit Profile',
    description: "Edit your profile information on DTI's website.",
    link: '/forms/profile',
    icon: UserIcon
  },
  {
    header: 'Team Event Credits',
    description: 'Track your team event credits.',
    link: '/forms/teamEventCredits',
    icon: CalendarStarIcon,
    adminOnly: true
  },
  {
    header: 'Dev Portfolio Assignments',
    description: 'Submit opened and reviewed pull requests.',
    link: '/forms/devPortfolio',
    icon: GitBranchIcon
  },
  {
    header: 'Coffee Chats',
    description: 'Submit your coffee chats.',
    link: '/forms/coffeeChats',
    icon: CoffeeIcon,
    adminOnly: !ENABLE_COFFEE_CHAT
  },
  {
    header: 'Reimbursement',
    description: 'View your team budget and submit reimbursement requests.',
    link: '/forms/reimbursement',
    icon: WalletIcon
  },
  {
    header: 'Coffee Chat Categories',
    description: 'Submit your coffee chat categories for the semester.',
    link: '/forms/coffeeChatCategories',
    icon: SquaresFourIcon
  }
];

const FormsIndex = (): JSX.Element => (
  <div className={styles.content}>
    <NavigationCard items={navCardItems} />
  </div>
);
export default FormsIndex;
