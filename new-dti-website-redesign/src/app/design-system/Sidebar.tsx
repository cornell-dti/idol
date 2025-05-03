'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function DesignSystem() {
  const pathname = usePathname();

  const navItems = [
    {
      category: null,
      items: [{ href: '/design-system', label: 'Introduction' }]
    },
    {
      category: 'Styles',
      items: [
        { href: '/design-system/styles/color', label: 'Color' },
        { href: '/design-system/styles/typography', label: 'Typography' },
        { href: '/design-system/styles/layout', label: 'Layout' }
      ]
    },
    {
      category: 'Components',
      items: [
        { href: '/design-system/components/button', label: 'Button' },
        { href: '/design-system/components/input', label: 'Input' }
      ]
    }
  ];

  return (
    <aside className="w-[259px]">
      <nav className="space-y-4 text-sm">
        <div className="p-4">
          <h5>IDOL Design System</h5>
        </div>

        {navItems.map(({ category, items }) => (
          <div key={category ?? 'general'} className="p-4">
            {category && <h6 className="mb-2">{category}</h6>}
            <ul className="space-y-1">
              {items.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block px-2 py-1 rounded-md transition-colors ${
                      pathname === href ? 'bg-background-2 text-white' : 'hover:bg-muted'
                    }`}
                  >
                    {label}
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
