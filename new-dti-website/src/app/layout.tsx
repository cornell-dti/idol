'use client';

import './globals.css';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Page from '../../components/page';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any;
  }
}
const MEASUREMENT_ID = 'G-B49CN5ZE3H';
const inter = Inter({ subsets: ['latin'] });

export const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400']
});

const RootLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const pathname = usePathname();

  const handleRouteChange = (path: string) => {
    window.gtag('config', MEASUREMENT_ID, {
      page_path: path
    });
  };

  useEffect(() => {
    handleRouteChange(pathname);
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <div className="relative overflow-x-hidden">
          <Page>{children}</Page>
        </div>
      </body>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}', { page_path: window.location.pathname });
        `
        }}
      />
    </html>
  );
};

export default RootLayout;
