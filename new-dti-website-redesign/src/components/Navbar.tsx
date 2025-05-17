'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRef, useState, useLayoutEffect } from 'react';
import Button from './Button';
import IconButton from './IconButton';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/team', label: 'Team' },
    { href: '/products', label: 'Products' },
    { href: '/course', label: 'Course' },
    { href: '/initiatives', label: 'Initiatives' },
    { href: '/sponsor', label: 'Sponsor' }
  ];

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

      const cameFromHomeOrApply = prevPathname.current === '/' || prevPathname.current === '/apply';
      const nowIsNavLink = navLinks.some((link) => link.href === pathname);

      if (cameFromHomeOrApply && nowIsNavLink) {
        // just set highlight directly with fade-in (no slide animation)
        setHighlightStyle(newStyle);
        prevHighlight.current = newStyle;
      } else {
        // all of this animates movement of highlight from old link to new link smoothly
        // if there's a previous highlight position, jump to it first, then animate to new one
        // otherwise set new position directly
        if (prevHighlight.current) {
          setHighlightStyle(prevHighlight.current);

          requestAnimationFrame(() => {
            setHighlightStyle(newStyle);
            prevHighlight.current = newStyle;
          });
        } else {
          setHighlightStyle(newStyle);
          prevHighlight.current = newStyle;
        }
      }
    } else {
      // no highlight for current pathname (/home and /apply)
      setHighlightStyle(null);
      prevHighlight.current = null;
    }

    prevPathname.current = pathname;
  }, [pathname]);

  return (
    <>
      <nav
        className="flex justify-between items-center px-4 md:px-8 py-4 max-w-[1184px] fixed z-10 bg-background-1 
        mx-4 sm:mx-8 md:mx-32 lg:mx-auto 
        [width:calc(100%-2rem)] sm:[width:calc(100%-4rem)] md:[width:calc(100%-16rem)] 
        lg:left-1/2 lg:-translate-x-1/2 lg:transform"
      >
        <Link href="/" className="focusState rounded-sm">
          <Image
            src="/logo.svg"
            alt="Cornell Digital Tech & Innovation logo"
            width={269}
            height={48}
            className="md:min-w-[269px] h-10 md:h-12 w-auto"
          />
        </Link>

        {/* Desktop links */}
        <div className="flex gap-2 items-center">
          <ul className="hidden min-[1200px]:flex text-foreground-3 h-10 items-center relative">
            {navLinks.map(({ href, label }, i) => (
              <li key={href} className="h-10 flex items-center">
                <Link
                  href={href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  className={`transition-[color] h-10 px-4 duration-[120ms] hover:text-foreground-1 flex items-center relative focusState rounded-full font-medium ${
                    pathname === href ? 'text-foreground-1' : 'text-foreground-3'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Gray pill shape that highlights currently selected page */}
            {highlightStyle && (
              <span
                className="bottom-0 absolute -z-10 rounded-full h-10 bg-background-2"
                ref={highlightRef}
                style={{
                  left: highlightStyle.left,
                  width: highlightStyle.width,
                  opacity: isNavLink ? 1 : 0,
                  pointerEvents: isNavLink ? 'auto' : 'none',
                  transition:
                    'left 0.2s cubic-bezier(.4,0,.2,1), width 0.2s cubic-bezier(.4,0,.2,1), opacity 0.3s ease'
                }}
              />
            )}
          </ul>

          <div className="flex gap-4">
            <Button
              variant="primary"
              size="small"
              href="/apply"
              label="Apply"
              className="max-[600px]:hidden"
            />

            {/* Hamburger icon button */}
            <IconButton
              className="min-[1200px]:hidden text-foreground-1 focus:outline-none"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
              variant="tertiary"
            >
              <span className="flex flex-col gap-1 relative w-6 h-6">
                <span
                  className={`absolute top-1/2 left-0 w-6 h-[1px] bg-foreground-1 rounded-sm transition-transform duration-300 ease-in-out ${
                    mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  }`}
                />
                <span
                  className={`absolute top-1/2 left-0 w-6 h-[1px] bg-foreground-1 rounded-sm transition-left duration-300 ease-in-out ${
                    mobileOpen ? 'opacity-0 left-[-16px]' : ''
                  }`}
                />
                <span
                  className={`absolute top-1/2 left-0 w-6 h-[1px] bg-foreground-1 rounded-sm transition-transform duration-300 ease-in-out ${
                    mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  }`}
                />
              </span>
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile links */}
      {mobileOpen && (
        <div className="fixed top-[81px] left-4 sm:left-8 md:left-32 w-[calc(100%-32px)] sm:w-[calc(100%-64px)] md:w-[calc(100%-256px)] h-full bg-background-1 z-50 flex flex-col justify-between">
          <ul className="flex flex-col w-full p-2 md:p-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block px-2 md:px-4 py-3 h5 text-foreground-1 hover:bg-background-2 rounded-md transition-[background-color] transition-duration-[50ms] focusState"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="flex px-2 md:px-4 py-3 w-full">
              <Button
                className="w-full"
                variant="primary"
                href="/apply"
                label="Apply"
                onClick={() => setMobileOpen(false)}
              />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
