import './globals.css';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Page from '../../components/page';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any;
  }
}

const inter = Inter({ subsets: ['latin'] });

export const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400']
});

const RootLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const router = useRouter();

  const handleRouteChange = (url: string) => {
    window.gtag('config', 'G-B49CN5ZE3H', {
      page_path: url
    });
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <div className="relative overflow-x-hidden">
          <Page>{children}</Page>
        </div>
      </body>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-B49CN5ZE3H" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B49CN5ZE3H', { page_path: window.location.pathname });
        `
        }}
      />
    </html>
  );
};

export default RootLayout;
