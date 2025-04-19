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
      <nav className="flex justify-between items-center px-4 md:px-8 py-4 max-w-[1184px] mx-4 md:mx-32 sm:mx-8 lg:mx-auto bg-background-1 relative z-10">
        <Link href="/" className="focusState rounded-sm">
          <Image
            src="/logo.svg"
            alt="Cornell Digital Tech & Innovation logo"
            width={269}
            height={48}
            className="md:min-w-[269px] h-10 md:h-12 w-auto"
          />
        </Link>

        {/* Desktop Links */}
        <div className="flex gap-8 items-center">
          <ul className="hidden min-[1200px]:flex gap-8 text-foreground-3 h-10 items-center">
            {navLinks.map(({ href, label }) => (
              <li key={href} className="h-10 flex items-center">
                <Link
                  href={href}
                  className={`transition-[color] h-10 duration-[120ms] hover:text-foreground-1 flex items-center relative focusState rounded-sm focus-visible:text-foreground-1 ${
                    pathname === href
                      ? "text-foreground-1 after:content-[''] after:absolute after:bottom-[-21px] after:left-0 after:w-full after:h-[1px] after:bg-foreground-1 after:shadow-[0_-4px_8px_0_var(--foreground-1)]"
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

            {/* Hamburger (Mobile) */}
            <IconButton
              className="min-[1200px]:hidden text-foreground-1 focus:outline-none"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
              variant="tertiary"
            >
              <span>{mobileOpen ? 'CLOSE' : 'MENU'}</span>
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed top-20 left-32 w-[calc(100%-256px)] h-full bg-background-1 z-50 flex flex-col justify-between">
          <ul className="flex flex-col w-full">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-6 h5 text-foreground-1"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="flex px-4 py-6 w-full">
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
