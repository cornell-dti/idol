'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import navItems from './nav.config';
import IconButton from '../../../components/IconButton';
import SidebarIcon from '../../../components/icons/SidebarIcon';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        variant="tertiary"
        className="md:hidden fixed top-4 left-4 z-30 group !bg-background-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <SidebarIcon />
      </IconButton>

      <div
        className={`fixed inset-0 z-10 bg-black/40 transition-opacity duration-300 md:hidden backdrop-blur-[4px] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 h-full w-[260px] z-20 bg-background-1 border-r border-border-1 overflow-auto
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:static md:translate-x-0 md:w-[260px] md:block`}
      >
        <nav className="flex flex-col" aria-hidden={!isOpen}>
          <div className="flex gap-2 p-4 pt-20 md:p-4 border-b border-border-1 ">
            <Link href="/" className="rounded-sm interactive activeState flex items-center gap-2">
              <Image src="/logo.svg" alt="" width={32} height={32} />
              <span>Back to DTI homepage</span>
            </Link>
          </div>

          {navItems.map(({ category, items }) => (
            <div
              key={category ?? null}
              className="p-2 border-b border-border-1 flex flex-col gap-2"
            >
              {category && <p className="ml-4 !font-medium">{category}</p>}
              <ul className="flex flex-col gap-1">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block focusState px-4 py-2 rounded-lg hover:bg-background-2 interactive activeState ${
                        pathname === href ? 'bg-background-2' : 'bg-background-1 text-foreground-3'
                      }`}
                      aria-current={pathname === href ? 'page' : undefined}
                    >
                      <p>{label}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
