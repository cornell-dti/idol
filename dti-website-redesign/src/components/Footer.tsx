import styles from './Footer.module.css';
import appStoreIcon from '../../public/static/icons/app-store.png';
import emailIcon from '../../public/static/icons/email.png';
import facebookIcon from '../../public/static/icons/facebook.png';
import githubIcon from '../../public/static/icons/github.png';
import googleIcon from '../../public/static/icons/google.png';
import instagramIcon from '../../public/static/icons/instagram.png';

const Footer: React.FC = () => (
  <div className={styles.footer}>
    <div className={styles.iconContainer}>
      <a href="https://www.example.com" target="_blank" rel="noreferrer noopener">
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
      </a>
    </div>
    <div className={styles.copyrightContainer}>Cornell Design & Tech Initiative &copy; 2022</div>
  </div>
);

export default Footer;
