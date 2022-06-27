import styles from './Footer.module.css';
import appStoreIcon from '../../public/static/icons/app-store.png';
import emailIcon from '../../public/static/icons/email.png';
import facebookIcon from '../../public/static/icons/facebook.png';
import githubIcon from '../../public/static/icons/github.png';
import googleIcon from '../../public/static/icons/google.png';
import instagramIcon from '../../public/static/icons/instagram.png';
import { isContext } from 'vm';
import { IncomingMessage } from 'http';

type Icon = {
  link: string;
  src: string;
  alt: string;
};

const icons: Icon[] = [
  {
    src: '/static/icons/app-store.png',
    link: 'https://www.example.com',
    alt: 'app store icon'
  },
  {
    src: '/static/icons/email.png',
    link: 'emailto: hello@cornelldti.org',
    alt: 'email icon'
  },
  {
    src: '/static/icons/facebook.png',
    link: 'https://www.facebook.com/cornelldti',
    alt: 'facebook icon'
  },
  {
    src: '/static/icons/github.png',
    link: 'https://www.github.com/cornell-dti',
    alt: 'github icon'
  },
  {
    src: '/static/icons/google.png',
    link: 'https://www.example.com',
    alt: 'play store icon'
  },
  {
    src: '/static/icons/instagram.png',
    link: 'https://www.instagram.com/cornelldti',
    alt: 'instagram icon'
  }
];

const Footer: React.FC = () => (
  <div className={styles.footer}>
    <div className={styles.iconContainer}>
      {icons.map((icon) => (
        <a href={icon.link} target="_blank" rel="noreferrer noopener">
          <img src={icon.src} alt={icon.alt} />
        </a>
      ))}

      {/* <a href="https://www.example.com" target="_blank" rel="noreferrer noopener">
        <img src={appStoreIcon} alt="app store icon" />
      </a>
      <a href="mailto: hello@cornelldti.org">
        <img src={emailIcon} alt="email icon" />
      </a>
      <a href="https://facebook.com/cornelldti" target="_blank" rel="noreferrer noopener">
        <img src={facebookIcon} alt="facebook icon" />
      </a>
      <a href="https://github.com/cornell-dti" target="_blank" rel="noreferrer noopener">
        <img src={githubIcon} alt="github icon" />
      </a>
      <a href="https://www.example.com" target="_blank" rel="noreferrer noopener">
        <img src={googleIcon} alt="google icon" />
      </a>
      <a href="http://www.instagram.com/cornelldti" target="_blank" rel="noreferrer noopener">
        <img src={instagramIcon} alt="instagram icon" />
      </a> */}
    </div>
    <div className={styles.copyrightContainer}>Cornell Design & Tech Initiative &copy; 2022</div>
  </div>
);

export default Footer;
