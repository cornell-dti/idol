import Link from 'next/link';
import React from 'react';
import { Button, Card, Divider } from 'semantic-ui-react';
import styles from './Homepage.module.css';

import { NavigationCardItem } from '../../Common/NavigationCard/NavigationCard';

const everyoneItems: readonly NavigationCardItem[] = [
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
  { header: 'Sign-In Form', description: 'Sign in to an event.', link: '/forms/signin' },
  {
    header: 'Shoutouts',
    description: 'Give someone a shoutout or view your past given shoutouts.',
    link: '/forms/shoutouts'
  },
  {
    header: 'Team Event Credits',
    description: 'Track your team event credits.',
    link: '/forms/teamEventCredits'
  }
];

const devItems: readonly NavigationCardItem[] = [
  {
    header: 'Dev Portfolio Assignments',
    description: 'Submit opened and reviewed pull requests.',
    link: '/forms/devPortfolio'
  }
];

const NavCard = ({
  className,
  header,
  description,
  link
}: NavigationCardItem & { className?: string }): JSX.Element => (
  <div className={className ? `styles[${className}]` : styles.card}>
    <Card key={link}>
      <Card.Content>
        <Card.Header>{header}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui one buttons">
          <Link href={link}>
            <Button basic color="blue">
              Go To
            </Button>
          </Link>
        </div>
      </Card.Content>
    </Card>
  </div>
);

const Footer: React.FC = () => (
  <Link href="/hall-of-fame">
    <div className={styles.copyrightContainer}>
      Cornell Design & Tech Initiative &copy; 2023 | Made with {'<3'} by IDOL
    </div>
  </Link>
);

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
          <Card.Group className={styles.quick}>
            {everyoneItems.map((item) => (
              <NavCard key={item.link} {...item} />
            ))}
          </Card.Group>
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
          <Card.Group className={styles.quick}>
            {devItems.map((item) => (
              <NavCard className={styles.devCard} key={item.link} {...item} />
            ))}
          </Card.Group>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Homepage;
