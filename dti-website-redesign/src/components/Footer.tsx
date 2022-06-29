import styles from './Footer.module.css';

type Icon = {
  link: string;
  src: string;
  alt: string;
};

const icons: Icon[] = [
  {
    src: '/static/icons/email.svg',
    link: 'mailto:hello@cornelldti.org',
    alt: 'email icon'
  },
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

const Footer: React.FC = () => (
  <div className={styles.footer}>
    <div className={styles.innerFooter}>
      <div className={styles.iconContainer}>
        {icons.map((icon) => (
          <a href={icon.link} target="_blank" rel="noreferrer noopener">
            <img className={styles.socialIcon} src={icon.src} alt={icon.alt} />
          </a>
        ))}
      </div>
      <div className={styles.copyrightContainer}>Cornell Design & Tech Initiative &copy; 2022</div>
    </div>
  </div>
);

export default Footer;
