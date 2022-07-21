import styles from './Footer.module.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import React from 'react';

type Icon = {
  link: string;
  src: string;
  alt: string;
};

const icons: Icon[] = [
  {
    src: '/static/icons/instagram.svg',
    link: 'https://www.instagram.com/cornelldti',
    alt: 'instagram icon'
  },
  {
    src: '/static/icons/facebook.svg',
    link: 'https://www.facebook.com/cornelldti',
    alt: 'facebook icon'
  },
  {
    src: '/static/icons/github.svg',
    link: 'https://www.github.com/cornell-dti',
    alt: 'github icon'
  }
];

const EmailIcon: React.FC = () => {
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  return (
    <OverlayTrigger
      key={'top'}
      placement={'top'}
      show={true}
      overlay={
        <Tooltip id={`tooltip-top`}>
          {isAlertVisible && (
            <img
              className={styles.emailCopyNotification}
              src={'/static/icons/emailCopied.svg'}
              alt={'email copy notif icon'}
            />
          )}
        </Tooltip>
      }
    >
      <img
        className={styles.socialIcon}
        src={'/static/icons/email.svg'}
        alt={'email icon'}
        onClick={() => {
          navigator.clipboard.writeText('hello@cornelldti.org');
          setIsAlertVisible(true);
          setTimeout(() => {
            setIsAlertVisible(false);
          }, 4000);
        }}
      />
    </OverlayTrigger>
  );
};

const Footer: React.FC = () => (
  <div className={styles.footer}>
    <div className={styles.innerFooter}>
      <div className={styles.iconContainer}>
        <EmailIcon />
        {icons.map((icon, i) => (
          <a key={i} href={icon.link} target="_blank" rel="noreferrer noopener">
            <img className={styles.socialIcon} src={icon.src} alt={icon.alt} />
          </a>
        ))}
      </div>
      <div className={styles.copyrightContainer}>Cornell Design & Tech Initiative &copy; 2022</div>
    </div>
  </div>
);

export default Footer;
