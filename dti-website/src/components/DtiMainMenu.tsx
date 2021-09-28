import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';

import content from '../data/apply.json';
import NavItem from './NavItem';

type Props = { readonly light?: boolean };

const GIVING_DAY = false;

export default function DtiMainMenu({ light }: Props): JSX.Element {
  const [transparent, setTransparent] = useState(true);
  const [navShown, setNavShown] = useState(false);

  const { applicationsOpen } = content;

  const dtiNavBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = (): void => {
      const yOffset =
        window.pageYOffset ||
        window.scrollY ||
        /* eslint-disable no-restricted-globals */
        pageYOffset ||
        scrollY ||
        /* eslint-enable */
        document.documentElement.scrollTop;
      const scrollTop = yOffset - (document.documentElement.clientTop || 0);

      const dtiNavBar = dtiNavBarRef.current;
      if (dtiNavBar != null) {
        const height = dtiNavBar.offsetHeight;
        setTransparent(scrollTop <= height);
      } else {
        setTransparent(false);
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={clsx(
        'navbar',
        'navbar-none',
        'fixed-top',
        'navbar-expand-lg',
        ...(transparent && !navShown
          ? ['navbar-dti', light ? 'navbar-light' : 'navbar-dark', 'bg-transparent']
          : ['navbar-dti', 'navbar-dti-light', 'navbar-light', 'bg-light'])
      )}
      ref={dtiNavBarRef}
    >
      <Navbar.Brand className="navbar-branding-dti" href="#">
        <img className="brand-icon" src="/static/branding/brand-icon.svg" alt="DTI" />
      </Navbar.Brand>

      <Button
        onClick={() => setNavShown((shown) => !shown)}
        className={`navbar-toggler ${navShown ? 'collapsed' : ''}`}
        aria-controls="nav_collapse"
        aria-expanded={navShown ? 'true' : 'false'}
      >
        {navShown ? (
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="36px"
            height="36px"
            viewBox="0 0 24 24"
            enableBackground="new 0 0 24 24"
            xmlSpace="preserve"
          >
            <path fill="none" d="M0,0h24v24H0V0z"></path>
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41z"></path>
          </svg>
        ) : (
          <svg
            height="36"
            viewBox="0 0 24 24"
            width="36"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        )}
      </Button>

      <Navbar.Collapse id="nav_collapse" style={navShown ? {} : { display: 'none' }}>
        <ul className="navbar-nav">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/team/">Team</NavItem>
          <NavItem to="/projects/">Projects</NavItem>
          <NavItem to="/initiatives/">Initiatives</NavItem>
          <NavItem to="/courses/">Courses</NavItem>
          <NavItem to="/sponsor/">Sponsor</NavItem>
          {applicationsOpen ? (
            <NavItem to="/apply/">
              <Button className="apply-button" variant="primary">
                Apply Now!
              </Button>
            </NavItem>
          ) : (
            <NavItem to="/apply/">Apply</NavItem>
          )}
          {GIVING_DAY && (
            <NavItem to="https://givingday.cornell.edu/campaigns/cu-design-and-tech-initiative">
              <Button className="apply-button" variant="primary">
                Give Now!
              </Button>
            </NavItem>
          )}
        </ul>
      </Navbar.Collapse>
    </nav>
  );
}
