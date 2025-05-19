'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const shouldShowNavbar = !pathname.startsWith('/design-system');

  return (
    <html lang="en">
      <body>
        {shouldShowNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
