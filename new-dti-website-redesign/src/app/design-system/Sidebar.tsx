'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import navItems from './nav.config';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full border-l border-border-1 bg-background-1 fixed w-[260px] z-10 overflow-scroll">
      <nav className="flex flex-col">
        <div className="p-4 border-b-1 border-border-1">
          <h5>IDOL Design System</h5>
          <Link href="/" className="text-accent-red underline">
            Back to home
          </Link>
        </div>

        {navItems.map(({ category, items }) => (
          <div
            key={category ?? null}
            className="p-4 border-b-1 border-border-1 flex flex-col gap-2"
          >
            {category && <p className="ml-4 font-medium">{category}</p>}
            <ul className="flex flex-col gap-1">
              {items.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block focusState px-4 py-2 rounded-lg hover:bg-background-2 ${
                      pathname === href ? 'bg-background-2' : 'bg-background-1 text-foreground-3'
                    }`}
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
