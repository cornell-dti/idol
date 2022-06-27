import styles from './Footer.module.css';

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
    </div>
    <div className={styles.copyrightContainer}>Cornell Design & Tech Initiative &copy; 2022</div>
  </div>
);

export default Footer;
