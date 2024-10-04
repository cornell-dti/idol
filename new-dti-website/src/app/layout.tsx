import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <html lang="en">
    <body className={`${inter.className} bg-black`}>
      <Navbar />
      {children}
      <Footer />
    </body>
  </html>
);

export default RootLayout;
