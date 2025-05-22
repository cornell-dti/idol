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
  const shouldShowNavbar = !pathname.startsWith('/design-system');

  // Focus <body> on route change to reset tab order
  useEffect(() => {
    const body = document.body;
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
          className={`${baseStyles} absolute -inset-4 opacity-0 z-50
          focus-visible:opacity-100 focus-visible:top-4 focus-visible:left-4 transition-all duration-[120ms] px-6 h-12 bg-foreground-1 text-background-1 hover:bg-foreground-2 w-fit`}
        >
          Skip to main content
        </a>

        {shouldShowNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
