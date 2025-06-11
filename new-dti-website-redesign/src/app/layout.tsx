'use client';

import { useEffect } from 'react';
import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import { baseStyles } from '../components/Button';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // on design system pages, we don't want to show the navbar
  const shouldShowNavbar = !pathname.startsWith('/design-system');

  // on apply page, we want the "Skip to main content" link to be more offset (because of the banner)
  const skipToMainOffset = pathname.startsWith('/apply');

  // Focus <body> on route change to reset tab order
  useEffect(() => {
    const { body } = document;
    if (body) {
      body.focus();
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body className="relative" tabIndex={-1}>
        <a
          id="skip-to-main"
          href="#main-content"
          className={`${baseStyles} absolute -inset-4 opacity-0 z-[-1]
          focus-visible:opacity-100 ${
            skipToMainOffset ? 'focus-visible:top-20' : 'focus-visible:top-4'
          } focus-visible:left-4 focus-visible:z-70 transition-all duration-[120ms] px-6 h-12 bg-foreground-1 text-background-1 hover:bg-foreground-2 w-fit`}
        >
          Skip to main content
        </a>

        {shouldShowNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
