import React from 'react';

import { Button, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { signInWithPopup } from 'firebase/auth';
import styles from './SignIn.module.css';
import GoogleLogo from '../../../static/images/google-logo.png';
import { auth, provider } from '../../../firebase';

const SignIn: React.FC = () => {
  const onGoogleSignIn = () => {
    signInWithPopup(auth, provider).catch((err) => {
      console.error(err);
    });
  };

  return (
    <div data-testid="SignIn">
      <Grid textAlign="center" className={styles.container} verticalAlign="middle">
        <Grid.Column className={styles.column}>
          <Header as="h1" className={styles.title} textAlign="center">
            <Image src="/dti-logo.png" />
            IDOL
          </Header>
          <Segment>
            <Button basic color="black" fluid onClick={onGoogleSignIn}>
              <Image avatar src={GoogleLogo.src} />
              Sign in with Google
            </Button>
          </Segment>
          <Message>
            Not registered? Contact us @{' '}
            <a
              href="https://cornelldti.slack.com/channels/idol-support"
              target="_blank"
              rel="noopener noreferrer"
            >
              #idol-support
            </a>
            .
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default SignIn;
