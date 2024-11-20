import './globals.css';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import Page from '../../components/page';

const inter = Inter({ subsets: ['latin'] });

export const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400']
});

const RootLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <html lang="en">
    <body className={`${inter.className} bg-black`}>
      <div className="relative overflow-x-hidden">
        <Page>{children}</Page>
      </div>
    </body>
  </html>
);

export default RootLayout;
