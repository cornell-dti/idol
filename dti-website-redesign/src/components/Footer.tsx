import { useRef, useState } from 'react';
import { Overlay } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from './Footer.module.css';

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
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const target = useRef(null);
  return (
    <>
      <img
        className={styles.socialIcon}
        src={'/static/icons/email.svg'}
        alt={'email icon'}
        ref={target}
        onClick={() => {
          navigator.clipboard.writeText('hello@cornelldti.org');
          setIsNotificationVisible(true);
        }}
      />
      <Overlay placement={'top'} show={isNotificationVisible} target={target.current}>
        <div style={{ position: 'absolute' }} id={`tooltip-top`}>
          <img
            className={styles.emailCopyNotification}
            src={'/static/icons/emailCopied.svg'}
            alt={'email copy notif icon'}
            onAnimationEnd={() => setIsNotificationVisible(false)}
          />
        </div>
      </Overlay>
    </>
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
