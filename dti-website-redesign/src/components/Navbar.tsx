import Link from 'next/link';
import styles from './Navbar.module.css';

// URLs will be the same as title, unless 'url' specified
type NavbarItem = {
  title: string;
  url?: string;
};

const items: NavbarItem[] = ['team', 'products', 'courses', 'initiatives', 'sponsors', 'join'].map(
  (title) => ({ title })
);

type Props = {
  hidden?: boolean;
};

const Navbar = ({ hidden }: Props): JSX.Element =>
  hidden ? (
    <></>
  ) : (
    <div className={styles.navbarContainer}>
      <>
        <Link href="/">
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <a className={styles.navLogo}>
            <img src="/branding/wordmark.png" alt="wordmark" />
          </a>
        </Link>

        <ul className={styles.navMenu}>
          {items.map(({ title, url }, index) => (
            <li key={index}>
              <Link href={url || `/${title}`}>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <a className={styles.navTitle}>{title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </>
    </div>
  );

export default Navbar;
