import Image from 'next/image';
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
        <Image src={appStoreIcon} />
      </a>
      <a href="mailto: hello@cornelldti.org">
        <Image src={emailIcon} />
      </a>
      <a href="https://facebook.com/cornelldti" target="_blank" rel="noreferrer noopener">
        <Image src={facebookIcon} />
      </a>
      <a href="https://github.com/cornell-dti" target="_blank" rel="noreferrer noopener">
        <Image src={githubIcon} />
      </a>
      <a href="https://www.example.com" target="_blank" rel="noreferrer noopener">
        <Image src={googleIcon} />
      </a>
      <a href="http://www.instagram.com/cornelldti" target="_blank" rel="noreferrer noopener">
        <Image src={instagramIcon} />
      </a>
    </div>
    <div className={styles.copyrightContainer}>Cornell Design & Tech Initiative &copy; 2022</div>
  </div>
);

export default Footer;
