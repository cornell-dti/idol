'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from './Button';

type DevNavbarProps = {
  className?: string;
};

export default function DevNavbar({ className = '' }: DevNavbarProps) {
  const [visible, setVisible] = useState(true);

  const navLinks = [
    { href: '/test-components', label: 'Components [TEST]' },
    { href: '/test-page', label: 'Full page [TEST]' },
    { href: '/design-system', label: 'Design system' }
  ];

  if (!visible) return null;

  return (
    <nav
      className={`flex justify-between items-center px-4 md:px-8 py-4 max-w-[1184px] top-20 fixed z-30
        mx-4 sm:mx-8 md:mx-32 lg:mx-auto 
        [width:calc(100%-2rem)] sm:[width:calc(100%-4rem)] md:[width:calc(100%-16rem)] 
        lg:left-1/2 lg:-translate-x-1/2 lg:transform bg-[#f9cb1599] backdrop-blur-[40px] ${className}`}
    >
      <div className="h-1 w-full bg-[repeating-linear-gradient(135deg,_#facc15_0px,_#facc15_16px,_#000_16px,_#000_32px)] absolute top-0 left-0" />

      <h6>Dev mode</h6>

      <div className="flex gap-8 items-center align-items-center">
        <div className="flex gap-8 items-center">
          <ul className="hidden min-[1200px]:flex gap-8 text-foreground-3 h-10 items-center">
            {navLinks.map(({ href, label }) => (
              <li key={href} className="h-10 flex items-center">
                <Link
                  href={href}
                  className="transition-[color] text-foreground-1 h-10 duration-[120ms] flex items-center relative focusState rounded-sm font-medium underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => setVisible(false)}
          className="text-xs bg-transparent border-1 border-yellow-200 !px-2 !h-8 text-yellow-200 hover:bg-transparent"
          label="Hide"
        />
      </div>

      <div className="h-1 w-full bg-[repeating-linear-gradient(135deg,_#facc15_0px,_#facc15_16px,_#000_16px,_#000_32px)] absolute bottom-0 left-0" />
    </nav>
  );
}
