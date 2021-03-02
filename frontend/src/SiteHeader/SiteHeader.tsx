import React, { useState } from 'react';
import styles from './SiteHeader.module.css';
import { auth } from '../firebase';
import { Button, Header, Icon } from 'semantic-ui-react';
import dti_logo from '../static/images/dti-logo.png';
import { Emitters } from '../EventEmitter/constant-emitters';

const SiteHeader: React.FC = () => {
  let onSignOut = () => {
    auth.signOut();
  };
  const [idolOpen, setIdolOpen] = useState(false);
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
          <div className={styles.title_conainer}
            onMouseEnter={() => setIdolOpen(true)}
            onMouseLeave={() => setIdolOpen(false)}>
            <Header className={styles.title} as="h1">
              I<div className={idolOpen ? styles.subtitleOpen : styles.subtitleClosed}>nternal&nbsp;</div>
              D<div className={idolOpen ? styles.subtitleOpen : styles.subtitleClosed}>TI&nbsp;</div>
              O<div className={idolOpen ? styles.subtitleOpen : styles.subtitleClosed}>rganization&nbsp;</div>
              L<div className={idolOpen ? styles.subtitleOpen : styles.subtitleClosed}>ogic</div>
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
