'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import navItems from './nav.config';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full border-l border-border-1 bg-background-1 fixed w-[260px] z-10 overflow-auto">
      <nav className="flex flex-col">
        <div className="flex gap-2 p-4 border-b-1 border-border-1">
          <Link href="/" className="rounded-sm interactive activeState flex items-center gap-2">
            <Image src="/logo.svg" alt="" width={32} height={32} />
            <span>Back to DTI homepage</span>
          </Link>
        </div>

        {navItems.map(({ category, items }) => (
          <div
            key={category ?? null}
            className="p-2 border-b-1 border-border-1 flex flex-col gap-2"
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
  );
}
