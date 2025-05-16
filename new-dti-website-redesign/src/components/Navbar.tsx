'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
        <div className="flex gap-8 items-center">
          <ul className="hidden min-[1200px]:flex gap-8 text-foreground-3 h-10 items-center">
            {navLinks.map(({ href, label }) => (
              <li key={href} className="h-10 flex items-center">
                <Link
                  href={href}
                  className={`transition-[color] h-10 duration-[120ms] hover:text-foreground-1 flex items-center relative focusState rounded-sm font-medium ${
                    pathname === href
                      ? "text-foreground-1 after:content-[''] after:absolute after:bottom-[-21px] after:left-0 after:w-full after:h-[2px] after:bg-foreground-1 after:shadow-[0_-4px_8px_0_var(--foreground-1)] after:rounded-full"
                      : 'text-foreground-3'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button variant="primary" href="/apply" label="Apply" className="max-[600px]:hidden" />

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
