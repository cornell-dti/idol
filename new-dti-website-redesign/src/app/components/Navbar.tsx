'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/team', label: 'Team' },
    { href: '/products', label: 'Products' },
    { href: '/course', label: 'Course' },
    { href: '/initiatives', label: 'Initiatives' },
    { href: '/sponsor', label: 'Sponsor' }
  ];

  return (
    <nav className="flex justify-between px-8 py-4 max-w-[1184px] mx-4 md:mx-32 sm:mx-8 lg:mx-auto bg-background-1">
      <Link href="/" className="focusState rounded-sm">
        <Image
          src="/logo.svg"
          alt="Cornell Digital Tech & Innovation logo"
          width={220}
          height={48}
          className="h-12 w-auto"
        />
      </Link>

      <div className="flex gap-8 items-center">
        <ul className="flex gap-8 text-foreground-3 h-full items-center">
          {navLinks.map(({ href, label }) => (
            <li key={href} className="h-full flex items-center">
              <Link
                href={href}
                className={`transition-[color] h-full duration-[120ms] hover:text-foreground-1 flex items-center relative focusState rounded-sm
                  
                  ${
                    pathname === href
                      ? "text-foreground-1 after:content-[''] after:absolute after:bottom-[-16.5px] after:left-0 after:w-full after:h-[1px] after:bg-foreground-1 after:shadow-[0_-4px_8px_0_var(--foreground-1)]"
                      : 'text-foreground-3'
                  }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Button variant="primary" href="/apply" label="Apply" />
      </div>
    </nav>
  );
}
