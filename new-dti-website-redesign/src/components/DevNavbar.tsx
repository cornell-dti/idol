'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Button from './Button';
import IconButton from './IconButton';

type DevNavbarProps = {
  enabled?: boolean;
};

export default function DevNavbar({ enabled }: DevNavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/test-components', label: 'Components [TEST]' },
    { href: '/test-components', label: 'Full page [TEST]' },
    { href: '/design-system', label: 'Design system' }
  ];

  return (
    <>
      <nav
        className="flex justify-between items-center px-4 md:px-8 py-4 max-w-[1184px] top-20 fixed z-10 bg-background-1 
        mx-4 sm:mx-8 md:mx-32 lg:mx-auto 
        [width:calc(100%-2rem)] sm:[width:calc(100%-4rem)] md:[width:calc(100%-16rem)] 
        lg:left-1/2 lg:-translate-x-1/2 lg:transform"
      >
        <div className="flex gap-8 items-center">
          <ul className="hidden min-[1200px]:flex gap-8 text-foreground-3 h-10 items-center">
            {navLinks.map(({ href, label }) => (
              <li key={href} className="h-10 flex items-center">
                <Link
                  href={href}
                  className={`transition-[color] h-10 duration-[120ms] hover:text-foreground-1 flex items-center relative focusState rounded-sm focus-visible:text-foreground-1 font-medium ${
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
        </div>
      </nav>
    </>
  );
}
