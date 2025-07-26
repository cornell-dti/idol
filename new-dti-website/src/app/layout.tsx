'use client';

import './globals.css';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import Page from '../../components/page';
import useGoogleAnalytics from '../hooks/useGoogleAnalytics';
import { MEASUREMENT_ID } from '../consts';

const inter = Inter({ subsets: ['latin'] });

export const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400']
});

const RootLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  useGoogleAnalytics(MEASUREMENT_ID);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <div className="relative overflow-x-hidden">
          <Page>{children}</Page>
        </div>
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
      </body>
    </html>
  );
};

export default RootLayout;
