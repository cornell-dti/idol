import './globals.css';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400']
});

const RootLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <html lang="en">
    <div className={inter.className}>
      {' '}
      {children}
      <Navbar />{' '}
    </div>
    <div className={ibm_plex_mono.className}>
      {' '}
      <Footer />{' '}
    </div>
  </html>
);

export default RootLayout;
