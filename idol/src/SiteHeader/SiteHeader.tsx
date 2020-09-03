import React from 'react';
import styles from './SiteHeader.module.css';
import { auth } from '../firebase';
import { Button, Header, Icon } from 'semantic-ui-react';
import dti_logo from '../static/images/dti-logo.png';
import { Emitters } from '../EventEmitter/constant-emitters';

const SiteHeader: React.FC = () => {
  let onSignOut = () => {
    auth.signOut();
  };
  return (
    <div className={styles.SiteHeader} data-testid="SiteHeader">
      <div className={styles.content}>
        <div className={styles.logo_and_title}>
          <div className={styles.menu_icon_container} onClick={() => {
            Emitters.navOpenEmitter.emit(true);
          }}>
            <Icon size="big" className={styles.menu_icon} name="bars" />
          </div>
          <img className={styles.dti_logo} src={dti_logo} alt="DTI logo" />
          <div className={styles.title_conainer}>
            <Header className={styles.title} as="h1">
              I<span className={styles.subtitle}>nternal</span>&nbsp;
              D<span className={styles.subtitle}>TI</span>&nbsp;
              O<span className={styles.subtitle}>rganization</span>&nbsp;
              L<span className={styles.subtitle}>ogic</span>
            </Header>
          </div>
        </div>
        <div className={styles.sign_out_button_container}>
          <Button className={styles.sign_out_button} basic color='red' onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
};

export default SiteHeader;
