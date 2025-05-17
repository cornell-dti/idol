'use client';

import './globals.css';
import Navbar from '../components/Navbar';
import { usePathname } from 'next/navigation';

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
