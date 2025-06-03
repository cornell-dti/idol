'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Button from './Button';
import IconButton from './IconButton';

type NavbarProps = {
  demo?: boolean;
};

export default function Navbar({ demo }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/team', label: 'Team' },
    { href: '/products', label: 'Products' },
    { href: '/course', label: 'Course' },
    { href: '/initiatives', label: 'Initiatives' },
    { href: '/sponsor', label: 'Sponsor' }
  ];

  // ######################################
  // NAVBAR LINK HIGHLIGHT ANIMATION LOGIC:
  // ######################################

  // to only show the highlight on the links above (not on Home or Apply)
  const isNavLink = navLinks.some((link) => link.href === pathname);

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const highlightRef = useRef<HTMLSpanElement>(null);

  // current position + width of the highlight
  const [highlightStyle, setHighlightStyle] = useState<{ left: number; width: number } | null>(
    null
  );

  // we need previous position + width of highlight to animate the highlight from the
  // old one to the new one smoothly
  const prevHighlight = useRef<{ left: number; width: number } | null>(null);

  // to track previous path
  const prevPathname = useRef<string | null>(null);

  // using useLayoutEffect instead of useEffect to ensure that the layout reads and
  // updates the position/width before the screen repaints (to prevent flicker and
  // achieve the smooth animation
  useLayoutEffect(() => {
    const idx = navLinks.findIndex((link) => link.href === pathname);
    const linkEl = linkRefs.current[idx];

    if (linkEl) {
      // measure position + width of actual link
      // and then create new style for positioning the new highlight
      const { offsetLeft, offsetWidth } = linkEl;
      const newStyle = { left: offsetLeft, width: offsetWidth };

      // avoid animating from a stale position when coming from Home or Apply
      const cameFromHomeOrApply = prevPathname.current === '/' || prevPathname.current === '/apply';
      const nowIsNavLink = navLinks.some((link) => link.href === pathname);

      if (cameFromHomeOrApply && nowIsNavLink) {
        // just set highlight directly  (no slide animation)
        setHighlightStyle(newStyle);
        prevHighlight.current = newStyle;
      } else if (prevHighlight.current) {
        // all of this animates movement of highlight from old link to new link smoothly
        // if there's a previous highlight position, jump to it first, then animate to new one
        // otherwise set new position directly
        setHighlightStyle(prevHighlight.current);

        requestAnimationFrame(() => {
          setHighlightStyle(newStyle);
          prevHighlight.current = newStyle;
        });
      } else {
        setHighlightStyle(newStyle);
        prevHighlight.current = newStyle;
      }
    } else {
      // no highlight for current pathname (/home and /apply)
      setHighlightStyle(null);
      prevHighlight.current = null;
    }

    prevPathname.current = pathname;
  }, [pathname]);

  // ####################################
  // NAVBAR CHANGE COLOR ON SCROLL LOGIC:
  // ####################################

  const [scrolledPast, setScrolledPast] = useState(false);

  // tracks if user has scrolled past treshold and updates state accordingly
  useEffect(() => {
    const scrollThreshold = 600;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolledPast(window.scrollY > scrollThreshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    setScrolledPast(window.scrollY > scrollThreshold);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // ############################################
  // REMOVE SCROLL ON BODY WHEN MOBILE MENU OPEN:
  // ############################################

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Clean up on component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // #######################
  // MOBILE ANIMATION LOGIC:
  // #######################

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // mobile menu height state
  const [, setMenuHeight] = useState(0);

  useLayoutEffect(() => {
    if (mobileOpen && mobileMenuRef.current) {
      setMenuHeight(mobileMenuRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [mobileOpen]);

  // mobile menu links state
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      const timeout = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setShowContent(false);
    }
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`top-0 z-60 w-full 
          transition-colors transition-border duration-300 border-b-1 border-transparent
        ${scrolledPast ? 'bg-background-1 !border-border-1' : ''}
        ${demo ? '' : 'fixed left-1/2 translate-x-[-50%] transform'}
        `}
      >
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-[1184px] mx-auto">
          <Link href="/" className="focusState rounded-sm interactive activeState">
            <Image
              src="/wordmark.svg"
              alt="Cornell Digital Tech & Innovation logo"
              width={269}
              height={48}
              className="md:min-w-[269px] h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop links */}
          <div className="flex gap-2 items-center">
            <ul className="hidden min-[900px]:flex h-10 items-center relative">
              {navLinks.map(({ href, label }, i) => (
                <li key={href} className="h-10 flex items-center">
                  <Link
                    href={href}
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    className={` h-10 px-4  hover:text-foreground-1 flex items-center relative interactive activeState focusState rounded-full font-medium
                    ${pathname === href ? 'text-foreground-1' : 'text-foreground-3'}`}
                    aria-current={pathname === href ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}

              {/* Gray pill shape that highlights currently selected page */}
              {highlightStyle && (
                <span
                  className="bottom-0 absolute -z-10 rounded-full h-10 bg-[rgba(255,255,255,0.1)] border-1 border-[rgba(255,255,255,0.1)] backdrop-blur-[32px]"
                  ref={highlightRef}
                  style={{
                    left: highlightStyle.left,
                    width: highlightStyle.width,
                    opacity: isNavLink ? 1 : 0,
                    transition:
                      'left 0.2s cubic-bezier(.4,0,.2,1), width 0.2s cubic-bezier(.4,0,.2,1), opacity 0.3s ease'
                  }}
                />
              )}
            </ul>

            <div className="flex gap-3">
              {!mobileOpen && (
                <Button
                  variant="primary"
                  size="small"
                  href="/apply"
                  label="Apply"
                  className="max-[600px]:hidden"
                />
              )}

              {/* Hamburger icon button */}
              <IconButton
                className="min-[900px]:hidden text-foreground-1 focus:outline-none"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
                variant="tertiary"
                size="small"
              >
                <span className="flex flex-col gap-1 relative w-4 h-4">
                  <span
                    className={`absolute top-2.5 left-0 w-4 h-[1px] bg-foreground-1 rounded-sm transition-transform duration-300 ease-in-out ${
                      mobileOpen ? 'rotate-45 translate-y-[-2px]' : '-translate-y-2'
                    }`}
                  />
                  <span
                    className={`absolute top-1/2 left-0 w-4 h-[1px] bg-foreground-1 rounded-sm transition-left duration-300 ease-in-out ${
                      mobileOpen ? 'opacity-0 left-[-16px]' : ''
                    }`}
                  />
                  <span
                    className={`absolute top-1.5 left-0 w-4 h-[1px] bg-foreground-1 rounded-sm transition-transform duration-300 ease-in-out ${
                      mobileOpen ? '-rotate-45 translate-y-[2px]' : 'translate-y-2'
                    }`}
                  />
                </span>
              </IconButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile links */}
      <div
        className={`${
          demo ? '' : 'fixed'
        } top-0 w-full z-50 bg-background-1 overflow-hidden transition-[height] duration-400 ease-in-out min-[900px]:hidden`}
        style={{ height: mobileOpen ? `100%` : '0px' }}
      >
        <div
          ref={mobileMenuRef}
          className={`pt-20 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ul className="flex flex-col w-full p-2 md:p-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-4 md:px-4 py-3 h6 text-foreground-1 hover:bg-background-2 rounded-md transition-all duration-300 ease-out transform
                  ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="flex px-2 md:px-4 py-3 w-full">
              <Button
                className={`w-full !transition-all !duration-300 ease-out transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                variant="primary"
                href="/apply"
                label="Apply"
                onClick={() => setMobileOpen(false)}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
