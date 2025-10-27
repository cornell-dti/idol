import Link from 'next/link';
import React from 'react';
import { Divider } from 'semantic-ui-react';
import styles from './Homepage.module.css';
import NavigationCard, { NavigationCardItem } from '../../Common/NavigationCard/NavigationCard';
import { ENABLE_COFFEE_CHAT } from '../../../consts';

const everyoneItems: readonly NavigationCardItem[] = [
  {
    header: 'Edit Profile',
    description: "Edit your profile information on DTI's website.",
    link: '/forms/profile'
  },
  {
    header: 'Sign-In Form',
    description: 'Sign in to an event.',
    link: '/forms/signin',
    disabled: true
  },
  {
    header: 'Shoutouts',
    description: 'Give someone a shoutout or view your past given shoutouts.',
    link: '/forms/shoutouts'
  },
  {
    header: 'Team Event Credits',
    description: 'Track your team event credits.',
    link: '/forms/teamEventCredits'
  },
  {
    header: 'Coffee Chats',
    description: 'Submit your coffee chats.',
    link: '/forms/coffeeChats',
    adminOnly: !ENABLE_COFFEE_CHAT
  }
];

const devItems: readonly NavigationCardItem[] = [
  {
    header: 'Dev Portfolio Assignments',
    description: 'Submit opened and reviewed pull requests.',
    link: '/forms/devPortfolio'
  }
];

const Homepage: React.FC = () => (
  <div className={styles.Homepage} data-testid="Homepage">
    <div className={styles.content}>
      <div className={styles.intro}>
        <h1>Welcome to IDOL!</h1>
        <p>
          If you encounter any issues with IDOL, or needing help finding something, join the
          <span>
            {' '}
            <Link href="https://cornelldti.slack.com/channels/idol-support">
              #idol-support
            </Link>{' '}
          </span>
          channel on Slack. There, you can give a detailed explanation of the issue you're having
          (with screenshots if applicable), and an IDOL team member will get back to you as soon as
          possible! You can also use this channel to suggest improvements or give feedback about
          your experience.
        </p>
      </div>
      <div className={styles.quickActions}>
        <div>
          <h2>For Everyone</h2>
          <Divider />
          <p className={styles.sectionDescription}>
            Check out your profile or log your attendance at a DTI event!
          </p>
          <NavigationCard items={everyoneItems} />
        </div>

        <div>
          <h2>For Devs</h2>
          <Divider />
          <p className={styles.sectionDescription}>
            Submit your dev portfolio assignments!{' '}
            <b>
              Check your IDOL profile to make sure your "GitHub" field has the URL to the GitHub
              profile you use for your subteam.
            </b>
          </p>
          <NavigationCard items={devItems} />
        </div>
      </div>
    </div>
  </div>
);

export default Homepage;
