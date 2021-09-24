import React from 'react';
import { Button, Card, Image, Divider, Header, Icon } from 'semantic-ui-react';
import styles from './SignIn.module.css';
import GoogleLogo from '../static/images/google-logo.png';
import { auth, provider } from '../firebase';

const SignIn: React.FC = () => {
  const onGoogleSignIn = () => {
    auth.signInWithPopup(provider);
  };
  return (
    <div className={styles.SignIn} data-testid="SignIn">
      <div className={styles.header}>
        <Divider horizontal>
          <Header as="h2">
            <Icon name="sign-in" />
            Choose a sign-in method
          </Header>
        </Divider>
      </div>
      <div className={styles.content}>
        <Card.Group>
          <Card>
            <Card.Content>
              <Image size="medium" src={GoogleLogo} />
              <Card.Header>Google</Card.Header>
              <Card.Description>Sign in using Google OAuth2</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui one buttons">
                <Button basic color="blue" onClick={onGoogleSignIn}>
                  Sign-In
                </Button>
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </div>
    </div>
  );
};

export default SignIn;
