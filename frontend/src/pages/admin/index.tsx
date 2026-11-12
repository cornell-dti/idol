import { CalendarDotsIcon } from '@phosphor-icons/react/dist/csr/CalendarDots';
import { EyeSlashIcon } from '@phosphor-icons/react/dist/csr/EyeSlash';
import { PathIcon } from '@phosphor-icons/react/dist/csr/Path';
import { UserSquareIcon } from '@phosphor-icons/react/dist/csr/UserSquare';
import { UsersThreeIcon } from '@phosphor-icons/react/dist/csr/UsersThree';
import {
  CalendarStarIcon,
  CoffeeIcon,
  GitBranchIcon,
  GraduationCapIcon,
  LinkIcon,
  ListChecksIcon,
  MegaphoneIcon,
  RocketLaunchIcon,
  ScalesIcon,
  WalletIcon
} from '../../design-system-2026/icons';
import NavigationCard, {
  NavigationCardItem
} from '../../components/Common/NavigationCard/NavigationCard';

import styles from './index.module.css';

const navCardItems: readonly NavigationCardItem[] = [
  {
    header: 'Member Information Review',
    description: 'Approve the new info from IDOL.',
    link: '/admin/member-review',
    icon: ListChecksIcon,
    adminOnly: true
  },
  {
    header: 'Site Deployer',
    description: 'Approve the new info from IDOL and redeploy the site.',
    link: '/admin/site-deployer',
    icon: RocketLaunchIcon,
    adminOnly: true
  },
  {
    header: 'Sign-In Creator',
    description: 'Create a new sign-in code/link!',
    link: '/admin/signin-creator',
    icon: LinkIcon,
    adminOnly: true
  },
  {
    header: 'View Shoutouts',
    description: 'View recent shoutouts',
    link: '/admin/shoutouts',
    icon: MegaphoneIcon,
    adminOnly: true
  },
  {
    header: 'Edit Users',
    description: 'Create, read, edit, or delete individual users of the system.',
    link: '/admin/edit',
    icon: UserSquareIcon,
    adminOnly: true
  },
  {
    header: 'Edit Teams',
    description: 'Create, read, edit, or delete teams in the system.',
    link: '/admin/teams/edit',
    icon: UsersThreeIcon,
    adminOnly: true
  },
  {
    header: 'Edit Team Events',
    description: 'Create, read, edit, or delete team events in the system.',
    link: '/admin/team-events',
    icon: CalendarStarIcon,
    adminOnly: true
  },
  {
    header: 'Edit Recruitment Timeline',
    description: 'Create, read, edit, or delete recruitment timeline events.',
    link: '/admin/recruitment-timeline',
    icon: PathIcon,
    adminOnly: true
  },
  {
    header: 'Edit Candidate Decider Instances',
    description: 'Create, edit, or delete Candidate Decider instances',
    link: '/admin/candidate-decider',
    icon: ScalesIcon,
    adminOnly: true
  },
  {
    header: 'Dev Portfolios',
    description: 'Edit and review Dev Portfolio assignments',
    link: '/admin/dev-portfolio',
    icon: GitBranchIcon,
    adminOnly: true
  },
  {
    header: 'Example Unstable Hidden Page',
    description: 'An example page visible to admin only. It can be used to gate unstable features.',
    link: '/admin/hidden',
    icon: EyeSlashIcon,
    adminOnly: true
  },
  {
    header: 'Review Coffee Chats',
    description: 'Review coffee chat submissions!',
    link: '/admin/coffee-chats',
    icon: CoffeeIcon,
    adminOnly: true
  },
  {
    header: 'Edit Interview Scheduler',
    description: 'Create or edit interview scheduler instances',
    link: '/admin/interview-scheduler',
    icon: CalendarDotsIcon,
    adminOnly: true
  },
  {
    header: 'Edit Alumni',
    description: 'Create or edit Alumni instances',
    link: '/admin/alumni-admin-view',
    icon: GraduationCapIcon,
    adminOnly: true
  },
  {
    header: 'Reimbursement Dashboard',
    description: 'View team budgets and manage reimbursement requests.',
    link: '/admin/reimbursement',
    icon: WalletIcon,
    adminOnly: true
  }
];

const AdminIndex = (): JSX.Element => (
  <div className={styles.content}>
    <NavigationCard items={navCardItems} />
  </div>
);
export default AdminIndex;
